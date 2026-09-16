import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import diaryEntryService from "../services/diaryEntryService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

type CurrentWeekData = {
  count: number;
  date: string;
};

type BarData = {
  value: number;
  label: string;
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AnalyticsScreen() {
  const [barData, setBarData] = useState<BarData[]>([]);
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    const fetchCurrentWeekData = async () => {
      const response = await diaryEntryService.getCurrentWeekData();

      const chartData: BarData[] = response.data.map(
        (item: CurrentWeekData, index: number) => ({
          value: item.count,
          label: days[index],
        })
      );

      setBarData(chartData);
    };

    fetchCurrentWeekData();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 30,
      }}
      showsVerticalScrollIndicator={false}
      className="flex-1"
    >
      <View className="bg-sky-600 rounded-b-3xl p-3" style={{ paddingTop: top }}>
          <Text className={`text-white text-xl font-bold text-center`}>
            Analytics
          </Text>
      </View>

      {/* All entries */}
      
      {/* Bar chart */}
      <View className="mt-4 p-3">
        <Text className="p-4 bg-blue-100 text-gray-700 font-bold" style={{ fontSize: hp(2) }}>
          Diary Entries This Week
        </Text>
        <BarChart
          data={barData}
          width={280}
          height={250}
          barWidth={25}
          spacing={15}
          roundedTop
          frontColor="#F59E0B"
          yAxisColor="#787a7e"
          xAxisColor="#787a7e"
          noOfSections={5}
          yAxisTextStyle={{
            color: "#464a52",
          }}
          xAxisLabelTextStyle={{
            color: "#464a52",
          }}
        />
      </View>
    </ScrollView>
  );
}