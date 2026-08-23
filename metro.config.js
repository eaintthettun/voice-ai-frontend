const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig("D:\\Final year\\my-workspace-diary\\voice-ai-frontend");
module.exports = withNativeWind(config, {
  input: "./global.css",
});