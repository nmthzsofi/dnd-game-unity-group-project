import { Stack } from "expo-router";
import { COLORS } from "../../constants/theme";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.accent,
        headerTitle: "",
      }}
    />
  );
}
