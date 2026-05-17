import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS, TEXT, BUTTON } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

export default function Profile() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("id", user.id)
      .single();

    if (error) { console.log(error.message); return; }

    setUsername(data.username);
    setEmail(user.email);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/(auth)/");
  }

  async function handleDelete() {
    Alert.alert(
      "Delete Profile",
      "Are you sure? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete", style: "destructive", onPress: async () => {
            const { error } = await supabase.rpc("delete_user");
            if (error) { Alert.alert("Error", error.message); return; }
            await supabase.auth.signOut();
            router.replace("/(auth)/");
          }
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{username}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email}</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={BUTTON.primary.container} onPress={handleLogout}>
          <Text style={BUTTON.primary.label}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete Profile</Text>
        </TouchableOpacity>
      </View>
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
    gap: 24,
  },
  title: {
    ...TEXT.heading,
    fontSize: 40,
  },
  infoCard: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    gap: 8,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  value: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  buttons: {
    width: "100%",
    gap: 12,
  },
  deleteButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteText: {
    color: COLORS.danger,
    fontSize: 15,
    textDecorationLine: "underline",
  },
});
