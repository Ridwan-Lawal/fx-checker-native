export const colors = {
  neutral: {
    900: "#0A0A0A",
    700: "#171719",
    600: "#202022",
    500: "#2e2e2e",
    450: "#6e6e74",
    400: "#3d3d3d",
    350: "#6e6e6e",
    300: "#454547",
    200: "#9d9d9d",
    150: "#9a9aa0",
    100: "#c6c6c6",
    70: "#f2f2f3",
    50: "#ffffff",
    borderColor: "#1f1f22",
  },
  lime: {
    800: "#283300",
    500: "#cef739",
  },
  green: {
    500: "#42eb05",
  },
  red: {
    500: "#ff4141",
  },
} as const;

export const fontSizes = {
  size40: 40,
  size32: 32,
  size24: 24,
  size20: 20,
  size16: 16,
  size14: 14,
  size15: 15,
  size13: 13,
  size11: 11,
  size12: 12,
  size10: 10,
} as const;

export const lineHeight = {
  leading100: "100%",
  leading120: "120%",
  leading140: "140%",
  leading110: "110%",
  leading130: "130%",
  leading5: 0.5,
} as const;

export const letterSpacing = {
  tracking0: 0,
  tracking1: 1,
  trackingNeg5: -0.5,
  trackingPos5: 0.5,
} as const;

export const spacing = {
  space0: 0,
  space2: 2,
  space4: 4,
  space6: 6,
  space8: 8,
  space10: 10,
  space12: 12,
  space16: 16,
  space20: 20,
  space24: 24,
  space32: 32,
  space40: 40,
  space48: 48,
  space56: 56,
  space64: 64,
  space80: 80,
  space96: 96,
  space112: 112,
  space128: 128,
  space140: 140,
} as const;

export const radius = {
  radius0: 0,
  radius4: 4,
  radius6: 6,
  radius8: 8,
  radius10: 10,
  radius12: 12,
  radius16: 16,
  radius20: 20,
  radius24: 24,
  radiusFull: 9999,
} as const;

export const fontFamily = {
  regular: "JetBrainsMono_400Regular",
  bold: "JetBrainsMono_700Bold",
  medium: "JetBrainsMono_500Medium",
  semiBold: "JetBrainsMono_600SemiBold",
  extraBold: "JetBrainsMono_800ExtraBold",
} as const;
