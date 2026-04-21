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

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/(auth)/")}>
        <Text style={BUTTON.secondary.label}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Log in</Text>
      <Text style={TEXT.paragraph}>Please enter your email address below</Text>
      <TextInput
        placeholder="Username"
        value={username}
        style={INPUT.container}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="Email"
        value={email}
        style={INPUT.container}
        onChangeText={(text) => setEmail(text)}
      />
      <TouchableOpacity
        style={BUTTON.primary.container}
        onPress={() => router.push("/(auth)/verify")}
      >
        <Text style={BUTTON.primary.label}>Sign up</Text>
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
