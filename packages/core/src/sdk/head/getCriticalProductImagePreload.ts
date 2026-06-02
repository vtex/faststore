import { faststoreLoader } from 'src/components/ui/Image/loader'

export interface CriticalProductImagePreload {
  rel: 'preload'
  as: 'image'
  href: string
  fetchPriority: 'high'
}

export function getCriticalProductImagePreload(
  imageUrl?: string
): CriticalProductImagePreload | null {
  if (!imageUrl) {
    return null
  }

  return {
    rel: 'preload',
    as: 'image',
    href: faststoreLoader({
      src: imageUrl,
      width: 320,
      quality: 75,
    }),
    fetchPriority: 'high',
  }
}
