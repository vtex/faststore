import {
  Accordion as UIAccordion,
  AccordionButton as UIAccordionButton,
  AccordionItem as UIAccordionItem,
  AccordionPanel as UIAccordionPanel,
  Icon as UIIcon,
  List as UIList,
  Table as UITable,
  TableBody as UITableBody,
  TableCell as UITableCell,
  TableRow as UITableRow,
} from '@faststore/ui'
import { useState } from 'react'

interface ArticleLabels {
  /**
   * Label for the "description" article.
   *
   * @default 'Description'
   */
  description: string
  /**
   * Label for the "About this product" article.
   *
   * @default 'About this product'
   */
  about: string
  /**
   * Label for the "Product highlights" article.
   *
   * @default 'Product highlights'
   */
  highlights: string
  /**
   * Label for the "Learn more" article.
   *
   * @default 'Learn more'
   */
  learnMore: string
}

interface Props {
  /**
   * Controls which articles will be initially expanded.
   *
   * @default 'first'
   */
  initiallyExpanded?: 'first' | 'all' | 'none'
  /**
   * Defines the labels used in each article.
   *
   * @default {description: 'Description', about: 'About this product', highlights: 'Product highlights', learnMore: 'Learn More' }
   */
  labels?: Partial<ArticleLabels>
}

/**
 * Maps 'initiallyExpanded' prop values to indices
 */
const INITIALLY_EXPANDED_MAP = {
  first: [0],
  all: [0, 1, 2, 3],
  none: [],
}

/**
 * Default article labels
 */
const DEFAULT_LABELS: ArticleLabels = {
  description: 'Description',
  about: 'About this product',
  highlights: 'Product highlights',
  learnMore: 'Learn More',
} as const

function ProductDescription({
  initiallyExpanded = 'first',
  labels: propLabels = {},
}: Props) {
  const [indices, setIndices] = useState(
    new Set(INITIALLY_EXPANDED_MAP[initiallyExpanded])
  )

  const onChange = (index: number) => {
    setIndices((currentIndices) => {
      const newIndices = new Set(currentIndices)

      if (currentIndices.has(index)) {
        newIndices.delete(index)
      } else {
        newIndices.add(index)
      }

      return newIndices
    })
  }

  const labels = { ...DEFAULT_LABELS, ...propLabels }

  return (
    <section data-fs-product-description>
      <UIAccordion
        indices={indices}
        onChange={onChange}
        aria-label="Product Details Content"
      >
        <UIAccordionItem
          as="article"
          index={0}
          data-fs-product-details-description
          prefixId="product-description"
        >
          <UIAccordionButton>{labels.description}</UIAccordionButton>
          <UIAccordionPanel>
            <p className="text__body">
              Sony WH-1000XM4 Wireless Industry Leading Noise Canceling Overhead
              Headphones with Mic for Phone-Call and Alexa Voice Control, Black.
            </p>
          </UIAccordionPanel>
        </UIAccordionItem>
        <UIAccordionItem
          as="article"
          index={1}
          data-fs-product-details-about
          prefixId="product-description"
        >
          <UIAccordionButton>{labels.about}</UIAccordionButton>
          <UIAccordionPanel>
            <UITable
              cellPadding={0}
              cellSpacing={0}
              className="text__title-mini-alt"
            >
              <UITableBody>
                <UITableRow>
                  <UITableCell variant="header" align="left">
                    <UIIcon
                      data-fs-accordion-item-button-icon
                      name="Ruler"
                      width={18}
                      height={18}
                    />
                    <span>Width</span>
                  </UITableCell>
                  <UITableCell align="right">1.50m</UITableCell>
                </UITableRow>
                <UITableRow>
                  <UITableCell variant="header" align="left">
                    <UIIcon
                      data-fs-accordion-item-button-icon
                      name="Ruler"
                      width={18}
                      height={18}
                    />
                    Height
                  </UITableCell>
                  <UITableCell align="right">1.50m</UITableCell>
                </UITableRow>
                <UITableRow>
                  <UITableCell variant="header" align="left">
                    <UIIcon
                      data-fs-accordion-item-button-icon
                      name="Ruler"
                      width={18}
                      height={18}
                    />
                    Dimensions
                  </UITableCell>
                  <UITableCell align="right">
                    7.27 x 3.03 x 9.94 inches
                  </UITableCell>
                </UITableRow>
                <UITableRow>
                  <UITableCell variant="header" align="left">
                    <UIIcon
                      data-fs-accordion-item-button-icon
                      name="Bag"
                      width={18}
                      height={18}
                    />
                    Weight
                  </UITableCell>
                  <UITableCell align="right">12oz</UITableCell>
                </UITableRow>
                <UITableRow>
                  <UITableCell variant="header" align="left">
                    <UIIcon
                      data-fs-accordion-item-button-icon
                      name="RocketLaunch"
                      width={18}
                      height={18}
                    />
                    Days to ship
                  </UITableCell>
                  <UITableCell align="right">11 Days</UITableCell>
                </UITableRow>
                <UITableRow>
                  <UITableCell variant="header" align="left">
                    <UIIcon
                      data-fs-accordion-item-button-icon
                      name="CircleWavyCheck"
                      width={18}
                      height={18}
                    />
                    Estimated
                  </UITableCell>
                  <UITableCell align="right">Nov 10th</UITableCell>
                </UITableRow>
              </UITableBody>
            </UITable>
          </UIAccordionPanel>
        </UIAccordionItem>
        <UIAccordionItem
          as="article"
          className="text__body"
          index={2}
          data-fs-product-details-highlights
          prefixId="product-description"
        >
          <UIAccordionButton>{labels.highlights}</UIAccordionButton>
          <UIAccordionPanel>
            <UIList marker>
              <li>
                Industry-leading noise canceling with Dual Noise Sensor
                technology
              </li>
              <li>
                Next-level music with Edge-AI, co-developed with Sony Music
                Studios Tokyo
              </li>
              <li>
                Up to 30-hour battery life with quick charging (10 min charge
                for 5 hours of playback)
              </li>
              <li>
                Touch Sensor controls to pause play skip tracks, control volume,
                activate your voice assistant, and answer phone calls
              </li>
              <li>
                Speak-to-chat technology automatically reduces volume during
                conversations
              </li>
              <li>Superior call quality with precise voice pickup</li>
              <li>
                Wearing detection pauses playback when headphones are removed
              </li>
              <li>Seamless multiple-device pairing</li>
              <li>
                Adaptive Sound Control provides a personalized listening
                experience
              </li>
              <li>Updated design relieves pressure for long-lasting comfort</li>
            </UIList>
          </UIAccordionPanel>
        </UIAccordionItem>
        <UIAccordionItem
          as="article"
          index={3}
          data-fs-product-details-learn-more
          prefixId="product-description"
        >
          <UIAccordionButton>{labels.learnMore}</UIAccordionButton>
          <UIAccordionPanel>
            <p className="text__body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laboru.
            </p>
          </UIAccordionPanel>
        </UIAccordionItem>
      </UIAccordion>
    </section>
  )
}

export default ProductDescription
