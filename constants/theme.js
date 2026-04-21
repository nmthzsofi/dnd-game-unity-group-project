export const COLORS = {
  background: "#1a1a2e",
  surface: "#16213e",
  accent: "#c9a84c",
  accentDim: "#a07830",
  text: "#e8e0d0",
  textMuted: "#8888aa",
  danger: "#c0392b",
  border: "#2a2a4a",
  healthGreen: "#4caf50",
};

export const TEXT = {
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.accent,
    letterSpacing: 1.5,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    color: COLORS.textMuted,
    lineHeight: 24,
    textAlign: "center",
  },
};

export const INPUT = {
  container: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderColor: COLORS.accent,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: COLORS.text,
    fontSize: 16,
  },
  placeholderColor: "#5a5a7a",
};

export const BUTTON = {
  primary: {
    container: {
      backgroundColor: COLORS.accent,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 6,
      alignItems: "center",
    },
    label: {
      color: COLORS.background,
      fontWeight: "bold",
      fontSize: 16,
      letterSpacing: 1,
    },
  },
  secondary: {
    container: {
      backgroundColor: "transparent",
      paddingVertical: 14,
      paddingHorizontal: 32,
      alignItems: "center",
    },
    label: {
      color: COLORS.accent,
      fontSize: 15,
      textDecorationLine: "underline",
    },
  },
};
