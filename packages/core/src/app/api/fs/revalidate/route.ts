import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// TODO: Configure secret
export async function POST(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.searchParams.get('path')

  if (!path) {
    return NextResponse.json({
      status: 200,
      revalidated: false,
      now: Date.now(),
      message: 'Missing path to revalidate',
    })
  }

  revalidatePath(path)

  return NextResponse.json({
    status: 200,
    revalidated: true,
    now: Date.now(),
    message: `Revalidated path: ${path}`,
  })
}
