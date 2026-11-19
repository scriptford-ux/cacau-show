import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const settings = db.getSettings()
    return NextResponse.json(settings)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const updated = db.updateSettings({
      facebook_pixel_id: body.facebook_pixel_id !== undefined ? String(body.facebook_pixel_id).trim() : undefined,
      facebook_access_token: body.facebook_access_token !== undefined ? String(body.facebook_access_token).trim() : undefined,
      facebook_test_code: body.facebook_test_code !== undefined ? String(body.facebook_test_code).trim() : undefined,
      freepay_enabled: body.freepay_enabled !== undefined ? Boolean(body.freepay_enabled) : undefined,
      freepay_public_key: body.freepay_public_key !== undefined ? String(body.freepay_public_key).trim() : undefined,
      freepay_secret_key: body.freepay_secret_key !== undefined ? String(body.freepay_secret_key).trim() : undefined,
      freepay_environment: body.freepay_environment !== undefined ? (body.freepay_environment === 'sandbox' ? 'sandbox' : 'production') : undefined,
    })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
