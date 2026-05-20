import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../auth/AuthContext";
import { TodoItem } from "../components/TodoItem";
import {
  CREATE_TODO_MUTATION,
  DELETE_TODO_MUTATION,
  ME_QUERY,
  TODOS_QUERY,
  TOGGLE_TODO_MUTATION,
  UPDATE_TODO_MUTATION,
} from "../graphql/operations";
import type { Todo, User } from "../graphql/types";
import { useOnlineRefetch } from "../hooks/useOnlineRefetch";

export function TodoListScreen() {
  const { signOut } = useAuth();
  const [title, setTitle] = useState("");

  useOnlineRefetch(["Todos", "Me"]);

  const { data: meData } = useQuery<{ me: User | null }>(ME_QUERY, {
    skip: false,
  });

  const { data, loading, refetch, networkStatus } = useQuery<{ todos: Todo[] }>(
    TODOS_QUERY,
  );

  const [createTodo, { loading: creating }] = useMutation(CREATE_TODO_MUTATION, {
    refetchQueries: [{ query: TODOS_QUERY }],
    awaitRefetchQueries: true,
  });

  const [deleteTodo, { loading: deleting }] = useMutation(DELETE_TODO_MUTATION, {
    refetchQueries: [{ query: TODOS_QUERY }],
  });

  const [toggleTodo, { loading: toggling }] = useMutation(TOGGLE_TODO_MUTATION, {
    refetchQueries: [{ query: TODOS_QUERY }],
  });

  const [updateTodo, { loading: updating }] = useMutation(UPDATE_TODO_MUTATION, {
    refetchQueries: [{ query: TODOS_QUERY }],
  });

  const todos = data?.todos ?? [];
  const email = meData?.me?.email;
  const busy = creating || deleting || toggling || updating;
  const refreshing = networkStatus === 4;

  async function handleCreate() {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }
    await createTodo({ variables: { title: trimmed } });
    setTitle("");
  }

  async function handleToggle(id: string) {
    await toggleTodo({ variables: { id } });
  }

  async function handleDelete(id: string) {
    await deleteTodo({ variables: { id } });
  }

  async function handleUpdate(id: string, title: string) {
    await updateTodo({ variables: { id, title } });
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Your todos</Text>
          {email ? <Text style={styles.email}>{email}</Text> : null}
        </View>
        <Pressable onPress={() => void signOut()} accessibilityRole="button">
          <Text style={styles.signOut}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="New todo"
          placeholderTextColor="#94a3b8"
          onSubmitEditing={() => void handleCreate()}
          returnKeyType="done"
        />
        <Pressable
          style={[styles.addButton, (busy || !title.trim()) && styles.buttonDisabled]}
          onPress={() => void handleCreate()}
          disabled={busy || !title.trim()}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>

      {loading && todos.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => void refetch()} />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>No todos yet. Add one above.</Text>
          }
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onToggle={(id) => void handleToggle(id)}
              onDelete={(id) => void handleDelete(id)}
              onUpdate={(id, title) => void handleUpdate(id, title)}
              disabled={busy}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0f172a",
  },
  email: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 2,
  },
  signOut: {
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "600",
  },
  composer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#ffffff",
    color: "#0f172a",
  },
  addButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  empty: {
    textAlign: "center",
    color: "#64748b",
    marginTop: 32,
    fontSize: 15,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
