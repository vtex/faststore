import { Store } from "../store";
import { useStore } from "../store/useStore";
import { Session } from ".";

export const useSession = (store: Store<Session>) => useStore(store)
