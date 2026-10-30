const colors = require("./lib/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        shell: colors.shell,
        body: colors.body,
        "body-dark": colors.bodyDark,
        screen: colors.screen,
        bezel: colors.bezel,
        ink: colors.ink,
        platform: colors.platform,
        lime: colors.lime,
        muted: colors.muted,
        shade: colors.shade,
        "hp-yellow": colors.hpYellow,
      },
      fontFamily: {
        Pixel: "PressStart2P", // titles, buttons, numbers
        PixelBody: "PixelifySans", // names and longer text
        Logo: "Silkscreen", // home logo only (Silkscreen Bold)
      },
    },
  },
  plugins: [],
};
