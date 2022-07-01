import { createStore } from "../store/base";
import { persisted } from "../store/persisted";
import { singleton } from "../store/singleton";
import { optimistic } from "./../store/optimistic";
import { compose } from "./../utils/compose";

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
) =>
  compose([
    singleton(namespace),
    persisted(namespace),
    optimistic(onValidate),
  ], createStore(defaultSession));
