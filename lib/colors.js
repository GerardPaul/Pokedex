// The app palette, taken from the Compendeon device and logo mockups. Plain CommonJS so
// tailwind.config.js can require it and app code can import it, keeping Tailwind classes
// (bg-body, text-shell…) and inline styles on the same values.
module.exports = {
  // Device
  shell: "#DC2626", // red shell (header, device top)
  shellDark: "#991B1B", // shell shading
  body: "#2F464E", // slate device body (app background)
  bodyDark: "#233239", // recessed parts: tab bar, grille, button rings
  screen: "#B3E0FF", // light-blue screens
  bezel: "#8CA4B0", // grey screen bezel
  ink: "#1E293B", // outlines and text on screens
  platform: "#EBF0F3", // the white name platform
  steel: "#4B6F7B", // triangle buttons, platform edge
  lime: "#9FEC00", // hazard stripes, active tab
  muted: "#8CA4B0", // inactive icons and labels on the body
  shade: "#5B7682", // secondary text on screens

  // Device buttons (face color + darker 3D side)
  btnGreen: "#9FEC00",
  btnGreenSide: "#4F7600",
  btnYellow: "#FFDD00",
  btnYellowSide: "#7A6A00",
  btnBlue: "#008DFF",
  btnBlueSide: "#01375E",
  btnRed: "#F01E10",
  btnRedSide: "#5C130B",

  // Stat bars
  hpGreen: "#38C870",
  hpYellow: "#F8D030",
  hpRed: "#F05038",
};
