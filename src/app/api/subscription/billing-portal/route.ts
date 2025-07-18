import { NextRequest, NextResponse } from 'next/server'
import { createBillingPortalSession } from '../../../../lib/stripe'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

// In-memory storage for demo (replace with database in production)
const userCustomers: Record<string, string> = {} // email -> stripe customer id

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string }
    const customerId = userCustomers[decoded.email]

    if (!customerId) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    // Create billing portal session
    const session = await createBillingPortalSession(
      customerId,
      `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard`
    )

    return NextResponse.json({ 
      url: session.url 
    })

  } catch (error) {
    console.error('Error creating billing portal session:', error)
    return NextResponse.json({ error: 'Failed to create billing portal session' }, { status: 500 })
  }
} 