export class ContractSwitchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContractSwitchError'
  }
}

/**
 * Integration seam for the VTEX "ChangeToken" operation, which flips the active
 * contract token within an Organization Unit on the server side.
 *
 * OPEN QUESTION — see `specs/contract-switcher.md` (Arch Decision 2): the concrete
 * VTEX endpoint/payload for ChangeToken is not yet defined. This function is the
 * single place to wire it once confirmed; it MUST resolve only once the server-side
 * commercial context has actually changed to `contractId`, and reject otherwise so
 * `switchContract` can keep the previous contract active.
 *
 * Until the endpoint is confirmed it validates the input and resolves, so the rest
 * of the switch flow (session revalidation + cart reset) can be exercised end-to-end
 * in a B2B-enabled store.
 */
export async function changeContractToken(contractId: string): Promise<void> {
  if (!contractId) {
    throw new ContractSwitchError('Missing contractId for contract switch')
  }

  // TODO(contract-switcher): wire the VTEX ChangeToken endpoint here.
}
