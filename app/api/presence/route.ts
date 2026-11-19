import { NextResponse } from 'next/server'

interface VisitorSession {
  lastSeen: number
  path: string
}

declare global {
  // eslint-disable-next-line no-var
  var activeVisitors: Map<string, VisitorSession> | undefined
}

const activeVisitors = globalThis.activeVisitors ?? new Map<string, VisitorSession>()
if (process.env.NODE_ENV !== 'production') {
  globalThis.activeVisitors = activeVisitors
} else {
  globalThis.activeVisitors = activeVisitors
}

const CLEANUP_WINDOW_MS = 35 * 1000 // 35 segundos

function pruneStaleVisitors() {
  const now = Date.now()
  activeVisitors.forEach((data, id) => {
    if (now - data.lastSeen > CLEANUP_WINDOW_MS) {
      activeVisitors.delete(id)
    }
  })
}

export async function GET() {
  pruneStaleVisitors()
  return NextResponse.json({
    liveVisitors: activeVisitors.size,
    timestamp: Date.now(),
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { visitorId, path } = body

    if (visitorId && typeof visitorId === 'string') {
      activeVisitors.set(visitorId, {
        lastSeen: Date.now(),
        path: path || '/',
      })
    }

    pruneStaleVisitors()

    return NextResponse.json({
      success: true,
      liveVisitors: activeVisitors.size,
    })
  } catch (error) {
    pruneStaleVisitors()
    return NextResponse.json({
      liveVisitors: activeVisitors.size,
    })
  }
}
