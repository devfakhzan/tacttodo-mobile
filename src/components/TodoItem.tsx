import { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { Todo } from "../graphql/types";

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string) => void;
  disabled?: boolean;
};

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
  disabled,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);

  useEffect(() => {
    if (!editing) {
      setDraft(todo.title);
    }
  }, [todo.title, editing]);

  function saveEdit() {
    const trimmed = draft.trim();
    if (!trimmed) {
      setDraft(todo.title);
      setEditing(false);
      return;
    }

    if (trimmed !== todo.title) {
      onUpdate(todo.id, trimmed);
    }

    setEditing(false);
  }

  function cancelEdit() {
    setDraft(todo.title);
    setEditing(false);
  }

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

      {editing ? (
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          onBlur={saveEdit}
          onSubmitEditing={saveEdit}
          autoFocus
          editable={!disabled}
          returnKeyType="done"
        />
      ) : (
        <Pressable
          style={styles.titleWrap}
          onPress={() => setEditing(true)}
          disabled={disabled}
        >
          <Text
            style={[styles.title, todo.completed && styles.titleDone]}
            numberOfLines={2}
          >
            {todo.title}
          </Text>
        </Pressable>
      )}

      {!editing && (
        <Pressable
          onPress={() => setEditing(true)}
          disabled={disabled}
          style={styles.editButton}
        >
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      )}

      {editing && (
        <Pressable
          onPress={cancelEdit}
          disabled={disabled}
          style={styles.editButton}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      )}

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
    gap: 8,
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
  titleWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: "#0f172a",
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: "#64748b",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#0f172a",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#ffffff",
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  editText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelText: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  deleteText: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "600",
  },
});
