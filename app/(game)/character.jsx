import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { COLORS, TEXT, BUTTON } from "../../constants/theme";
import { supabase } from "../../lib/supabase";

function Selector({ label, value, onPrev, onNext }) {
  return (
    <View style={styles.selectorRow}>
      <TouchableOpacity onPress={onPrev} style={styles.arrow}>
        <Text style={styles.arrowText}>{"<"}</Text>
      </TouchableOpacity>
      <View style={styles.selectorCenter}>
        <Text style={styles.selectorLabel}>{label}</Text>
        <Text style={styles.selectorValue}>{value ?? "—"}</Text>
      </View>
      <TouchableOpacity onPress={onNext} style={styles.arrow}>
        <Text style={styles.arrowText}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const RACE_CLASS_MAP = {
  Elf:   "Archer",
  Dwarf: "Sorcerer",
  Human: "Assassin",
};

export default function Character() {
  const [races, setRaces] = useState([]);
  const [skins, setSkins] = useState([]);

  const [raceIndex, setRaceIndex] = useState(0);
  const [skinIndex, setSkinIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchRaces();
  }, []);

  useEffect(() => {
    if (races.length > 0) fetchSkins(races[raceIndex].id);
    setSkinIndex(0);
  }, [raceIndex, races]);

  async function fetchRaces() {
    const { data, error } = await supabase.from("races").select("*");
    if (error) console.log(error.message);
    else setRaces(data);
  }

  async function fetchSkins(raceId) {
    const { data, error } = await supabase
      .from("skins")
      .select("*")
      .eq("race_id", raceId);
    if (error) console.log(error.message);
    else setSkins(data);
  }

  function cycle(index, setIndex, length, direction) {
    setIndex((index + direction + length) % length);
  }

  async function handleSave() {
    if (!races.length || !skins.length) return;

    const race = races[raceIndex];
    const className = RACE_CLASS_MAP[race.name];

    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("id")
      .eq("name", className)
      .single();
    if (classError) { console.log(classError.message); return; }

    const { data: { user } } = await supabase.auth.getUser();

    const { data: character, error: charError } = await supabase
      .from("characters")
      .upsert(
        {
          user_id: user.id,
          race_id: race.id,
          class_id: classData.id,
          skin_id: skins[skinIndex].id,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (charError) { console.log(charError.message); return; }

    const { error } = await supabase
      .from("users")
      .update({ character_id: character.id })
      .eq("id", user.id);

    if (error) { console.log(error.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Design Your Character</Text>

      <View style={styles.preview}>
        <Text style={styles.previewPlaceholder}>🧙</Text>
      </View>

      <View style={styles.selectors}>
        <Selector
          label="Race"
          value={races[raceIndex]?.name}
          onPrev={() => cycle(raceIndex, setRaceIndex, races.length, -1)}
          onNext={() => cycle(raceIndex, setRaceIndex, races.length, 1)}
        />
        <Selector
          label="Skin"
          value={skins[skinIndex]?.name}
          onPrev={() => cycle(skinIndex, setSkinIndex, skins.length, -1)}
          onNext={() => cycle(skinIndex, setSkinIndex, skins.length, 1)}
        />
      </View>

      <TouchableOpacity style={[BUTTON.primary.container, styles.saveButton, saved && styles.savedButton]} onPress={handleSave}>
        <Text style={BUTTON.primary.label}>{saved ? "Saved!" : "Save Character"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    ...TEXT.heading,
    fontSize: 28,
    marginBottom: 16,
  },
  preview: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  previewPlaceholder: {
    fontSize: 80,
  },
  selectors: {
    width: "100%",
    gap: 8,
    marginBottom: 24,
  },
  selectorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  arrow: {
    padding: 8,
  },
  arrowText: {
    color: COLORS.accent,
    fontSize: 22,
    fontWeight: "bold",
  },
  selectorCenter: {
    alignItems: "center",
    flex: 1,
  },
  selectorLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  selectorValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 2,
  },
  saveButton: {
    width: "100%",
  },
  savedButton: {
    backgroundColor: COLORS.healthGreen,
  },
});
