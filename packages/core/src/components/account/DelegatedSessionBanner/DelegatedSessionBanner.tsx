import { RETURN_NOT_AVAILABLE_STATUS } from 'src/sdk/account/returnFromDelegatedSession'
import { DelegatedSessionError } from 'src/sdk/account/startDelegatedSession'
import { useDelegatedSession } from 'src/sdk/account/useDelegatedSession'
import { useSession } from 'src/sdk/session'

import styles from './DelegatedSessionBanner.module.scss'

/**
 * Persistent signal that the session is an impersonation: "[Delegate] acting
 * on behalf of [Original Shopper]", with Return as the only way out.
 *
 * The actor comes from the session (`authentication.actorId*`, set from the
 * token's `act` claim); nothing is rendered in a regular session.
 */
export const DelegatedSessionBanner = () => {
  const { b2b } = useSession()
  const { returnToDelegate, loading } = useDelegatedSession()

  if (!b2b?.actorId) {
    return null
  }

  const actor = b2b.actorIdentifier || b2b.actorId
  const target = b2b.userName?.trim() || b2b.userEmail || ''

  // TODO(B2BTEAM-4043): remove once Identity's Return API is wired in
  // `delegation-return.ts`. Until then the route answers 501 and we follow the
  // RFC workaround: logout and sign in again as the Delegate.
  // Dynamic import: a static one would bundle the drawer stylesheet ahead of
  // the global one and invert the CSS layer order app-wide.
  const logoutWorkaround = async () => {
    const { doLogout } = await import(
      'src/components/account/Drawer/OrganizationDrawer/OrganizationDrawer'
    )

    await doLogout()
  }

  const onReturn = () =>
    returnToDelegate(async (error) => {
      if (
        error instanceof DelegatedSessionError &&
        error.status === RETURN_NOT_AVAILABLE_STATUS
      ) {
        await logoutWorkaround()
      }
    })

  return (
    <>
      <div className={styles.frame} aria-hidden="true" />
      <div
        className={styles.banner}
        role="status"
        data-fs-delegated-session-banner
      >
        <span className={styles.text}>
          <strong>{actor}</strong>
          <span> acting on behalf of </span>
          <strong>{target}</strong>
        </span>
        <button
          type="button"
          className={styles.return}
          disabled={loading}
          onClick={() => void onReturn()}
        >
          Return
        </button>
      </div>
    </>
  )
}
