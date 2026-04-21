import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { COLORS, TEXT, BUTTON, INPUT } from "../../constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [code, setCode] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify your email address</Text>
      <Text style={TEXT.paragraph}>
        We have sent you and email with a verification code. Please also check
        your spam folder.
      </Text>
      <TextInput
        placeholder="Code"
        value={code}
        style={INPUT.container}
        onChangeText={(text) => setCode(text)}
      />
      <TouchableOpacity
        style={BUTTON.primary.container}
        onPress={() => router.push("/(auth)/verify")}
      >
        <Text style={BUTTON.primary.label}>Verify</Text>
      </TouchableOpacity>
      <TouchableOpacity style={BUTTON.secondary.container}>
        <Text style={BUTTON.secondary.label}>Resend Code</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 20,
  },
  title: {
    ...TEXT.heading,
    fontSize: 40,
    marginBottom: 8,
  },
  buttons: {
    width: "100%",
    gap: 12,
    marginTop: 16,
  },
});
