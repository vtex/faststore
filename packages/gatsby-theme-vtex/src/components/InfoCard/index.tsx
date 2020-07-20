/** @jsx jsx */
import { jsx, Box, Image } from 'theme-ui'
import { FC } from 'react'
import { Link } from 'gatsby'

interface Props {
  to: string
  headline?: string
  subhead?: string
}

const InfoCard: FC<Props> = ({ headline, subhead, children, to }) => {
  return (
    <div
      sx={{
        display: 'flex',
        justifyContent: 'center',
        px: '10px',
        background: '#e0efe0',
        textAlign: 'center',
        alignItems: 'center',
        maxHeight: '540px',
      }}
    >
      <Box sx={{ width: ['100%', '30%'] }}>
        {headline && (
          <div
            sx={{
              fontSize: 5,
              fontWeight: 'bold',
            }}
          >
            {headline}
          </div>
        )}
        {subhead && <div>{subhead}</div>}
        {children}
      </Box>
      <Box sx={{ width: ['0%', '70%'] }}>
        <Link to={to}>
          <Image
            sx={{
              maxHeight: '540px',
              width: '100%',
            }}
            loading="lazy"
            src="https://storecomponents.vtexassets.com/arquivos/banner-infocard2.png"
          />
        </Link>
      </Box>
    </div>
  )
}
//   imageActionUrl={{ id: imageActionUrl, intl }}
//   extraCondition={!isFullModeStyle}
//   linkProps={{ className: 'no-underline' }}
// >
//   <div
//     className={containerClasses}
//     style={containerStyle}
//     data-testid="container"
//     id={htmlId}
//   >
//     <div className={textContainerClasses}>
//       {headline && (
//         <div
//           className={headlineClasses}
//           dangerouslySetInnerHTML={{ __html: sanitizedHeadline }}
//         />
//       )}
//       {subhead && (
//         <div
//           className={subheadClasses}
//           dangerouslySetInnerHTML={{ __html: sanitizedSubhead }}
//         />
//       )}
//       <CallToAction
//         mode={callToActionMode}
//         text={{ id: callToActionText, intl }}
//         url={{ id: callToActionUrl, intl }}
//       />
//     </div>
//     {!isFullModeStyle && (
//       <div className={`${styles.infoCardImageContainer} w-50-ns`}>
//         <LinkWrapper
//           imageActionUrl={{ id: imageActionUrl, intl }}
//         >
//           <img
//             className={styles.infoCardImage}
//             src={finalImageUrl}
//             style={{ objectFit: 'cover' }}
//             alt=""
//             data-testid="half-image"
//           />
//         </LinkWrapper>
//       </div>
//     )}
//   </div>
// </LinkWrapper>

export default InfoCard
