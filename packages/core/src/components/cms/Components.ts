import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

import Alert from 'src/components/sections/Alert'
import Hero from 'src/components/sections/Hero'
import Incentives from 'src/components/sections/Incentives'
import Navbar from 'src/components/sections/Navbar'
import RegionBar from 'src/components/sections/RegionBar'

const Footer = dynamic(() => import('src/components/sections/Footer'))
const CartSidebar = dynamic(() => import('src/components/cart/CartSidebar'))
const RegionModal = dynamic(() => import('src/components/region/RegionModal'))
const BannerText = dynamic(() => import('src/components/sections/BannerText'))
const Newsletter = dynamic(() => import('src/components/sections/Newsletter'))
const ProductShelf = dynamic(
  () => import('src/components/sections/ProductShelf')
)
const ProductTiles = dynamic(
  () => import('src/components/sections/ProductTiles')
)

const COMPONENTS: Record<string, ComponentType<any>> = {
  Alert,
  Footer,
  Navbar,
  RegionBar,
  CartSidebar,
  RegionModal,
  BannerText,
  Hero,
  Incentives,
  Newsletter,
  ProductShelf,
  ProductTiles,
}

export default COMPONENTS
