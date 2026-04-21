import { Tabs } from "expo-router";
import { COLORS } from "../../constants/theme";

export default function GameLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.accent,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textMuted,
      }}
    >
      <Tabs.Screen name="play" options={{ title: "Play" }} />
      <Tabs.Screen name="character" options={{ title: "Character" }} />
      <Tabs.Screen name="join_group" options={{ href: null }} />
      <Tabs.Screen name="create_group" options={{ href: null }} />
    </Tabs>
  );
}
