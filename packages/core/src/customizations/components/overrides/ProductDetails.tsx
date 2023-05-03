import { SectionOverride } from "src/typings/overrides";

const SECTION = "ProductDetails" as const;

const overrides: SectionOverride[typeof SECTION] = {
  name: SECTION,
  components: {},
};

export default overrides;
