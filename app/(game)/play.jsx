import {
  StyleSheet, Text, View, TouchableOpacity,
  Modal, FlatList, Pressable,
} from "react-native";
import { useState, useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import { COLORS } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

export default function Play() {
  const router = useRouter();
  const [health, setHealth] = useState(100);
  const [maxHealth, setMaxHealth] = useState(100);
  const [username, setUsername] = useState("");
  const [inGroup, setInGroup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [groupId, setGroupId] = useState(null);
  const [userId, setUserId] = useState(null);

  const [actVisible, setActVisible] = useState(false);
  const [actions, setActions] = useState([]);
  const [rollVisible, setRollVisible] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);

  const DICE = [
    { label: "D4", sides: 4 },
    { label: "D6", sides: 6 },
    { label: "D8", sides: 8 },
    { label: "D10", sides: 10 },
    { label: "D12", sides: 12 },
    { label: "D20", sides: 20 },
  ];

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setInGroup(false);
      fetchPlayerData();
    }, [])
  );

  async function fetchPlayerData() {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user.id);

    const { data, error } = await supabase
      .from("users")
      .select("username, current_group, characters(class_id, classes(base_health))")
      .eq("id", user.id)
      .single();

    if (error) { console.log(error.message); setLoading(false); return; }
    if (!data.current_group) { setLoading(false); return; }

    setInGroup(true);
    setGroupId(data.current_group);
    setUsername(data.username);
    const baseHealth = data.characters?.classes?.base_health ?? 100;
    setHealth(baseHealth);
    setMaxHealth(baseHealth);
    await fetchActions(data.characters?.class_id);
    setLoading(false);
  }

  async function fetchActions(classId) {
    if (!classId) return;
    const { data, error } = await supabase
      .from("class_actions")
      .select("actions(id, name, icon_name, description)")
      .eq("class_id", classId);
    if (error) { console.log(error.message); return; }
    setActions(data.map((row) => row.actions));
  }

  async function handleAction(action) {
    await supabase.from("game_events").insert({
      group_id: groupId,
      user_id: userId,
      event_type: "action",
      event_effect: { action_id: action.id, action_name: action.name },
    });
    setActVisible(false);
  }

  async function handleRoll(die) {
    const result = Math.ceil(Math.random() * die.sides);
    setLastRoll({ die: die.label, result });
    await supabase.from("game_events").insert({
      group_id: groupId,
      user_id: userId,
      event_type: "dice",
      event_effect: { die: die.label, result },
    });
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
      <TouchableOpacity
        style={{ backgroundColor: COLORS.accent, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 }}
        onPress={() => router.push("/(game)/join_group")}
      >
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
        <TouchableOpacity style={styles.actionButton} onPress={() => setActVisible(true)}>
          <Text style={styles.actionButtonText}>⚔ Act</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rollButton} onPress={() => { setLastRoll(null); setRollVisible(true); }}>
          <Text style={styles.rollButtonText}>🎲 Roll</Text>
        </TouchableOpacity>
      </View>

      {/* Dice Sheet */}
      <Modal visible={rollVisible} transparent animationType="slide" onRequestClose={() => setRollVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setRollVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Roll a Die</Text>
          {lastRoll && (
            <Text style={styles.rollResult}>
              {lastRoll.die}: <Text style={{ color: COLORS.accent }}>{lastRoll.result}</Text>
            </Text>
          )}
          <View style={styles.diceGrid}>
            {DICE.map((die) => (
              <TouchableOpacity key={die.label} style={styles.diceButton} onPress={() => handleRoll(die)}>
                <Text style={styles.diceLabel}>{die.label}</Text>
                <Text style={styles.diceSides}>1–{die.sides}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Action Sheet */}
      <Modal visible={actVisible} transparent animationType="slide" onRequestClose={() => setActVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setActVisible(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Choose an Action</Text>
          <FlatList
            data={actions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.actionList}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.actionItem} onPress={() => handleAction(item)}>
                <Text style={styles.actionName}>{item.name}</Text>
                <Text style={styles.actionDesc}>{item.description}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ color: COLORS.textMuted, textAlign: "center" }}>No actions available</Text>
            }
          />
        </View>
      </Modal>

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    maxHeight: "50%",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.textMuted,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    color: COLORS.accent,
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
    marginBottom: 16,
  },
  rollResult: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  diceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  diceButton: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 10,
    width: "28%",
    paddingVertical: 16,
    alignItems: "center",
  },
  diceLabel: {
    color: COLORS.accent,
    fontWeight: "bold",
    fontSize: 18,
  },
  diceSides: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  actionList: {
    gap: 8,
  },
  actionItem: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  actionName: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  actionDesc: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
});
