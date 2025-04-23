import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export const TAGS = {
  collections: 'collections',
  products: 'products',
  cart: 'cart',
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log({
    called: 'called me',
    req,
  })

  // const secret = req.nextUrl.searchParams.get('secret')
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
