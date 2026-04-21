import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { COLORS, TEXT, BUTTON, INPUT } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function CreateGroup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState(generateCode());

  async function handleCreate() {
    const { data: { user } } = await supabase.auth.getUser();

    const { error: groupError } = await supabase.from("groups").insert({
      group_code: code,
      group_name: name,
      created_by: user.id,
    });

    if (groupError) {
      console.log(groupError.message);
      return;
    }

    const { error: userError } = await supabase
      .from("users")
      .update({ current_group: code })
      .eq("id", user.id);

    if (userError) {
      console.log(userError.message);
    } else {
      router.replace("/(game)/play");
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Create a Game</Text>
      <Text style={TEXT.paragraph}>Give your group a name and share the code with your party</Text>
      <TextInput
        placeholder="Group name"
        value={name}
        style={INPUT.container}
        onChangeText={(text) => setName(text)}
        placeholderTextColor={INPUT.placeholderColor}
      />
      <View style={styles.codeRow}>
        <Text style={styles.code}>{code}</Text>
        <TouchableOpacity
          style={styles.regenerateButton}
          onPress={() => setCode(generateCode())}
        >
          <Text style={styles.regenerateText}>↻</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={BUTTON.primary.container} onPress={handleCreate}>
        <Text style={BUTTON.primary.label}>Create Group</Text>
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
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  code: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.accent,
    letterSpacing: 6,
  },
  regenerateButton: {
    padding: 8,
  },
  regenerateText: {
    fontSize: 28,
    color: COLORS.textMuted,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 4,
    marginBottom: 8,
  },
  closeText: {
    color: COLORS.textMuted,
    fontSize: 20,
  },
});
