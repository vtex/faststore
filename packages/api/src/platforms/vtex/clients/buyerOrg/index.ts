import { Context, Options } from "../..";
import { getStoreCookie, getWithCookie } from "../../utils/cookies";
import { fetchAPI } from "../fetch";

export const BuyerOrg = (
    { account, environment }: Options,
    ctx: Context
) => {
    const base = `https://${account}.${environment}.com.br/api/bom`
    const storeCookies = getStoreCookie(ctx)
    const withCookie = getWithCookie(ctx)

    const buyerOrg = async (customerId: string) => {

        const headers: HeadersInit = withCookie({
            'Content-Type': 'application/vnd.vtex.BusinessUnit.GetBusinessUnitRequest+json',
        })

        return fetchAPI(
            `${base}/BusinessUnit.Get?an=${account}`,
            {
                method: "POST",
                body: JSON.stringify({
                    id: customerId
                }),
                headers
            },
            { storeCookies, }
        )
    }

    return {
        buyerOrg
    }
}
