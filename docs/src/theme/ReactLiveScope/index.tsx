/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
 import '@vtex/theme-b2c-tailwind'

 import React, { useEffect, useState } from 'react'
 import * as UI from '@faststore/ui'
 
const PlusIcon = (props) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 16H21"
        stroke={props.color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 11V21"
        stroke={props.color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const MinusIcon = (props) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 16H21"
        stroke={props.color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

 const SafetyIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 7h20v7c0 10-8 14-10 14S6 24 6 14V7Zm0-2a2 2 0 0 0-2 2v7c0 11 10 15 11 16h2c1-1 11-5 11-16V7a2 2 0 0 0-2-2H6Zm16 9a1 1 0 0 0-1-2l-7 7-3-3a1 1 0 0 0-1 1l4 4h1l7-7Z"
        fill="#323845"
      />
    </svg>
  )
}

 const RightArrow = () => (
   <svg
     xmlns="http://www.w3.org/2000/svg"
     width="18"
     height="18"
     viewBox="0 0 18 18"
   >
     <path
       d="M10.6553 3.40717C10.3624 3.11428 9.88756 3.11428 9.59467 3.40717C9.30178 3.70006 9.30178 4.17494 9.59467 4.46783L13.3768 8.25H2.8125C2.39829 8.25 2.0625 8.58579 2.0625 9C2.0625 9.41421 2.39829 9.75 2.8125 9.75H13.3768L9.59467 13.5322C9.30178 13.8251 9.30178 14.2999 9.59467 14.5928C9.88756 14.8857 10.3624 14.8857 10.6553 14.5928L15.7178 9.53033C15.8643 9.38388 15.9375 9.19194 15.9375 9C15.9375 8.89831 15.9173 8.80134 15.8806 8.71291C15.844 8.62445 15.7897 8.54158 15.7178 8.46967L10.6553 3.40717Z"
       fill="currentColor"
     />
   </svg>
 )
 
 const Warning = () => (
  <i className="fas fa-exclamation-triangle"></i>
)

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
     <UI.Bullets
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
   const [indices, setIndices] = useState(new Set([]))
   const onChange = (index) => {
     if (indices.has(index)) {
       indices.delete(index)
       setIndices(new Set(indices))
     } else {
       setIndices(new Set(indices.add(index)))
     }
   }
 
   return (
     <UI.Accordion testId={testId} indices={indices} onChange={onChange}>
       <UI.AccordionItem>
         <UI.AccordionButton>Clothing</UI.AccordionButton>
         <UI.AccordionPanel>
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
         </UI.AccordionPanel>
       </UI.AccordionItem>
       <UI.AccordionItem>
         <UI.AccordionButton>Bags</UI.AccordionButton>
         <UI.AccordionPanel>
           <ul>
             <li>
               <a href="/">Backpacks</a>
             </li>
             <li>
               <a href="/">Necessaire</a>
             </li>
           </ul>
         </UI.AccordionPanel>
       </UI.AccordionItem>
       <UI.AccordionItem>
         <UI.AccordionButton>Sale</UI.AccordionButton>
         <UI.AccordionPanel>
           <ul>
             <li>
               <a href="/">Smartphones</a>
             </li>
             <li>
               <a href="/">TVs</a>
             </li>
           </ul>
         </UI.AccordionPanel>
       </UI.AccordionItem>
     </UI.Accordion>
   )
 }
 
 export const MultipleAndCollapsible = AccordionTemplate.bind({})
 
 
  // Add react-live imports you need here
  const ReactLiveScope = {
    React,
    ...React,
    ...UI,
    SafetyIcon,
    MinusIcon,
    PlusIcon,
    RightArrow,
    ShoppingCart,
    Warning,
    MultipleAndCollapsible,
    Caret,
    BulletsTemplate,
    CustomIcon,
    priceFormatter
  };
 
  export default ReactLiveScope;
 