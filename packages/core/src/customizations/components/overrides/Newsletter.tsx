// This is an example of how it can be used on the starter.

import { SectionOverride } from 'src/typings/overrides'

const SECTION = 'Newsletter' as const

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {
    ToastIconSuccess: { props: {} },
    ToastIconError: { props: {} },
    HeaderIcon: { props: {} },
    InputFieldName: { props: {} },
    InputFieldEmail: { props: {} },
    Button: { props: {} },
  },
}

export default overrides
