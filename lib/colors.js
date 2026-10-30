// The app palette. Plain CommonJS so tailwind.config.js can require it and app code can import it,
// keeping Tailwind classes (bg-ink, text-dex-red…) and inline styles on the same values.
module.exports = {
  cream: "#F4EDDB", // app background
  paper: "#FFFFFF", // dialogue box fill
  ink: "#3D4152", // borders, shadows, main text (soft slate, not pure black)
  muted: "#8A8DA0", // inactive icons, labels, placeholders
  shade: "#B8B0A0", // inner borders, muted text
  sand: "#E8E0CC", // inactive tab fill
  dexRed: "#E3350D",
  dexBlue: "#3B4CCA",
  hpGreen: "#38C870",
  hpYellow: "#F8D030",
  hpRed: "#F05038",
};
