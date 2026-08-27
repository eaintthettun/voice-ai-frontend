import { useState, useEffect } from "react";
import { View, StyleSheet, Button, Alert, Text } from "react-native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from "expo-audio";
import { File } from "expo-file-system";
import { AudioPreview } from "../components/AudioPreview";
import { colors } from '../theme'
import { TouchableOpacity } from "react-native";

interface RecordAudioButtonProps {
  onRecordingComplete: (uri: string) => void;
}

export default function RecordAudioButton({
  onRecordingComplete,
}: RecordAudioButtonProps) {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const [audioUri, setAudioUri] = useState<string | null>(null);

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    await audioRecorder.stop();

    const uri = audioRecorder.uri;

    console.log("Recording stopped. File saved at:", uri);

    if (uri) {
      setAudioUri(uri);
      onRecordingComplete(uri);
    }
  };

  const deleteRecording = async () => {
    if (!audioUri) return;

    try {
      const file = new File(audioUri);
      file.delete();

      setAudioUri(null);

      Alert.alert("Deleted", "Recording deleted.");
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const status =
        await AudioModule.requestRecordingPermissionsAsync();

      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  return (
    <View className={`${colors.button} justify-center p-2`} >
      <TouchableOpacity
        className={`p-4 rounded-full ${recorderState.isRecording ? "bg-red-500" : "bg-sky-500"
          }`}
        onPress={recorderState.isRecording ? stopRecording : record}
      >
        <Text className="text-white text-center font-semibold text-lg">
          {recorderState.isRecording
            ? "⏹ Stop Recording"
            : "🎙️ Start Recording"}
        </Text>
      </TouchableOpacity>

      {audioUri && (
        <AudioPreview
          uri={audioUri}
          onDelete={deleteRecording}
        />
      )}
    </View>
  );
}
