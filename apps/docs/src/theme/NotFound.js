/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
 import React from 'react'
 import Layout from '@theme/Layout'
 import Translate, { translate } from '@docusaurus/Translate'
 import Link from '@docusaurus/Link'
 
 function NotFound() {
   return (
     <Layout
       title={translate({
         id: 'theme.NotFound.title',
         message: 'Page Not Found',
       })}
     >
       <main className="container my-16">
         <div className="grid gap-20 auto-cols-fr lg:grid-flow-col">
           <div className='my-auto'>
               <p className="mb-4 tracking-wider uppercase">404 - page not found</p>
               <h3 className='leading-tight text-4xl font-normal font-VTEXTrust'>
                 The content you are looking for was not found or does not exist
                 anymore.
               </h3>
               <p className="leading-relaxed my-3 text-lg">
                 Use the menu above to find what you need or contact us at the
                 link below:
               </p>
               <Link className='button-tertiary' to="https://docs.google.com/forms/d/e/1FAIpQLSfmnotPvPjw-SjiE7lt2Nt3RQgNUe10ixXZmuO2v9enOJReoQ/viewform?entry.1972292648=developers.vtex.com&entry.1799503232=">
                 Send a feedback
               </Link>
           </div>
           <img className='p-10' src="https://vtexhelp.vtexassets.com/assets/docs/src/404___c3b871e2db018ce8f1b3d5fb1b2bda97.jpeg" />
         </div>
       </main>
     </Layout>
   )
 }
 
 export default NotFound