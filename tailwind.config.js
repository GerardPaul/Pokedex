const colors = require("./lib/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: colors.cream,
        paper: colors.paper,
        ink: colors.ink,
        muted: colors.muted,
        shade: colors.shade,
        "dex-red": colors.dexRed,
        "hp-yellow": colors.hpYellow,
      },
      fontFamily: {
        Pixel: "PressStart2P", // titles, buttons, numbers
        PixelBody: "PixelifySans", // names and longer text
        PokemonSolid: "PokemonSolid", // home logo only
      },
    },
  },
  plugins: [],
};
