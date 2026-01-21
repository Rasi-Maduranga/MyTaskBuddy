import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getTasks, deleteTask } from "@/utils/storage";
import Feather from "@expo/vector-icons/Feather";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WeeklyPage() {
  const router = useRouter();
  const [tasksByDay, setTasksByDay] = useState<Record<string, string[]>>({});

  const loadTasks = React.useCallback(async () => {
    const data: Record<string, string[]> = {};
    for (const day of weekDays) {
      data[day] = await getTasks(day);
    }
    setTasksByDay(data);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  const removeTask = async (day: string, index: number) => {
    await deleteTask(day, index);
    loadTasks();
  };

  return (
    <View style={styles.container}>
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

        <Text style={styles.title}>Weekly Tasks</Text>

        {/* spacer to keep title centered */}
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={weekDays}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item: day }) => {
          const dayTasks = tasksByDay[day] ?? [];

          return (
            <View style={styles.dayCard}>
              {/* Day header */}
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{day}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{dayTasks.length}</Text>
                </View>
              </View>

              {/* Empty */}
              {dayTasks.length === 0 ? (
                <Text style={styles.noTask}>No tasks 😅</Text>
              ) : (
                dayTasks.map((task, index) => (
                  <View key={`${day}-${index}`} style={styles.taskRow}>
                    <Text style={styles.taskText}>{task}</Text>

                    <TouchableOpacity
                      onPress={() => removeTask(day, index)}
                      style={styles.trashBtn}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete task ${
                        index + 1
                      } from ${day}`}
                    >
                      <Feather name="trash-2" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                ))
              )}

              {/* Add task */}
              <TouchableOpacity
                style={styles.addButton}
                onPress={() =>
                  router.push({ pathname: "/addTask", params: { day } })
                }
                accessibilityRole="button"
                accessibilityLabel={`Add task for ${day}`}
              >
                <View style={styles.btnRow}>
                  <Feather name="plus-circle" size={18} color="#ffffff" />
                  <Text style={styles.addButtonText}>Add Task</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#F5F7FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  dayCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
  },

  badge: {
    backgroundColor: "#E8F4FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: "#2563EB",
    fontWeight: "800",
    fontSize: 12,
  },

  noTask: {
    color: "#9CA3AF",
    fontStyle: "italic",
    marginBottom: 8,
  },

  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#F1F5F9",
  },
  taskText: {
    flex: 1,
    color: "#374151",
    fontSize: 15,
    paddingRight: 10,
  },

  trashBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  addButton: {
    marginTop: 10,
    backgroundColor: "#4F46E5",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
});
