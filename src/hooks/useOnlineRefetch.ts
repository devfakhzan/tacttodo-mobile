import { useApolloClient } from "@apollo/client";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef } from "react";

export function useOnlineRefetch(queryNames: string[]) {
  const client = useApolloClient();
  const wasOffline = useRef(false);
  const namesKey = queryNames.join(",");

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);

      if (wasOffline.current && online) {
        void client.refetchQueries({ include: queryNames });
      }

      wasOffline.current = !online;
    });

    return () => unsubscribe();
  }, [client, namesKey, queryNames]);
}
