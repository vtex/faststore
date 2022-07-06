import DataLoader from "dataloader";

import { Options } from "..";
import { Clients } from "../clients";

import type { SalesChannel } from "./../clients/commerce/types/SalesChannel";

export const getSalesChannelLoader = (_: Options, clients: Clients) => {
  const loader = async (items: readonly void[]) => {
    const channel = await clients.commerce.catalog.salesChannel();

    return new Array(items.length).fill(channel);
  };

  return new DataLoader<void, SalesChannel>(loader);
};
