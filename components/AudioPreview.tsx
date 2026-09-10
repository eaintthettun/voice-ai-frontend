import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Button, Text, View, TouchableOpacity } from "react-native";
import { colors } from "../theme";
import Slider from "@react-native-community/slider";
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';

// this accepts uri as prop and plays the file with the player
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <View >
      {/* play,pause button and slider */}
      <View className="flex-row items-center mx-4">
        <TouchableOpacity onPress={togglePlay}  >
          {status.playing ? (
            <Feather name="pause-circle" color="#050505" size={30} />
          ) : (
            <Octicons name="play" color="#050505" size={30} />
          )}
        </TouchableOpacity>

        <Text className="w-10 ml-3">
          {formatTime(status.currentTime)}
        </Text>

        <View className="flex-1">
          <Slider
            minimumValue={0}
            maximumValue={status.duration || 1}
            value={status.currentTime}
            onSlidingComplete={(value) => {
              player.seekTo(value);
            }}
          />
        </View>

        <Text className="w-10 text-right">
          {formatTime(status.duration)}
        </Text>
      </View>

      {onDelete && (
        <View className="mx-4 mt-3">
          <Button
          title="Delete"
          onPress={onDelete}
          color="red"
          />
        </View>
      )}
    </View>
  );
}