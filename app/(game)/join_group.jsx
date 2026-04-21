import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { COLORS, TEXT, BUTTON, INPUT } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

export default function JoinGroup() {
  const router = useRouter();
  const [code, setCode] = useState("");

  async function handleJoin() {
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .select("group_code")
      .eq("group_code", code)
      .single();

    if (groupError || !group) {
      console.log("Group not found");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("users")
      .update({ current_group: code })
      .eq("id", user.id);

    if (error) {
      console.log(error.message);
    } else {
      router.replace("/(game)/character");
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => router.push("/(game)/create_group")}
      >
        <Text style={styles.plusText}>+</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Join a Game</Text>
      <Text style={TEXT.paragraph}>Enter the 6-digit group code to join your party</Text>
      <TextInput
        placeholder="Group code"
        value={code}
        style={INPUT.container}
        onChangeText={(text) => setCode(text)}
        placeholderTextColor={INPUT.placeholderColor}
        keyboardType="number-pad"
        maxLength={6}
      />
      <TouchableOpacity style={BUTTON.primary.container} onPress={handleJoin}>
        <Text style={BUTTON.primary.label}>Join</Text>
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
  plusButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  plusText: {
    color: COLORS.background,
    fontSize: 28,
    fontWeight: "bold",
    lineHeight: 32,
  },
});
