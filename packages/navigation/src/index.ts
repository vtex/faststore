import {
  redirect,
  permanentRedirect,
  useRouter,
  usePathname,
  useParams,
} from 'next/navigation'
import Link, { useLinkStatus } from 'next/link'
import type { RedirectType } from 'next/navigation'
import type { LinkProps } from 'next/link'

export {
  redirect,
  permanentRedirect,
  useRouter,
  usePathname,
  useParams,
  Link,
  useLinkStatus,
}

export type { RedirectType, LinkProps }
