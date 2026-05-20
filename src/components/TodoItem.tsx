import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Todo } from "../graphql/types";

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
};

export function TodoItem({ todo, onToggle, onDelete, disabled }: TodoItemProps) {
  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.checkbox, todo.completed && styles.checkboxDone]}
        onPress={() => onToggle(todo.id)}
        disabled={disabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed }}
      >
        {todo.completed ? <Text style={styles.checkmark}>✓</Text> : null}
      </Pressable>
      <Text
        style={[styles.title, todo.completed && styles.titleDone]}
        numberOfLines={2}
      >
        {todo.title}
      </Text>
      <Pressable
        onPress={() => onDelete(todo.id)}
        disabled={disabled}
        style={styles.deleteButton}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${todo.title}`}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#94a3b8",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  checkmark: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: "#64748b",
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  deleteText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "600",
  },
});
