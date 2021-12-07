/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useRef, forwardRef, useEffect, useMemo, useState } from 'react'
import { Badge, Button, Checkbox, Icon, Input, Label, List, Overlay, Popover, Price, Radio, Select, Skeleton, Slider, Spinner, TextArea, Accordion, AccordionProps, AccordionButton, AccordionItem, AccordionPanel, Bullets, Carousel, Form, IconButton, Modal, SearchInput, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from '@faststore/ui';
import './styles.css'

const ShoppingCart = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
)


const Caret = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-chevron-down"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

const CustomIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

/* Price */

function priceFormatter(price) {
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)

  return formattedPrice
}


/* Bullet */
const BulletsComponent = ({
  onClick,
  activeBullet,
  totalQuantity,
  ariaLabelGenerator,
  testId,
}) => {
  const [localActiveBullet, setLocalActiveBullet] = useState(activeBullet)

  useEffect(() => {
    setLocalActiveBullet(activeBullet)
  }, [activeBullet, setLocalActiveBullet])

  return (
    <Bullets
      onClick={(e, idx) => {
        onClick?.(e, idx)
        setLocalActiveBullet(idx)
      }}
      activeBullet={localActiveBullet}
      totalQuantity={totalQuantity}
      ariaLabelGenerator={ariaLabelGenerator}
      testId={testId}
    />
  )
}

export const BulletsTemplate = BulletsComponent.bind({})

/* Accordion */
const AccordionTemplate = ({ testId }) => {
  const [indices, setIndices] = useState<Set<number>>(new Set([]))
  const onChange = (index: number) => {
    if (indices.has(index)) {
      indices.delete(index)
      setIndices(new Set(indices))
    } else {
      setIndices(new Set(indices.add(index)))
    }
  }

  return (
    <Accordion testId={testId} indices={indices} onChange={onChange}>
      <AccordionItem>
        <AccordionButton>Clothing</AccordionButton>
        <AccordionPanel>
          <ul>
            <li>
              <a href="/">Shorts</a>
            </li>
            <li>
              <a href="/">Sweatshirt</a>
            </li>
            <li>
              <a href="/">Tank tops</a>
            </li>
          </ul>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>Bags</AccordionButton>
        <AccordionPanel>
          <ul>
            <li>
              <a href="/">Backpacks</a>
            </li>
            <li>
              <a href="/">Necessaire</a>
            </li>
          </ul>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>Sale</AccordionButton>
        <AccordionPanel>
          <ul>
            <li>
              <a href="/">Smartphones</a>
            </li>
            <li>
              <a href="/">TVs</a>
            </li>
          </ul>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export const MultipleAndCollapsible = AccordionTemplate.bind({})


 // Add react-live imports you need here
 const ReactLiveScope = {
   React,
   ...React,
   Badge,
   Button,
   Checkbox,
   Icon,
   Input,
   Label,
   List,
   Overlay,
   Popover,
   Price,
   Radio, 
   Select, 
   Skeleton,
   Slider, 
   Spinner,
   TextArea,
   ShoppingCart,
   Accordion,
   MultipleAndCollapsible,
   AccordionButton,
   AccordionItem,
   AccordionPanel,
   Caret,
   BulletsTemplate, 
   Carousel,
   Form,
   IconButton,
   Modal,
   SearchInput,
   CustomIcon,
   Table,
   TableBody,
   TableCell,
   TableFooter,
   TableHead,
   TableRow,
   priceFormatter
 };
 
 export default ReactLiveScope;