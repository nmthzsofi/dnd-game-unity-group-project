import { StyleSheet, Text, View } from "react-native";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Text>Welcome to our game!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a7bfda",
    alignItems: "center",
    justifyContent: "center",
  },
});
