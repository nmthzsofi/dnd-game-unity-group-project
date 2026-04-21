import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

export default function Play() {
  const router = useRouter();
  const [health, setHealth] = useState(100);
  const [maxHealth, setMaxHealth] = useState(100);
  const [username, setUsername] = useState("");
  const [inGroup, setInGroup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayerData();
  }, []);

  async function fetchPlayerData() {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("users")
      .select("username, current_group, characters(class_id, classes(base_health))")
      .eq("id", user.id)
      .single();

    if (error) { console.log(error.message); return; }

    if (!data.current_group) {
      setLoading(false);
      return;
    }

    setInGroup(true);
    setLoading(false);
    setUsername(data.username);
    const baseHealth = data.characters?.classes?.base_health ?? 100;
    setHealth(baseHealth);
    setMaxHealth(baseHealth);
  }

  async function handleLeave() {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("users").update({ current_group: null }).eq("id", user.id);
    router.replace("/(game)/join_group");
  }

  const healthPercent = Math.max(0, (health / maxHealth) * 100);
  const healthColor = healthPercent > 50
    ? COLORS.healthGreen
    : healthPercent > 25
    ? "#e6a817"
    : COLORS.danger;

  if (loading) return (
    <View style={styles.container}>
      <Text style={{ color: COLORS.textMuted, textAlign: "center", marginTop: 40 }}>Loading...</Text>
    </View>
  );

  if (!inGroup) return (
    <View style={[styles.container, { justifyContent: "center", alignItems: "center", gap: 16 }]}>
      <Text style={{ color: COLORS.textMuted, fontSize: 16, textAlign: "center" }}>
        You are not in a group yet.
      </Text>
      <TouchableOpacity style={{ backgroundColor: COLORS.accent, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 }}
        onPress={() => router.push("/(game)/join_group")}>
        <Text style={{ color: COLORS.background, fontWeight: "bold", fontSize: 16 }}>Join a Game</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.closeButton} onPress={handleLeave}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.healthSection}>
        <View style={styles.healthLabelRow}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.healthText}>{health} / {maxHealth}</Text>
        </View>
        <View style={styles.healthBarBg}>
          <View style={[styles.healthBarFill, { width: `${healthPercent}%`, backgroundColor: healthColor }]} />
        </View>
      </View>

      <View style={styles.characterArea}>
        <Text style={styles.characterPlaceholder}>🧙</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>⚔ Act</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rollButton}>
          <Text style={styles.rollButtonText}>🎲 Roll</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
    padding: 4,
  },
  closeText: {
    color: COLORS.textMuted,
    fontSize: 20,
  },
  healthSection: {
    marginBottom: 16,
  },
  healthLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  username: {
    color: COLORS.accent,
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  healthText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  healthBarBg: {
    height: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  healthBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  characterArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  characterPlaceholder: {
    fontSize: 100,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  rollButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  actionButtonText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  rollButtonText: {
    color: COLORS.accent,
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
