import { useMutation } from "@apollo/client";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth/AuthContext";
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../graphql/operations";
import type { AuthPayload } from "../graphql/types";

type AuthMode = "login" | "signup";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
}

export function LoginScreen() {
  const { setSession } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [login, { loading: loginLoading }] = useMutation<{ login: AuthPayload }>(
    LOGIN_MUTATION,
  );
  const [signup, { loading: signupLoading }] = useMutation<{ signup: AuthPayload }>(
    SIGNUP_MUTATION,
  );

  const loading = loginLoading || signupLoading;

  async function handleSubmit() {
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || password.length < 6) {
      setError("Enter a valid email and password (6+ characters).");
      return;
    }

    try {
      if (mode === "login") {
        const result = await login({
          variables: { email: trimmedEmail, password },
        });
        const payload = result.data?.login;
        if (!payload) {
          throw new Error("Login failed");
        }
        await setSession(payload.token, payload.user);
      } else {
        const result = await signup({
          variables: { email: trimmedEmail, password },
        });
        const payload = result.data?.signup;
        if (!payload) {
          throw new Error("Signup failed");
        }
        await setSession(payload.token, payload.user);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.brand}>TactTodo</Text>
        <Text style={styles.subtitle}>
          {mode === "login" ? "Sign in to your account" : "Create an account"}
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            placeholder="you@example.com"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete={mode === "login" ? "password" : "new-password"}
            placeholder="At least 6 characters"
            placeholderTextColor="#94a3b8"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={() => void handleSubmit()}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {mode === "login" ? "Sign in" : "Sign up"}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setMode(mode === "login" ? "signup" : "login");
              setError(null);
            }}
            disabled={loading}
          >
            <Text style={styles.switchText}>
              {mode === "login"
                ? "Need an account? Sign up"
                : "Already have an account? Sign in"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  brand: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    marginBottom: 28,
  },
  form: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#0f172a",
  },
  error: {
    color: "#dc2626",
    marginTop: 8,
    fontSize: 14,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  switchText: {
    marginTop: 16,
    textAlign: "center",
    color: "#2563eb",
    fontSize: 15,
  },
});
