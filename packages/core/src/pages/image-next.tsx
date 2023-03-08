import NextImage from 'next/future/image'

function Page() {
  return (
    <>
      <p>
        Catalog Arquivos JPG -
        https://mercafefaststore.vtexassets.com/arquivos/ids/158658/20039314_01.jpg
      </p>
      <NextImage
        src={
          'https://mercafefaststore.vtexassets.com/arquivos/ids/158658/20039314_01.jpg'
        }
        alt={'Tests'}
        width="360"
        height="360"
        quality="95"
        loading="eager"
      />
      <p>
        Catalog Arquivos PNG -
        https://mercafefaststore.vtexassets.com/arquivos/ids/526372/SKU-Capp-Capsula.png?v=1763654233
      </p>
      <NextImage
        src={
          'https://mercafefaststore.vtexassets.com/arquivos/ids/526372/SKU-Capp-Capsula.png?v=1763654233'
        }
        alt={'Tests'}
        width="360"
        height="360"
        quality="95"
        loading="eager"
      />
      <p>
        CMS file-manager JPG -
        https://mercafefaststore.vtexassets.com/assets/vtex.file-manager-graphql/images/12ea02ba-dd7d-4d91-8547-eb6809c4a30e___3858c213bede843e801934ac436d80ac.jpg
      </p>
      <NextImage
        src={
          'https://mercafefaststore.vtexassets.com/assets/vtex.file-manager-graphql/images/12ea02ba-dd7d-4d91-8547-eb6809c4a30e___3858c213bede843e801934ac436d80ac.jpg'
        }
        alt={'Tests'}
        width="384"
        height="384"
        quality="95"
        loading="eager"
      />
      <p>
        CMS file-manager PNG -
        https://mercafefaststore.vtexassets.com/assets/vtex.file-manager-graphql/images/ea491eac-e9b6-43b5-8275-135d07ceeb99___f1a637818ab5b0c64ea58753e24b4278.png
      </p>
      <NextImage
        src={
          'https://mercafefaststore.vtexassets.com/assets/vtex.file-manager-graphql/images/ea491eac-e9b6-43b5-8275-135d07ceeb99___f1a637818ab5b0c64ea58753e24b4278.png'
        }
        alt={'Tests'}
        width="360"
        height="360"
        quality="95"
        loading="eager"
      />

      {/*
        WARNING: Do not import or render components from any
        other folder than '../components/sections' in here.

        This is necessary to keep the integration with the CMS
        easy and consistent, enabling the change and reorder
        of elements on this page.

        If needed, wrap your component in a <Section /> component
        (not the HTML tag) before rendering it here.
      */}
      {/* <RenderPageSections sections={sections} components={COMPONENTS} /> */}
    </>
  )
}

export default Page
