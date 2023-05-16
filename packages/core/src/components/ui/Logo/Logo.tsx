import { Image } from 'src/components/ui/Image'
import type { ImageProps } from 'src/components/ui/Image'

interface LogoProps {
  alt: string
  src: string
  loading?: ImageProps['loading']
}

function Logo({ alt, src, loading = 'lazy' }: LogoProps) {
  return (
    <div data-fs-logo>
      <Image
        alt={alt}
        src={src}
        width={0}
        height={0}
        loading={loading}
        style={{ width: '100%', height: 'auto' }}
        sizes="(max-width: 360px) 50vw, (max-width: 768px) 90vw, 50vw"
      />
    </div>
  )
}

export default Logo
