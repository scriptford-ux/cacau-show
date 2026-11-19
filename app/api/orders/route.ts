import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const orders = db.getOrders()
    return NextResponse.json(orders)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const newOrder = db.addOrder({
      customer_name: body.customer_name || 'Cliente',
      customer_email: body.customer_email || 'cliente@email.com',
      customer_phone: body.customer_phone || '(11) 99999-9999',
      shipping_address: body.shipping_address || {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zip_code: '01001-000',
      },
      items: body.items || [],
      total: Number(body.total) || 0,
      status: body.status || 'pending',
      payment_method: body.payment_method || 'pix',
    })

    return NextResponse.json(newOrder, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
