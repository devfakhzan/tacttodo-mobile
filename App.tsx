import { ApolloProvider, type ApolloClient, type NormalizedCacheObject } from "@apollo/client";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { createApolloClient, initApolloCache } from "./src/apollo/client";
import { AuthProvider } from "./src/auth/AuthContext";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      await initApolloCache();
      const apolloClient = createApolloClient();
      if (active) {
        setClient(apolloClient);
      }
    }

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  if (!client) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
});
