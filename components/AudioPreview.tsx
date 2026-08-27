import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Button, Text, View, StyleSheet } from "react-native";

//this accepts uri as prop and play the file with the player
export function AudioPreview({
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
    audioContainer: {
    marginTop: 30,
    gap: 10,
  },
})