import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { COLORS, TEXT, BUTTON } from "../../constants/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../lib/supabase";


export default function Verify() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  function handleConfirm() {
    router.replace("/(auth)/login");
  }

  async function handleResend() {
    const { error } = await supabase.auth.resend({
      email,
      type: "signup",
    });

    if (error) {
      console.log(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check your email</Text>
      <Text style={TEXT.paragraph}>
        We sent a verification link to {email}. Click the link in the email to
        confirm your account, then come back here.
      </Text>
      <TouchableOpacity
        style={BUTTON.primary.container}
        onPress={handleConfirm}
      >
        <Text style={BUTTON.primary.label}>I've verified my email</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={BUTTON.secondary.container}
        onPress={handleResend}
      >
        <Text style={BUTTON.secondary.label}>Resend Link</Text>
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
