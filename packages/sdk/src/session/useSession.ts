import { useStorage } from "./../storage/useStorage";

export interface Currency {
  code: string; // Ex: USD
  symbol: string; // Ex: $
}

export interface Person {
  id: string;
  email: string;
  givenName: string;
  familyName: string;
}

export interface Session {
  locale: string; // en-US
  currency: Currency;
  country: string; // BRA
  channel: string | null;
  postalCode: string | null;
  person: Person | null;
}

const key = "faststore::session";

export const useSession = (initialValue?: Session) => {
  const [session, setSession] = useStorage(key, initialValue);

  return {
    ...session,
    setSession,
  };
};
