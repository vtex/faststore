import { loadConfig } from '@vtex/faststore/config'

export default async function TestPage() {
  const config = await loadConfig()

  console.log({
    config,
  })

  return (
    <div>
      <h1>Test Page</h1>
    </div>
  )
}
