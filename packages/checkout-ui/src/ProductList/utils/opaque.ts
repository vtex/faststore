import { WITHOUT_STOCK } from '../constants/Availability'

export const opaque = (availability?: string | null) =>
  availability === WITHOUT_STOCK ? { opacity: '.70' } : null
