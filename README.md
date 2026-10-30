# Compendeon

A Pokédex app in the style of the Pokémon GBA/DS games, built with Expo (SDK 57), Expo Router and NativeWind. Data comes from [PokéAPI](https://pokeapi.co).

## Features

- National Pokédex with instant search by name, `#number` or type, plus type filters
- Browse by generation, with each generation's own list
- Pokémon pages: official artwork, animated sprite, stats, info, Pokédex entries and evolutions
- Favorites, saved on the device
- Offline-friendly caching: Pokémon data is stored locally, and images go into an app-managed cache capped at 100 MB (oldest removed first). The Options screen shows the total and can clear it.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (SDK 57) or press `w` for the web version.

## Checks

```bash
npx tsc --noEmit
npx jest --watchAll=false
```

## Project layout

- `app/`: screens (file-based routes); tabs are set up in `app/_layout.tsx`
- `components/pixel.tsx`: the pixel UI kit (dialogue boxes, buttons, HP bars, type badges, loader)
- `lib/pokeapi.ts`: PokéAPI fetchers, trimmed and cached through `lib/cache.ts`
- `lib/imageCache.ts`: the 100 MB image cache used by `components/CachedImage.tsx`
- `lib/colors.js`: the palette shared by Tailwind classes and inline styles
