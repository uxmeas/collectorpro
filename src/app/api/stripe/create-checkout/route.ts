import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, getPlanById } from '../../../../lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { planId, customerId } = await req.json()

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    const plan = getPlanById(planId)
    if (!plan) {
      return NextResponse.json({ error: 'Invalid plan ID' }, { status: 400 })
    }

    const session = await createCheckoutSession(
      plan.priceId,
      customerId,
      `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard?success=true`,
      `${process.env.NEXT_PUBLIC_DOMAIN}/pricing?canceled=true`
    )

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
} 