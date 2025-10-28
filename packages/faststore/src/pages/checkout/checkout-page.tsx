import { permanentRedirect } from 'next/navigation'

export async function CheckoutPage() {
  permanentRedirect(process.env.NEXT_PUBLIC_FS_CHECKOUT_URL ?? '')
}
