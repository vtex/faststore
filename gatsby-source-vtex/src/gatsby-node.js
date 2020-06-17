import { ProductSearch } from "./fetch";

const PRODUCT_NODE_TYPE = "Product";

export const sourceNodes = async (
  { actions: { createNode }, createNodeId, createContentDigest },
  options
) => {
  try {
    const productData = await ProductSearch(options);
    productData.forEach((product) => {
      const data = {
        ...product,
        slug: `${product.linkText}/p`,
      };
      createNode({
        ...data,
        id: createNodeId(`${PRODUCT_NODE_TYPE}-${data.productId}`),
        internal: {
          type: PRODUCT_NODE_TYPE,
          content: JSON.stringify(data),
          contentDigest: createContentDigest(data),
        },
      });
    });
  } catch (error) {
    throw error;
  }
};
