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
      product: 'CollectorPRO NBA Top Shot Analytics'
    }
  })
}

// Create subscription
export const createSubscription = async (customerId: string, priceId: string) => {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  })
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
    status: 'active',
  })
}

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string) => {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true
  })
}

// Create billing portal session
export const createBillingPortalSession = async (customerId: string, returnUrl: string) => {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

// Create checkout session
export const createCheckoutSession = async (
  priceId: string,
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string
) => {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl || `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_DOMAIN}/pricing`,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  })
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
} as const 