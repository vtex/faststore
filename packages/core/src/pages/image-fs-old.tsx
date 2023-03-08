import { Image } from 'src/components/ui/Image'

function Page() {
  return (
    <>
      <p>
        Catalog Arquivos JPG -
        https://mercafefaststore.vtexassets.com/arquivos/ids/158658/20039314_01.jpg
      </p>
      <Image
        src={
          'https://mercafefaststore.vtexassets.com/arquivos/ids/158658/20039314_01.jpg'
        }
        alt={'Tests'}
        width={360}
        height={360}
        loading="eager"
      />
      <p>
        Catalog Arquivos PNG -
        https://mercafefaststore.vtexassets.com/arquivos/ids/526372/SKU-Capp-Capsula.png?v=1763654233
      </p>
      <Image
        src={
          'https://mercafefaststore.vtexassets.com/arquivos/ids/526372/SKU-Capp-Capsula.png?v=1763654233'
        }
        alt={'Tests'}
        width={360}
        height={360}
        loading="eager"
      />
      <p>
        CMS file-manager JPG -
        https://mercafefaststore.vtexassets.com/assets/vtex.file-manager-graphql/images/12ea02ba-dd7d-4d91-8547-eb6809c4a30e___3858c213bede843e801934ac436d80ac.jpg
      </p>
      <Image
        src={
          'https://mercafefaststore.vtexassets.com/assets/vtex.file-manager-graphql/images/12ea02ba-dd7d-4d91-8547-eb6809c4a30e___3858c213bede843e801934ac436d80ac.jpg'
        }
        alt={'Tests'}
        width={384}
        height={384}
        loading="eager"
      />
      <p>
        CMS file-manager PNG -
        https://mercafefaststore.vtexassets.com/assets/vtex.file-manager-graphql/images/ea491eac-e9b6-43b5-8275-135d07ceeb99___f1a637818ab5b0c64ea58753e24b4278.png
      </p>
      <Image
        src={
          'https://mercafefaststore.vtexassets.com/assets/vtex.file-manager-graphql/images/ea491eac-e9b6-43b5-8275-135d07ceeb99___f1a637818ab5b0c64ea58753e24b4278.png'
        }
        alt={'Tests'}
        width={360}
        height={360}
        loading="eager"
      />
    </>
  )
}

export default Page
