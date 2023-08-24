import { default as ThirdPartyScripts } from 'src/customizations/scripts/ThirdPartyScripts'

const RenderThirdPartyScripts = (
  ThirdPartyScripts: () => string[] | string
) => {
  const scriptContent = ThirdPartyScripts() || []

  const buildScript = (script: string, index?: number) => (
    <script
      key={`thirdpartyscript-${index}`}
      type="text/partytown"
      dangerouslySetInnerHTML={{
        __html: script,
      }}
    />
  )

  const renderScriptTags = (): JSX.Element => {
    if (Array.isArray(scriptContent)) {
      return (
        <>{scriptContent.map((script, index) => buildScript(script, index))}</>
      )
    }
    return buildScript(scriptContent)
  }

  return renderScriptTags
}

const overrides = {
  components: {
    ThirdPartyScripts: RenderThirdPartyScripts(ThirdPartyScripts),
  },
}

export default overrides
