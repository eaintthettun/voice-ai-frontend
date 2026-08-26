import * as SecureStore from "expo-secure-store";

const API_URL = "http://192.168.1.8:3000";

const getAllDiaryEntries = async () => {
  const token = await SecureStore.getItemAsync("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${API_URL}/api/diaryEntries`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch diary entries");
  }

  return data;
};

const getRecentDiaryEntries = async () => {
  const token = await SecureStore.getItemAsync("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${API_URL}/api/diaryEntries/recent`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  console.log("data",data)

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch diary entries");
  }

  return data;
};

export default {
  getAllDiaryEntries,
  getRecentDiaryEntries,
};