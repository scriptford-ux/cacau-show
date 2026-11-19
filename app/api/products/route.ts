import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const products = db.getProducts()
    return NextResponse.json(products)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Nome e preço são obrigatórios' }, { status: 400 })
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

    const newProduct = db.addProduct({
      name: body.name,
      slug,
      description: body.description || null,
      price: Number(body.price),
      original_price: body.original_price ? Number(body.original_price) : null,
      image_url: body.image_url || '/images/produtos/harry-potter-clean.jpg',
      images: body.images || [body.image_url || '/images/produtos/harry-potter-clean.jpg'],
      category_id: body.category_id || '1',
      stock: body.stock !== undefined ? Number(body.stock) : 50,
      cacaus_points: body.cacaus_points !== undefined ? Number(body.cacaus_points) : 0,
      active: body.active !== undefined ? Boolean(body.active) : true,
      featured: body.featured !== undefined ? Boolean(body.featured) : false,
      promo_badge: body.promo_badge || undefined,
      brand: body.brand || undefined,
    })

    return NextResponse.json(newProduct, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
