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
        sizes="15vw"
        loading={loading}
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  )
}

export default Logo
