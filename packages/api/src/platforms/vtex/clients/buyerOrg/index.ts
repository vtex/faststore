import { Context, Options } from "../..";
import { getStoreCookie, getWithCookie } from "../../utils/cookies";
import { fetchAPI } from "../fetch";

export const BuyerOrg = (
    { account, environment }: Options,
    ctx: Context
) => {
    const base = `https://${account}.${environment}.com.br/api/bom/business-unit`
    const storeCookies = getStoreCookie(ctx)
    const withCookie = getWithCookie(ctx)

    const buyerOrg = async (customerId: string) => {

        const headers: HeadersInit = withCookie({})

        return fetchAPI(
            `${base}/${customerId}`,
            { headers, },
            { storeCookies, }
        )
    }

    return {
        buyerOrg
    }
}
