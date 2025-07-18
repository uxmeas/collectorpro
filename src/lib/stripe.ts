import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Initialize Stripe with public key
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Subscription Plans for CollectorPRO NBA Top Shot Analytics
export const SUBSCRIPTION_PLANS = {
  STARTER: {
    id: 'starter',
    name: 'Starter Plan',
    description: 'Perfect for casual collectors',
    price: 9.99,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
    features: [
      'Up to 100 moments tracking',
      'Basic portfolio analytics',
      'Market price alerts',
      'Export data (CSV)',
      'Email support'
    ],
    limits: {
      moments: 100,
      alerts: 5,
      exports: 10
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro Plan',
    description: 'For serious collectors and traders',
    price: 19.99,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    popular: true,
    features: [
      'Unlimited moments tracking',
      'Advanced analytics & insights',
      'Real-time market data',
      'Portfolio optimization',
      'Custom alerts & notifications',
      'Advanced export options',
      'Priority support',
      'API access'
    ],
    limits: {
      moments: -1, // unlimited
      alerts: -1,
      exports: -1
    }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise Plan', 
    description: 'For professional traders and institutions',
    price: 49.99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    features: [
      'Everything in Pro',
      'Multi-portfolio management',
      'Team collaboration tools',
      'White-label options',
      'Custom integrations',
      'Dedicated account manager',
      '24/7 phone support',
      'Custom analytics reports'
    ],
    limits: {
      moments: -1,
      alerts: -1,
      exports: -1,
      portfolios: -1
    }
  }
}

// Trial period configuration
export const TRIAL_CONFIG = {
  duration: 7, // days
  enabled: true,
  requirePaymentMethod: false, // Allow trial without card
  trialEndBehavior: 'cancel' // What happens when trial ends
}

// Payment error handling configuration
export const PAYMENT_ERROR_CONFIG = {
  retryAttempts: 3,
  retryDelay: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  gracePeriod: 3, // days after failed payment
  dunningManagement: true, // Enable Stripe's dunning management
  automaticRetries: true
}

// Utility functions
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export const getPlanById = (planId: string) => {
  return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.id === planId)
}

// Create customer in Stripe
export const createStripeCustomer = async (email: string, name?: string) => {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      product: 'CollectorPRO NBA Top Shot Analytics',
      source: 'web_signup'
    }
  })
}

// Create subscription with trial support
export const createSubscription = async (
  customerId: string, 
  priceId: string, 
  trialDays?: number
) => {
  const subscriptionData: Stripe.SubscriptionCreateParams = {
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { 
      save_default_payment_method: 'on_subscription',
      payment_method_types: ['card']
    },
    expand: ['latest_invoice.payment_intent'],
  }

  // Add trial period if specified
  if (trialDays && TRIAL_CONFIG.enabled) {
    subscriptionData.trial_period_days = trialDays
    subscriptionData.trial_settings = {
      end_behavior: {
        missing_payment_method: TRIAL_CONFIG.trialEndBehavior as 'cancel' | 'create_invoice' | 'pause'
      }
    }
  }

  return await stripe.subscriptions.create(subscriptionData)
}

// Create payment intent for one-time payments
export const createPaymentIntent = async (amount: number, customerId?: string) => {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    customer: customerId,
    metadata: {
      product: 'CollectorPRO NBA Top Shot Analytics'
    }
  })
}

// Get customer subscriptions
export const getCustomerSubscriptions = async (customerId: string) => {
  return await stripe.subscriptions.list({
    customer: customerId,
    status: 'all', // Get all subscriptions including past due, canceled, etc.
    expand: ['data.default_payment_method']
  })
}

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string, cancelAtPeriodEnd: boolean = true) => {
  if (cancelAtPeriodEnd) {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    })
  } else {
    return await stripe.subscriptions.cancel(subscriptionId)
  }
}

// Reactivate subscription
export const reactivateSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false
  })
}

// Update subscription (upgrade/downgrade)
export const updateSubscription = async (subscriptionId: string, newPriceId: string) => {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [{
      id: subscription.items.data[0].id,
      price: newPriceId,
    }],
    proration_behavior: 'create_prorations',
  })
}

// Create billing portal session
export const createBillingPortalSession = async (customerId: string, returnUrl: string) => {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
    configuration: process.env.STRIPE_PORTAL_CONFIGURATION_ID, // Optional: custom portal config
  })
}

// Create checkout session with enhanced features
export const createCheckoutSession = async (
  priceId: string,
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string,
  trialDays?: number
) => {
  const sessionData: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl || `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_DOMAIN}/pricing?canceled=true`,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    customer_update: {
      address: 'auto',
      name: 'auto',
    },
    subscription_data: {
      metadata: {
        product: 'CollectorPRO NBA Top Shot Analytics'
      }
    }
  }

  // Add trial period if specified
  if (trialDays && TRIAL_CONFIG.enabled) {
    sessionData.subscription_data!.trial_period_days = trialDays
  }

  return await stripe.checkout.sessions.create(sessionData)
}

// Handle payment failures
export const handlePaymentFailure = async (invoiceId: string) => {
  const invoice = await stripe.invoices.retrieve(invoiceId)
  
  // Configure dunning management if enabled
  if (PAYMENT_ERROR_CONFIG.dunningManagement) {
    await stripe.invoices.update(invoiceId, {
      collection_method: 'charge_automatically',
      payment_settings: {
        payment_method_types: ['card']
      }
    })
  }
  
  return invoice
}

// Get customer payment methods
export const getCustomerPaymentMethods = async (customerId: string) => {
  return await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card'
  })
}

// Attach payment method to customer
export const attachPaymentMethod = async (paymentMethodId: string, customerId: string) => {
  return await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId
  })
}

// Set default payment method
export const setDefaultPaymentMethod = async (customerId: string, paymentMethodId: string) => {
  return await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId
    }
  })
}

// Create invoice for manual billing
export const createInvoice = async (customerId: string, priceId: string) => {
  const invoice = await stripe.invoices.create({
    customer: customerId,
    collection_method: 'send_invoice',
    days_until_due: 30
  })
  
  // Add line items separately
  await stripe.invoiceItems.create({
    customer: customerId,
    invoice: invoice.id,
    price: priceId,
    quantity: 1
  })
  
  return invoice
}

// Send invoice to customer
export const sendInvoice = async (invoiceId: string) => {
  return await stripe.invoices.sendInvoice(invoiceId)
}

// Webhook event types
export const WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  SUBSCRIPTION_CREATED: 'customer.subscription.created',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
  INVOICE_PAID: 'invoice.payment_succeeded',
  INVOICE_FAILED: 'invoice.payment_failed',
  PAYMENT_SUCCEEDED: 'payment_intent.succeeded',
  PAYMENT_FAILED: 'payment_intent.payment_failed',
  CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END: 'customer.subscription.trial_will_end',
  INVOICE_PAYMENT_ACTION_REQUIRED: 'invoice.payment_action_required',
  CUSTOMER_SUBSCRIPTION_UPDATED: 'customer.subscription.updated'
} as const

// Subscription status helpers
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  UNPAID: 'unpaid',
  TRIALING: 'trialing',
  INCOMPLETE: 'incomplete',
  INCOMPLETE_EXPIRED: 'incomplete_expired'
} as const

// Check if subscription is active
export const isSubscriptionActive = (status: string) => {
  return [SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.TRIALING].includes(status as any)
}

// Check if subscription is in trial
export const isSubscriptionTrialing = (status: string) => {
  return status === SUBSCRIPTION_STATUS.TRIALING
}

// Check if subscription is past due
export const isSubscriptionPastDue = (status: string) => {
  return status === SUBSCRIPTION_STATUS.PAST_DUE
}

// Get subscription features based on plan
export const getSubscriptionFeatures = (planId: string) => {
  const plan = getPlanById(planId)
  return plan?.features || []
}

// Get subscription limits based on plan
export const getSubscriptionLimits = (planId: string) => {
  const plan = getPlanById(planId)
  return plan?.limits || {}
}

// Validate subscription access
export const validateSubscriptionAccess = (
  userPlan: string,
  requiredFeature: string,
  currentUsage?: number
) => {
  const limits = getSubscriptionLimits(userPlan)
  
  // Check if feature is unlimited
  if (limits[requiredFeature as keyof typeof limits] === -1) {
    return true
  }
  
  // Check usage limits
  if (currentUsage !== undefined && limits[requiredFeature as keyof typeof limits]) {
    return currentUsage < (limits[requiredFeature as keyof typeof limits] as number)
  }
  
  return true
} 