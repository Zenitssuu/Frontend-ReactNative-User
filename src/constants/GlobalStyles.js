import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
/* fonts */
export const FontFamily = {
  Inter_Regular: "Inter-Regular",
  Inter_Medium: "Inter-Medium",
  Inter_Bold: "Inter-Bold",
  Inter_SemiBold: "Inter-SemiBold",
};

/* font sizes */
export const FontSize = {
  peviewHeader: 14.4,
  previewLabel: 14.4,
  previewValue: 14.4,
  previewBtn: 14.4,

  heading_H1: 24,
  heading_H2: 20,
  heading_H3: 18,
  body_Text: 14,
  button_Text: 16,
  caption: 12,
};

/* Colors */
export const Color = {
  bcHeader: "#01869e",k
  primary: "#0077B6",
  lightBlue: "#EBFAFF",
  background: "#F9F9F9",
  white: "#FFFFFF",
  text: "#333333",
  textLight: "#666666",
  textLighter: "#888888",
  accent: "#03045E",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#FF5252",
  border: "#E0E0E0",
  shadow: "#000000",

  headerBg: "#EBFAFF",
  tabBarActive: "#0077B6",
  tabBarInactive: "#888888",

  // General Colors
  colorWhite: "#fff",
  colorBlack: "#000",

  // Buttons
  inactivebutton: "#8e8e8e70",
  borderColor: "#ddd",
  separatorColor: "#eee",

  bclight: "#FFF2F4",
  bcBackground: "#F9F9F9",
  bcNotification: "#fff",
  bcSubSection: "#fff",
  headingColor: "#01869e",
  sectionHeaderColor: "#EBFAFF",

  // Chemotherapy Side
  chemoHeader: "#7fcac6",
  chemoNotification: "#a3d9d6",
  chemoBackground: "#d9efee",

  // text colors
  lightGray: "#E0E0E0",
  darkGray: "#333333",
  Blue: "#4A90E2",

  // Question answer colors
  answerColor: "#555555",
  questionColor: "#333333",
  background: "#F8F9FA",
  highlight: "#E0F7FA",

  // Check Tick Colour
  checkColor: "#3CB371",
};

/* border radiuses */
export const Border = {
  box_br: 1,
  br_11xl: 30,
  br_8xs: 5,
  br_3xs: 10,
  br_xl: 20,
};

/* Button color */
export const ButtonColor = {
  patient_submit_button_color: ["#E1A1C4", "#4A90E2"],
  option_button_color: ["#C78DC4", "#FFFFFF"],
  option_select_color: "#E582AD",
};

/* Margin */
export const Margin = {
  margin_v: 10,
  margin_h: "2%",
  margin_bottom: 20,
  margin_top: 10,

  m_h: 10,
  m_bttom: 20,
  m_top: 10,
};

/* linierGradients */
export const linearGradient = {
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 },

  Welcome_bgcolor: ["#8FD4AF", "#FFCFDE"],
  Doctor_bgcolor: ["#8FD4AF", "#8FD4AF"],
  Doctor_Box: ["#74AF93", "#74AF93"],
  Patient_box_color: ["#FFE7FE", "#ECB4E0"],
  Patient_box_color: ["#FFC5D7", "#FFC5D7"],
  Patient_bgcolor: ["#FFCFDE", "#FFCFDE"],
};

export const SIZES = {
  // Global sizes
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  xlarge: 24,
  xxlarge: 32,

  // Font sizes
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 18,
  h5: 16,
  body1: 16,
  body2: 14,
  body3: 12,

  // Radius
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 12,

  // Spacing
  padding: 16,
  margin: 16,
};

export const FONTS = {
  h1: { fontSize: SIZES.h1, fontWeight: "700", letterSpacing: 0.2 },
  h2: { fontSize: SIZES.h2, fontWeight: "600", letterSpacing: 0.2 },
  h3: { fontSize: SIZES.h3, fontWeight: "600", letterSpacing: 0.2 },
  h4: { fontSize: SIZES.h4, fontWeight: "600", letterSpacing: 0.2 },
  h5: { fontSize: SIZES.h5, fontWeight: "600", letterSpacing: 0.2 },
  body1: { fontSize: SIZES.body1, fontWeight: "400", letterSpacing: 0.5 },
  body2: { fontSize: SIZES.body2, fontWeight: "400", letterSpacing: 0.5 },
  body3: { fontSize: SIZES.body3, fontWeight: "400", letterSpacing: 0.5 },
  button: { fontSize: SIZES.body1, fontWeight: "600", letterSpacing: 1 },
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
};
