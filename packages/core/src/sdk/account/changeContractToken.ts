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
 * See `specs/contract-switcher.md` (Arch Decision 2) for the switch mechanism.
 * Wire the VTEX endpoint here when available.
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

  return false
}
