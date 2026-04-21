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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(error.message);
    } else {
      router.replace("/(game)/join_group");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <Text style={TEXT.paragraph}>Welcome back, adventurer</Text>
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
      <TouchableOpacity style={BUTTON.primary.container} onPress={handleLogin}>
        <Text style={BUTTON.primary.label}>Log In</Text>
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
