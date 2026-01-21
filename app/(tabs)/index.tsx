import { deleteTask, getTasks } from "@/utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomePage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<string[]>([]);

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const loadTasks = React.useCallback(async () => {
    const t = await getTasks(today);
    setTasks(t);
  }, [today]);

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const removeTask = async (index: number) => {
    await deleteTask(today, index);
    loadTasks();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{today} Tasks</Text>
        <View style={styles.taskCountBadge}>
          <Text style={styles.taskCountText}>{tasks.length} tasks</Text>
        </View>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={
          tasks.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        renderItem={({ item, index }) => (
          <View style={styles.taskItem}>
            <View style={styles.taskContent}>
              <Text style={styles.taskText}>{item}</Text>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => removeTask(index)}
              style={styles.deleteButton}
              accessibilityRole="button"
              accessibilityLabel={`Delete task ${index + 1}`}
            >
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📝</Text>
            <Text style={styles.emptyText}>No tasks for today</Text>
            <Text style={styles.emptySubText}>Add your first task below!</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            router.push({ pathname: "/addTask", params: { day: today } })
          }
          accessibilityRole="button"
          accessibilityLabel="Add new task"
        >
          <View style={styles.btnRow}>
            <Ionicons name="add-circle-outline" size={22} color="#ffffff" />
            <Text style={styles.buttonText}>Add New Task</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/weekly")}
          accessibilityRole="button"
          accessibilityLabel="View weekly tasks"
        >
          <View style={styles.btnRow}>
            <Ionicons name="calendar-outline" size={22} color="#ffffff" />
            <Text style={styles.secondaryButtonText}>View Weekly</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F0F4F8",
    paddingTop: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1A1A2E",
    flex: 1,
  },
  taskCountBadge: {
    backgroundColor: "#E8F4FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  taskCountText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },

  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
  },

  taskItem: {
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#4F46E5",
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  taskText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
    lineHeight: 22,
  },

  deleteButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#9CA3AF",
  },

  buttonsContainer: {
    marginTop: "auto",
    paddingTop: 16,
    paddingBottom: 8,
  },
  primaryButton: {
    backgroundColor: "#4F46E5",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: "#10B981",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
