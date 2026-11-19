import { NextResponse } from 'next/server'
import { db, OrderItem } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, customer, address, payment_method = 'pix', card } = body

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
    }

    if (!customer?.name || !customer?.email) {
      return NextResponse.json({ error: 'Dados do cliente incompletos' }, { status: 400 })
    }

    const settings = db.getSettings()
    const isFreePayEnabled = settings.freepay_enabled ?? true
    const publicKey = settings.freepay_public_key || ''
    const secretKey = settings.freepay_secret_key || ''

    // Calcula valor total
    const totalAmount = items.reduce(
      (sum: number, it: any) => sum + Number(it.price || 0) * Number(it.quantity || 1),
      0
    )
    const amountInCents = Math.round(totalAmount * 100)

    // Formata campos para FreePay
    const cleanPhone = (customer.phone || '').replace(/\D/g, '') || '11999999999'
    const cleanCpf = (customer.cpf || '').replace(/\D/g, '') || '12345678909'
    const cleanZip = (address?.zip_code || '01310-200').replace(/\D/g, '')

    // Host dinâmico para o postback webhook
    const origin = req.headers.get('origin') || req.headers.get('host') || 'http://localhost:3000'
    const postbackUrl = origin.startsWith('http')
      ? `${origin}/api/webhook/freepay`
      : `https://${origin}/api/webhook/freepay`

    let transactionId = `fp_${Date.now()}`
    let pixQrCode = ''
    let pixCode = ''
    let paymentStatus: 'paid' | 'pending' = 'pending'

    // Se as credenciais estiverem preenchidas, dispara chamada real na FreePay Brasil
    if (publicKey && secretKey) {
      try {
        const authHeader = 'Basic ' + Buffer.from(`${publicKey}:${secretKey}`).toString('base64')
        const payload: any = {
          amount: amountInCents,
          payment_method: payment_method === 'credit' || payment_method === 'credit_card' ? 'credit_card' : 'pix',
          postback_url: postbackUrl,
          customer: {
            name: customer.name,
            email: customer.email,
            document: {
              number: cleanCpf,
              type: cleanCpf.length > 11 ? 'cnpj' : 'cpf',
            },
            phone: cleanPhone,
          },
          items: items.map((it: any) => ({
            title: it.name || 'Produto Cacau Show',
            unit_price: Math.round(Number(it.price) * 100),
            quantity: Number(it.quantity || 1),
            tangible: true,
            external_ref: String(it.id || '1'),
          })),
          shipping: {
            fee: 0,
            address: {
              street: address?.street || 'Av. Paulista',
              street_number: String(address?.number || '1000'),
              complementary: address?.complement || '',
              neighborhood: address?.neighborhood || 'Centro',
              city: address?.city || 'São Paulo',
              state: address?.state || 'SP',
              zip_code: cleanZip,
            },
          },
        }

        if (payment_method === 'pix') {
          payload.pix = { expires_in_days: 1 }
        } else if (card) {
          payload.card = card
        }

        const fpRes = await fetch('https://api.freepaybrasil.com/v1/payment-transaction/create', {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        const fpData = await fpRes.json()

        if (fpRes.ok && fpData) {
          // Extrai dados da resposta
          const dataObj = Array.isArray(fpData.data) ? fpData.data[0] : (fpData.data || fpData)
          transactionId = dataObj.id || dataObj.Id || transactionId
          
          if (dataObj.pix) {
            const pixObj = Array.isArray(dataObj.pix) ? dataObj.pix[0] : dataObj.pix
            pixCode = pixObj.qr_code || pixObj.emv || ''
            pixQrCode = pixObj.url || ''
          }
          if (dataObj.status === 'PAID') {
            paymentStatus = 'paid'
          }
        } else {
          console.warn('[FreePay API Aviso]', fpData)
        }
      } catch (fpErr) {
        console.error('[FreePay API Erro de Comunicação]', fpErr)
      }
    }

    // Se não tiver PIX retornado da API (ou sem chaves cadastradas), gera código PIX padrão para simulação funcional
    if (!pixCode) {
      pixCode = `00020126580014br.gov.bcb.pix0136${transactionId}520400005303986540${totalAmount.toFixed(2)}5802BR5916Cacau Show Brasil6009SAO PAULO62070503***6304`
    }
    if (!pixQrCode) {
      pixQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixCode)}`
    }

    // Salva o pedido no banco de dados local
    const orderItems: OrderItem[] = items.map((it: any) => ({
      id: String(it.id || it.product_id),
      name: it.name || it.product?.name || 'Item Cacau Show',
      price: Number(it.price || it.product?.price || 0),
      quantity: Number(it.quantity || 1),
      image_url: it.image_url || it.product?.image_url || '/images/produtos/harry-potter-clean.jpg',
    }))

    const newOrder = db.addOrder({
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone || '',
      customer_cpf: cleanCpf,
      shipping_address: {
        street: address?.street || 'Rua das Flores',
        number: address?.number || '123',
        complement: address?.complement || '',
        neighborhood: address?.neighborhood || 'Bairro Nobre',
        city: address?.city || 'São Paulo',
        state: address?.state || 'SP',
        zip_code: address?.zip_code || '01310-200',
      },
      items: orderItems,
      total: Number(totalAmount.toFixed(2)),
      status: paymentStatus,
      payment_method: payment_method === 'credit' ? 'credit_card' : 'pix',
      freepay_transaction_id: transactionId,
      pix_code: pixCode,
      pix_qr_code: pixQrCode,
    })

    return NextResponse.json({
      success: true,
      order: newOrder,
      transaction_id: transactionId,
      pix: {
        qr_code_image: pixQrCode,
        qr_code_text: pixCode,
        expires_in_minutes: 30,
      },
    })
  } catch (err: any) {
    console.error('[FreePay Checkout Error]:', err)
    return NextResponse.json({ error: err.message || 'Erro ao processar pagamento' }, { status: 500 })
  }
}
