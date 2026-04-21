import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { COLORS, TEXT, BUTTON } from "../../constants/theme";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔ DND Simulator</Text>
      <Text style={TEXT.paragraph}>
        Join your party, choose your character, and let the adventure begin.
        You will need a shared screen to display the game events.
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={BUTTON.primary.container}>
          <Text style={BUTTON.primary.label}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={BUTTON.secondary.container}>
          <Text style={BUTTON.secondary.label}>I already have an account</Text>
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
