import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Button, Text, View, StyleSheet } from "react-native";
import { colors } from "../theme";

//this accepts uri as prop and play the file with the player
export function AudioPreview({
  uri,
  onDelete,
}: {
  uri: string;
  onDelete?: () => void;
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
      <Text className={`${colors.heading} text-base font-semibold mx-2`}>Recording</Text>

      <Button
        title={status.playing ? "Pause" : "Play"}
        onPress={togglePlay}
      />

      {onDelete && (
        <Button
          title="Delete"
          onPress={onDelete}
          color="red"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    audioContainer: {
    marginTop: 20,
    gap: 10,
  },
})