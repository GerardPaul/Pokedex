/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: "#F4EDDB", // app background
        paper: "#FFFFFF", // dialogue box fill
        ink: "#3D4152", // borders, shadows, main text (soft slate, not pure black)
        muted: "#8A8DA0", // inactive icons and labels
        shade: "#B8B0A0", // inner borders, muted text
        "dex-red": "#E3350D",
        "dex-blue": "#3B4CCA",
        "hp-green": "#38C870",
        "hp-yellow": "#F8D030",
        "hp-red": "#F05038",
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
