import { NextRequest, NextResponse } from 'next/server'
import { 
  stripe,
  createStripeCustomer,
  getCustomerSubscriptions,
  createBillingPortalSession,
  getCustomerPaymentMethods,
  attachPaymentMethod,
  setDefaultPaymentMethod,
  updateSubscription,
  cancelSubscription,
  reactivateSubscription,
  isSubscriptionActive,
  isSubscriptionTrialing,
  getSubscriptionFeatures,
  getSubscriptionLimits,
  validateSubscriptionAccess
} from '../../../lib/stripe'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

// In-memory storage for demo (replace with database in production)
const userCustomers: Record<string, string> = {} // email -> stripe customer id

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string }
    const customerId = userCustomers[decoded.email]

    if (!customerId) {
      return NextResponse.json({ 
        subscription: null,
        features: [],
        limits: {},
        status: 'no_subscription'
      })
    }

    // Get customer subscriptions
    const subscriptions = await getCustomerSubscriptions(customerId)
    const activeSubscription = subscriptions.data.find(sub => 
      isSubscriptionActive(sub.status) || isSubscriptionTrialing(sub.status)
    )

    if (!activeSubscription) {
      return NextResponse.json({ 
        subscription: null,
        features: [],
        limits: {},
        status: 'no_subscription'
      })
    }

    // Get plan details
    const planId = activeSubscription.items.data[0]?.price?.id
    const features = getSubscriptionFeatures(planId)
    const limits = getSubscriptionLimits(planId)

    return NextResponse.json({
      subscription: {
        id: activeSubscription.id,
        status: activeSubscription.status,
        plan: planId,
        trial_end: activeSubscription.trial_end,
        current_period_end: activeSubscription.current_period_end,
        cancel_at_period_end: activeSubscription.cancel_at_period_end
      },
      features,
      limits,
      status: activeSubscription.status,
      isTrialing: isSubscriptionTrialing(activeSubscription.status),
      isActive: isSubscriptionActive(activeSubscription.status)
    })

  } catch (error) {
    console.error('Error getting subscription:', error)
    return NextResponse.json({ error: 'Failed to get subscription' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string }
    const { action, planId, paymentMethodId } = await req.json()

    switch (action) {
      case 'create_customer':
        return await handleCreateCustomer(decoded.email)
      
      case 'upgrade':
        return await handleUpgrade(decoded.email, planId)
      
      case 'downgrade':
        return await handleDowngrade(decoded.email, planId)
      
      case 'cancel':
        return await handleCancel(decoded.email)
      
      case 'reactivate':
        return await handleReactivate(decoded.email)
      
      case 'add_payment_method':
        return await handleAddPaymentMethod(decoded.email, paymentMethodId)
      
      case 'set_default_payment_method':
        return await handleSetDefaultPaymentMethod(decoded.email, paymentMethodId)
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error handling subscription action:', error)
    return NextResponse.json({ error: 'Failed to handle subscription action' }, { status: 500 })
  }
}

// Create Stripe customer
async function handleCreateCustomer(email: string) {
  try {
    const customer = await createStripeCustomer(email)
    userCustomers[email] = customer.id
    
    return NextResponse.json({ 
      success: true, 
      customerId: customer.id 
    })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}

// Upgrade subscription
async function handleUpgrade(email: string, planId: string) {
  try {
    const customerId = userCustomers[email]
    if (!customerId) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const subscriptions = await getCustomerSubscriptions(customerId)
    const activeSubscription = subscriptions.data.find(sub => 
      isSubscriptionActive(sub.status) || isSubscriptionTrialing(sub.status)
    )

    if (!activeSubscription) {
      return NextResponse.json({ error: 'No active subscription to upgrade' }, { status: 400 })
    }

    const updatedSubscription = await updateSubscription(activeSubscription.id, planId)
    
    return NextResponse.json({ 
      success: true, 
      subscription: updatedSubscription 
    })
  } catch (error) {
    console.error('Error upgrading subscription:', error)
    return NextResponse.json({ error: 'Failed to upgrade subscription' }, { status: 500 })
  }
}

// Downgrade subscription
async function handleDowngrade(email: string, planId: string) {
  try {
    const customerId = userCustomers[email]
    if (!customerId) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const subscriptions = await getCustomerSubscriptions(customerId)
    const activeSubscription = subscriptions.data.find(sub => 
      isSubscriptionActive(sub.status) || isSubscriptionTrialing(sub.status)
    )

    if (!activeSubscription) {
      return NextResponse.json({ error: 'No active subscription to downgrade' }, { status: 400 })
    }

    const updatedSubscription = await updateSubscription(activeSubscription.id, planId)
    
    return NextResponse.json({ 
      success: true, 
      subscription: updatedSubscription 
    })
  } catch (error) {
    console.error('Error downgrading subscription:', error)
    return NextResponse.json({ error: 'Failed to downgrade subscription' }, { status: 500 })
  }
}

// Cancel subscription
async function handleCancel(email: string) {
  try {
    const customerId = userCustomers[email]
    if (!customerId) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const subscriptions = await getCustomerSubscriptions(customerId)
    const activeSubscription = subscriptions.data.find(sub => 
      isSubscriptionActive(sub.status) || isSubscriptionTrialing(sub.status)
    )

    if (!activeSubscription) {
      return NextResponse.json({ error: 'No active subscription to cancel' }, { status: 400 })
    }

    const canceledSubscription = await cancelSubscription(activeSubscription.id, true)
    
    return NextResponse.json({ 
      success: true, 
      subscription: canceledSubscription 
    })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
}

// Reactivate subscription
async function handleReactivate(email: string) {
  try {
    const customerId = userCustomers[email]
    if (!customerId) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const subscriptions = await getCustomerSubscriptions(customerId)
    const canceledSubscription = subscriptions.data.find(sub => 
      sub.cancel_at_period_end && isSubscriptionActive(sub.status)
    )

    if (!canceledSubscription) {
      return NextResponse.json({ error: 'No canceled subscription to reactivate' }, { status: 400 })
    }

    const reactivatedSubscription = await reactivateSubscription(canceledSubscription.id)
    
    return NextResponse.json({ 
      success: true, 
      subscription: reactivatedSubscription 
    })
  } catch (error) {
    console.error('Error reactivating subscription:', error)
    return NextResponse.json({ error: 'Failed to reactivate subscription' }, { status: 500 })
  }
}

// Add payment method
async function handleAddPaymentMethod(email: string, paymentMethodId: string) {
  try {
    const customerId = userCustomers[email]
    if (!customerId) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const paymentMethod = await attachPaymentMethod(paymentMethodId, customerId)
    
    return NextResponse.json({ 
      success: true, 
      paymentMethod 
    })
  } catch (error) {
    console.error('Error adding payment method:', error)
    return NextResponse.json({ error: 'Failed to add payment method' }, { status: 500 })
  }
}

// Set default payment method
async function handleSetDefaultPaymentMethod(email: string, paymentMethodId: string) {
  try {
    const customerId = userCustomers[email]
    if (!customerId) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const customer = await setDefaultPaymentMethod(customerId, paymentMethodId)
    
    return NextResponse.json({ 
      success: true, 
      customer 
    })
  } catch (error) {
    console.error('Error setting default payment method:', error)
    return NextResponse.json({ error: 'Failed to set default payment method' }, { status: 500 })
  }
} 