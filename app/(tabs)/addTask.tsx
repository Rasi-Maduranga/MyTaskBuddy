import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getTasks, saveTasks } from "@/utils/storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

export default function AddTaskPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const day = (params.day as string) ?? "Today";

  const [task, setTask] = useState("");

  const addTask = async () => {
    const cleaned = task.trim();
    if (!cleaned) return;

    const currentTasks = await getTasks(day);
    await saveTasks(day, [...currentTasks, cleaned]);

    setTask("");
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={26} color="#4F46E5" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Add Task for {day}
        </Text>
      </View>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your task"
        placeholderTextColor="#9CA3AF"
        value={task}
        onChangeText={setTask}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={addTask}
      />

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.button, task.trim() === "" && styles.buttonDisabled]}
        onPress={addTask}
        disabled={task.trim() === ""}
        accessibilityRole="button"
        accessibilityLabel="Save task"
      >
        <View style={styles.btnRow}>
          <Feather name="save" size={20} color="#ffffff" />
          <Text style={styles.buttonText}>Save Task</Text>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F7FA",
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    flex: 1,
  },

  input: {
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 16,
    color: "#111827",
  },

  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
});
