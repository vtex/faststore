import { default as ThirdPartyScripts } from 'src/customizations/scripts/ThirdPartyScripts'

const RenderThirdPartyScripts = (ThirdPartyScripts: () => string) => {
  const scriptContent = ThirdPartyScripts()

  const scriptInjection = () => {
    return (
      <>
        <script
          key="thirdpartyscript"
          type="text/partytown"
          dangerouslySetInnerHTML={{
            __html: scriptContent,
          }}
        />
      </>
    )
  }
  return scriptInjection
}

const overrides = {
  components: {
    ThirdPartyScripts: RenderThirdPartyScripts(ThirdPartyScripts),
  },
}

export default overrides
