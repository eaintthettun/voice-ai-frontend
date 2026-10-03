import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import diaryEntryService from "../services/diaryEntryService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";

type CurrentWeekData = {
  count: number;
  date: string;
};

type CurrentMonthData = {
  week1: number;
  week2: number;
  week3: number;
  week4: number;
};

type BarData = {
  value: number;
  label: string;
};

type LineChartData = {
  value: number;
  label: string;
};

type SummaryData = {
  _id: null;
  learning: number;
  meeting: number;
  tasks: number;
  total: number;
}
const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }]
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function AnalyticsScreen() {
  const [barData, setBarData] = useState<BarData[]>([]);
  const { top } = useSafeAreaInsets();
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null)
  const [lineChartData, setLineChartData] = useState<LineChartData[]>([]);

  useEffect(() => {
    const fetchCurrentWeekSummary = async () => {
      try {
        const response = await diaryEntryService.getCurrentWeekSummary();

        setSummaryData(response.data[0]);
      } catch (error) {
        console.error("Failed to fetch current week summary:", error);
      }
    };

    const fetchCurrentWeekTrend = async () => {
      try {
        const response = await diaryEntryService.getCurrentWeekTrend();

        const chartData: BarData[] = response.data.map(
          (item: CurrentWeekData, index: number) => ({
            value: item.count,
            label: days[index],
          })
        );

        setBarData(chartData);
      } catch (error) {
        console.error("Failed to fetch current week trend:", error);
      }
    };

    const fetchCurrentMonthWeeklyComparison = async () => {
      try {
        const response = await diaryEntryService.getWeeklyComparisonForCurrentMonth();

        console.log('response:', response.data[0]) //{"_id": null, "week1": 0, "week2": 7, "week3": 3, "week4": 0}

        const currentMonthData: CurrentMonthData = response.data[0];

        lineChartData[0] = { value: currentMonthData.week1, label: "Week 1" };
        lineChartData[1] = { value: currentMonthData.week2, label: "Week 2" };
        lineChartData[2] = { value: currentMonthData.week3, label: "Week 3" };
        lineChartData[3] = { value: currentMonthData.week4, label: "Week 4" };

        setLineChartData(lineChartData);// {value,label} pair
      } catch (error) {
        console.error("Failed to fetch current week trend:", error);
      }
    }

    fetchCurrentWeekSummary();
    fetchCurrentWeekTrend();
    fetchCurrentMonthWeeklyComparison();
  }, []);

  console.log('line chart data:', lineChartData)

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

      {/* All entries card */}
      {/* Current week summary */}
      <View className="mt-4 p-3">
        <Text className="p-2 mb-3" style={{ fontSize: hp(2.8),fontWeight: "600", }}>
          Current week summary</Text>
        {/* Four Cards */}
        <View className="flex-row gap-4">
          <LinearGradient
            colors={["#3B82F6", "#60A5FA"]}
            className="flex-1 rounded-2xl p-4 overflow-hidden"
          >
            <Text className="text-base text-white">
              All
            </Text>

            <Text className="text-3xl font-bold text-white mt-2">
              {summaryData?.total ?? 0}
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={["#3B82F6", "#60A5FA"]}
            className="flex-1 rounded-2xl p-4 overflow-hidden"
          >
            <Text className="text-base text-white">
              Learning
            </Text>

            <Text className="text-3xl font-bold text-white mt-2">
              {summaryData?.learning ?? 0}
            </Text>
          </LinearGradient>
        </View>

        <View className="mt-4 flex-row gap-4">
          <LinearGradient
            colors={["#3B82F6", "#60A5FA"]}
            className="flex-1 rounded-2xl p-4 overflow-hidden"
          >
            <Text className="text-base text-white">
              Meeting
            </Text>

            <Text className="text-3xl font-bold text-white mt-2">
              {summaryData?.meeting ?? 0}
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={["#3B82F6", "#60A5FA"]}
            className="flex-1 rounded-2xl p-4 overflow-hidden"
          >
            <Text className="text-base text-white">
              Tasks
            </Text>

            <Text className="text-3xl font-bold text-white mt-2">
              {summaryData?.tasks ?? 0}
            </Text>
          </LinearGradient>
        </View>
      </View>

      {/* Bar chart */}
      {/* Current week trend */}
      <View className="mt-4 p-3 bg-white mx-4 rounded-xl">
        <Text className="p-4 mb-2" style={{ fontSize: hp(2), fontWeight: "600"}}>
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

      {/* Weekly comparison for current month */}
      <View className="mt-4 p-3 bg-white mx-4 rounded-xl">
        <Text className="p-4 mb-2" style={{ fontSize: hp(2),fontWeight: "600", }}>
          Weekly comparison
        </Text>
        <LineChart
        //data={data}
          data={lineChartData}
          width={280}
          height={250}
          spacing={80}
          yAxisTextStyle={{
            color: "#464a52",
          }}
          xAxisLabelTextStyle={{
            color: "#464a52",
          }}
          color="#0d7097"
        />
      </View>
    </ScrollView>
  );
}