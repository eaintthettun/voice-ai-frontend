import { useState, useEffect } from "react";
import { View, StyleSheet, Button, Alert, Text } from "react-native";
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
  useAudioPlayer,
  useAudioPlayerStatus,
} from "expo-audio";
import { File } from "expo-file-system";

export default function AddNoteScreen() {
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
    <View style={styles.container}>
      <Button
        title={
          recorderState.isRecording
            ? "Stop recording"
            : "Start recording"
        }
        onPress={
          recorderState.isRecording
            ? stopRecording
            : record
        }
      />

      {audioUri && (
        <AudioPreview
          uri={audioUri}
          onDelete={deleteRecording}
        />
      )}
    </View>
  );
}

function AudioPreview({
  uri,
  onDelete,
}: {
  uri: string;
  onDelete: () => void;
}) {
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  const togglePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  console.log("AudioPreview render. Player state:", status.playing);

  return (
    <View style={styles.audioContainer}>
      <Text>Recording ready</Text>

      <Button
        title={status.playing ? "Pause" : "Play"}
        onPress={togglePlay}
      />

      <Button
        title="Delete"
        onPress={onDelete}
        color="red"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 10,
  },

  audioContainer: {
    marginTop: 30,
    gap: 10,
  },
});