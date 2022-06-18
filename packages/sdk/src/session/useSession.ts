import { useMemo } from "react";
import { Store } from "../store";
import { useStore } from "../store/useStore";
import { Session } from "./index";

export const useSession = (store: Store<Session>) => {
  const session = useStore(store);

  const actions = useMemo(() => ({
    setSession: (session: Session) => store.set(session),
  }), [store]);

  return {
    ...session,
    ...actions,
  };
};
