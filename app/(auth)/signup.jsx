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
import { supabase } from "../../lib/supabase";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSignup() {
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (error) {
      console.log(error.message);
    } else {
      router.push({ pathname: "/(auth)/verify", params: { email } });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={TEXT.paragraph}>Create your account to join the adventure</Text>
      <TextInput
        placeholder="Username"
        value={username}
        style={INPUT.container}
        placeholderTextColor={INPUT.placeholderColor}
        onChangeText={(text) => setUsername(text)}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Email"
        value={email}
        style={INPUT.container}
        placeholderTextColor={INPUT.placeholderColor}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        style={INPUT.container}
        placeholderTextColor={INPUT.placeholderColor}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        style={INPUT.container}
        placeholderTextColor={INPUT.placeholderColor}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
      />
      <TouchableOpacity style={BUTTON.primary.container} onPress={handleSignup}>
        <Text style={BUTTON.primary.label}>Sign Up</Text>
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
});
