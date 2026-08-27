import * as SecureStore from "expo-secure-store";

const API_URL = "http://192.168.1.7:3000";

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

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch diary entries");
  }

  return data;
};

const transcribeDiaryEntry = async (
  title: string,
  audioUri: string,
) => {
  const token = await SecureStore.getItemAsync("token");
  const formData = new FormData();

  formData.append("title", title);

  formData.append("audio", {
    uri: audioUri,
    name: "recording.m4a",
    type: "audio/m4a",
  } as any);

  const response = await fetch(
    `${API_URL}/api/diaryEntries/transcribe`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to transcribe diary entry"
    );
  }

  return data;
};

const createDiaryEntry = async (
  title: string,
  transcript: string,
  category: string,
  filePath: string,
) => {
  const token = await SecureStore.getItemAsync("token");

  const response = await fetch(
    `${API_URL}/api/diaryEntries`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        transcript,
        category,
        filePath,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to transcribe diary entry"
    );
  }

  return data;
};

const deleteDiaryEntry = async (id:string) => {
  const token = await SecureStore.getItemAsync("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${API_URL}/api/diaryEntries/${id}`,
    {
      method: "DELETE",
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

export default {
  getAllDiaryEntries,
  getRecentDiaryEntries,
  transcribeDiaryEntry,
  createDiaryEntry,
  deleteDiaryEntry
};