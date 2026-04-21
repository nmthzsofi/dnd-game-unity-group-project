export const COLORS = {
  background: "#1a1a2e",
  surface: "#16213e",
  accent: "#c9a84c",
  accentDim: "#a07830",
  text: "#e8e0d0",
  textMuted: "#8888aa",
  danger: "#c0392b",
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
