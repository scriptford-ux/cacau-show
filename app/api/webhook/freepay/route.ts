import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    console.log('[FreePay Webhook] Recebido:', JSON.stringify(payload))

    // Formato FreePay: { Id, ExternalId, Status, PaymentMethod, Amount }
    const transactionId = payload.Id || payload.id
    const externalId = payload.ExternalId || payload.externalId
    const status = (payload.Status || payload.status || '').toUpperCase()

    const orderIdToFind = externalId || transactionId

    if (orderIdToFind) {
      const order = db.findOrder(orderIdToFind)
      if (order) {
        if (status === 'PAID') {
          db.updateOrderStatus(order.id, 'paid')
          console.log(`[FreePay Webhook] Pedido ${order.order_number} (${order.id}) atualizado para PAGO!`)
        } else if (status === 'REFUNDED' || status === 'REFUSED' || status === 'EXPIRED') {
          db.updateOrderStatus(order.id, 'cancelled')
          console.log(`[FreePay Webhook] Pedido ${order.order_number} (${order.id}) atualizado para ${status}!`)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[FreePay Webhook Error]:', err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'FreePay Webhook endpoint active' })
}
