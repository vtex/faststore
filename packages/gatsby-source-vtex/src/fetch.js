import axios from "axios";

export const ProductSearch = async (
  { accountName, environment, appToken, appKey },
  search = ""
) => {
  try {
    const { data } = await axios.get(
      `https://${accountName}.${environment}.com.br/api/catalog_system/pub/products/search/${search}`,
      {
        headers: {
          "x-vtex-api-appkey": appKey,
          "x-vtex-api-appToken": appToken,
        },
      }
    );

    return data;
  } catch (error) {
    throw error;
  }
};
