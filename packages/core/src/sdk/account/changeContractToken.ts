export class ContractSwitchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ContractSwitchError'
  }
}

/** False until VTEX ChangeToken is wired in changeContractToken. */
export const isContractSwitchEnabled = false

/**
 * Integration seam for the VTEX "ChangeToken" operation, which flips the active
 * contract token within an Organization Unit on the server side.
 *
 * OPEN QUESTION — see `specs/contract-switcher.md` (Arch Decision 2): the concrete
 * VTEX endpoint/payload for ChangeToken is not yet defined. This function is the
 * single place to wire it once confirmed.
 *
 * Returns `true` only when the server-side commercial context has actually changed
 * to `contractId`. Returns `false` while the endpoint is unwired. Throws
 * `ContractSwitchError` on hard failures (missing id, network/4xx) so
 * `switchContract` can keep the previous contract active.
 */
export async function changeContractToken(
  contractId: string
): Promise<boolean> {
  if (!contractId) {
    throw new ContractSwitchError('Missing contractId for contract switch')
  }

  // TODO(contract-switcher): wire the VTEX ChangeToken endpoint here and return true
  // once the server confirms the commercial context changed.
  return false
}
