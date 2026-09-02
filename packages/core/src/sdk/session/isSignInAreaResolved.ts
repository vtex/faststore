/**
 * The Navbar account area must not render "Sign in" for a B2B buyer whose
 * session has not been validated yet on this page load (Design QA 26/Aug
 * 00:02:55–00:03:52). `isSessionReady` alone is pre-seeded from sessionStorage.
 */
export const isSignInAreaResolved = ({
  isSessionReady,
  hasValidated,
}: {
  isSessionReady: boolean
  hasValidated: boolean
}): boolean => isSessionReady && hasValidated
