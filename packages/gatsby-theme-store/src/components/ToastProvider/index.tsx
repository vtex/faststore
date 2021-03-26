// snippet of code to use ToastProvider lazy

// import React, { Suspense, lazy } from 'react'
// import type { FC } from 'react'

// const loader = () => import('@vtex/store-ui/src/ToastMessage/ToastProvider')

// const ToastProvider = lazy(loader)

// export const Provider: FC = ({ children }) => {
//   return (
//     <Suspense fallback={() => children}>
//       <ToastProvider>{children}</ToastProvider>
//     </Suspense>
//   )
// }

import type { PropsWithChildren } from 'react'

export const Provider = ({ children }: PropsWithChildren<null>) => children
