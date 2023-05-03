export const SECTIONS = {
    ProductDetails: { components: ["Price"] },
    ProductShelf: { components: ["ProductCard"] }
  } as const;
  
  // export type ComponentOrProps =
  //   | { Component: React.ElementType }
  //   | { props: Record<string, unknown> };
  
  export type SectionOverride = {
    [K in keyof typeof SECTIONS]: {
      name: K;
      components: {
        [ComponentKey in typeof SECTIONS[K]["components"][number]]?: React.ElementType;
      };
    };
  };
  