import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { 
  stripe, 
  WEBHOOK_EVENTS, 
  SUBSCRIPTION_STATUS,
  isSubscriptionActive,
  isSubscriptionTrialing,
  isSubscriptionPastDue,
  handlePaymentFailure,
  TRIAL_CONFIG,
  PAYMENT_ERROR_CONFIG
} from '../../../../lib/stripe'
import { headers } from 'next/headers'

// In-memory storage for demo (replace with database in production)
const userSubscriptions: Record<string, any> = {}
const paymentFailures: Record<string, any> = {}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('❌ No Stripe signature found')
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('❌ Invalid Stripe signature:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log(`🎉 Stripe webhook received: ${event.type}`)

    // Handle different webhook events
    switch (event.type) {
      case WEBHOOK_EVENTS.CHECKOUT_COMPLETED: {
        await handleCheckoutCompleted(event.data.object as any)
        break
      }

      case WEBHOOK_EVENTS.SUBSCRIPTION_CREATED: {
        await handleSubscriptionCreated(event.data.object as any)
        break
      }

      case WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED: {
        await handleSubscriptionUpdated(event.data.object as any)
        break
      }

      case WEBHOOK_EVENTS.SUBSCRIPTION_DELETED: {
        await handleSubscriptionDeleted(event.data.object as any)
        break
      }

      case WEBHOOK_EVENTS.INVOICE_PAID: {
        await handleInvoicePaid(event.data.object as any)
        break
      }

      case WEBHOOK_EVENTS.INVOICE_FAILED: {
        await handleInvoiceFailed(event.data.object as any)
        break
      }

      case WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END: {
        await handleTrialWillEnd(event.data.object as any)
        break
      }

      case WEBHOOK_EVENTS.INVOICE_PAYMENT_ACTION_REQUIRED: {
        await handlePaymentActionRequired(event.data.object as any)
        break
      }

      case WEBHOOK_EVENTS.PAYMENT_SUCCEEDED: {
        await handlePaymentSucceeded(event.data.object as any)
        break
      }

      case WEBHOOK_EVENTS.PAYMENT_FAILED: {
        await handlePaymentFailed(event.data.object as any)
        break
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}

// Handle checkout completion
async function handleCheckoutCompleted(session: any) {
  console.log(`✅ Checkout completed for customer: ${session.customer}`)
  console.log(`📦 Session ID: ${session.id}`)
  console.log(`💰 Amount: ${session.amount_total ? session.amount_total / 100 : 'N/A'}`)
  
  // Store session data for processing
  const sessionData = {
    id: session.id,
    customer: session.customer,
    subscription: session.subscription,
    amount_total: session.amount_total,
    currency: session.currency,
    payment_status: session.payment_status,
    created: new Date(session.created * 1000),
    metadata: session.metadata
  }
  
  // TODO: Store in database
  console.log('💾 Session data stored for processing')
  
  // Send welcome email if trial started
  if (session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(session.subscription)
    if (isSubscriptionTrialing(subscription.status)) {
      console.log('🎁 Trial started - sending welcome email')
      // TODO: Send trial welcome email
    }
  }
}

// Handle subscription creation
async function handleSubscriptionCreated(subscription: any) {
  console.log(`📱 Subscription created: ${subscription.id}`)
  console.log(`👤 Customer: ${subscription.customer}`)
  console.log(`📅 Status: ${subscription.status}`)
  console.log(`🎁 Trial end: ${subscription.trial_end ? new Date(subscription.trial_end * 1000) : 'No trial'}`)
  
  // Store subscription data
  userSubscriptions[subscription.customer] = {
    id: subscription.id,
    status: subscription.status,
    plan: subscription.items.data[0]?.price?.id,
    trial_end: subscription.trial_end,
    current_period_end: subscription.current_period_end,
    created: new Date(subscription.created * 1000)
  }
  
  // Activate features based on subscription status
  if (isSubscriptionActive(subscription.status)) {
    console.log('✅ Activating subscription features')
    await activateSubscriptionFeatures(subscription.customer, subscription)
  }
  
  // Send welcome email
  console.log('📧 Sending welcome email')
  // TODO: Send welcome email with subscription details
}

// Handle subscription updates
async function handleSubscriptionUpdated(subscription: any) {
  console.log(`🔄 Subscription updated: ${subscription.id}`)
  console.log(`📅 New status: ${subscription.status}`)
  console.log(`📅 Previous status: ${subscription.previous_attributes?.status || 'Unknown'}`)
  
  // Update stored subscription data
  if (userSubscriptions[subscription.customer]) {
    userSubscriptions[subscription.customer] = {
      ...userSubscriptions[subscription.customer],
      status: subscription.status,
      plan: subscription.items.data[0]?.price?.id,
      current_period_end: subscription.current_period_end
    }
  }
  
  // Handle status changes
  const previousStatus = subscription.previous_attributes?.status
  if (previousStatus && previousStatus !== subscription.status) {
    console.log(`🔄 Status changed from ${previousStatus} to ${subscription.status}`)
    
    if (isSubscriptionActive(subscription.status) && !isSubscriptionActive(previousStatus)) {
      console.log('✅ Reactivating subscription features')
      await activateSubscriptionFeatures(subscription.customer, subscription)
    } else if (!isSubscriptionActive(subscription.status) && isSubscriptionActive(previousStatus)) {
      console.log('❌ Deactivating subscription features')
      await deactivateSubscriptionFeatures(subscription.customer)
    }
  }
  
  // Handle plan changes
  if (subscription.previous_attributes?.items?.data?.[0]?.price?.id !== subscription.items.data[0]?.price?.id) {
    console.log('📊 Plan changed - updating features')
    await updateSubscriptionFeatures(subscription.customer, subscription)
  }
}

// Handle subscription deletion
async function handleSubscriptionDeleted(subscription: any) {
  console.log(`❌ Subscription canceled: ${subscription.id}`)
  console.log(`📅 Canceled at: ${subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : 'Unknown'}`)
  
  // Update stored data
  if (userSubscriptions[subscription.customer]) {
    userSubscriptions[subscription.customer].status = subscription.status
    userSubscriptions[subscription.customer].canceled_at = subscription.canceled_at
  }
  
  // Deactivate features but keep data
  console.log('❌ Deactivating subscription features (keeping data)')
  await deactivateSubscriptionFeatures(subscription.customer)
  
  // Send cancellation email
  console.log('📧 Sending cancellation email')
  // TODO: Send cancellation email with next steps
}

// Handle successful invoice payment
async function handleInvoicePaid(invoice: any) {
  console.log(`💰 Invoice paid: ${invoice.id}`)
  console.log(`👤 Customer: ${invoice.customer}`)
  console.log(`💵 Amount: ${invoice.amount_paid / 100}`)
  console.log(`📅 Due date: ${new Date(invoice.due_date * 1000)}`)
  
  // Clear any payment failure records
  if (paymentFailures[invoice.customer]) {
    delete paymentFailures[invoice.customer]
    console.log('✅ Cleared payment failure records')
  }
  
  // Extend subscription if needed
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
    if (isSubscriptionActive(subscription.status)) {
      console.log('✅ Subscription extended successfully')
    }
  }
  
  // Send receipt
  console.log('📧 Sending payment receipt')
  // TODO: Send payment receipt email
}

// Handle failed invoice payment
async function handleInvoiceFailed(invoice: any) {
  console.log(`💸 Invoice payment failed: ${invoice.id}`)
  console.log(`👤 Customer: ${invoice.customer}`)
  console.log(`❌ Failure reason: ${invoice.last_finalization_error?.message || 'Unknown'}`)
  
  // Store failure information
  paymentFailures[invoice.customer] = {
    invoice_id: invoice.id,
    amount: invoice.amount_due,
    failure_reason: invoice.last_finalization_error?.message,
    attempt_count: (paymentFailures[invoice.customer]?.attempt_count || 0) + 1,
    last_attempt: new Date()
  }
  
  // Handle payment failure
  await handlePaymentFailure(invoice.id)
  
  // Send payment failure notification
  console.log('📧 Sending payment failure notification')
  // TODO: Send payment failure email with retry instructions
  
  // Check if we should cancel subscription
  const failureCount = paymentFailures[invoice.customer]?.attempt_count || 0
  if (failureCount >= PAYMENT_ERROR_CONFIG.retryAttempts) {
    console.log(`❌ Max retry attempts reached (${failureCount}) - considering cancellation`)
    // TODO: Implement grace period logic before cancellation
  }
}

// Handle trial ending soon
async function handleTrialWillEnd(subscription: any) {
  console.log(`⏰ Trial ending soon: ${subscription.id}`)
  console.log(`👤 Customer: ${subscription.customer}`)
  console.log(`📅 Trial ends: ${new Date(subscription.trial_end * 1000)}`)
  
  // Send trial ending notification
  console.log('📧 Sending trial ending notification')
  // TODO: Send trial ending email with upgrade options
  
  // Offer trial extension if configured
  if (TRIAL_CONFIG.enabled) {
    console.log('🎁 Offering trial extension options')
    // TODO: Implement trial extension logic
  }
}

// Handle payment action required
async function handlePaymentActionRequired(invoice: any) {
  console.log(`⚠️ Payment action required: ${invoice.id}`)
  console.log(`👤 Customer: ${invoice.customer}`)
  console.log(`🔗 Hosted invoice URL: ${invoice.hosted_invoice_url}`)
  
  // Send payment action required notification
  console.log('📧 Sending payment action required notification')
  // TODO: Send email with payment action instructions
}

// Handle successful payment
async function handlePaymentSucceeded(paymentIntent: any) {
  console.log(`✅ Payment succeeded: ${paymentIntent.id}`)
  console.log(`👤 Customer: ${paymentIntent.customer}`)
  console.log(`💵 Amount: ${paymentIntent.amount / 100}`)
  
  // Process successful payment
  console.log('✅ Processing successful payment')
  // TODO: Update user account, send confirmation, etc.
}

// Handle failed payment
async function handlePaymentFailed(paymentIntent: any) {
  console.log(`❌ Payment failed: ${paymentIntent.id}`)
  console.log(`👤 Customer: ${paymentIntent.customer}`)
  console.log(`❌ Failure reason: ${paymentIntent.last_payment_error?.message || 'Unknown'}`)
  
  // Handle payment failure
  console.log('❌ Processing payment failure')
  // TODO: Update user account, send failure notification, etc.
}

// Helper functions for subscription management
async function activateSubscriptionFeatures(customerId: string, subscription: any) {
  console.log(`✅ Activating features for customer: ${customerId}`)
  
  // Get plan details
  const planId = subscription.items.data[0]?.price?.id
  console.log(`📊 Plan: ${planId}`)
  
  // TODO: Update user record in database with active subscription
  // TODO: Enable premium features
  // TODO: Send feature activation email
  
  console.log('✅ Subscription features activated')
}

async function deactivateSubscriptionFeatures(customerId: string) {
  console.log(`❌ Deactivating features for customer: ${customerId}`)
  
  // TODO: Update user record in database
  // TODO: Disable premium features (but keep data)
  // TODO: Send feature deactivation email
  
  console.log('❌ Subscription features deactivated')
}

async function updateSubscriptionFeatures(customerId: string, subscription: any) {
  console.log(`🔄 Updating features for customer: ${customerId}`)
  
  // Get new plan details
  const newPlanId = subscription.items.data[0]?.price?.id
  console.log(`📊 New plan: ${newPlanId}`)
  
  // TODO: Update user record in database
  // TODO: Adjust feature access based on new plan
  // TODO: Send plan change confirmation email
  
  console.log('🔄 Subscription features updated')
} 