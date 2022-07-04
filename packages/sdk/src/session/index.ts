import { createStore } from "./../store/composed";

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

export const createSessionStore = (
  defaultSession: Session,
  onValidate?: (value: Session) => Promise<Session | null>,
  namespace = "fs::session",
) => createStore(defaultSession, namespace, onValidate);