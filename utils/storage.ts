import AsyncStorage from "@react-native-async-storage/async-storage";

// Get tasks for a day
export const getTasks = async (day: string) => {
  const saved = await AsyncStorage.getItem(day);
  return saved ? JSON.parse(saved) : [];
};

// Save tasks for a day
export const saveTasks = async (day: string, tasks: string[]) => {
  await AsyncStorage.setItem(day, JSON.stringify(tasks));
};

// Delete task by index
export const deleteTask = async (day: string, index: number) => {
  const current = await getTasks(day);
  current.splice(index, 1);
  await saveTasks(day, current);
};
