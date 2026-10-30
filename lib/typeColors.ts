export const TYPE_COLORS: Record<string, string> = {
  normal: "#94a3b8",
  fire: "#f97316",
  water: "#3b82f6",
  electric: "#facc15",
  grass: "#22c55e",
  ice: "#22d3ee",
  fighting: "#b91c1c",
  poison: "#a855f7",
  ground: "#ca8a04",
  flying: "#818cf8",
  psychic: "#ec4899",
  bug: "#84cc16",
  rock: "#a16207",
  ghost: "#6d28d9",
  dragon: "#4338ca",
  dark: "#334155",
  steel: "#64748b",
  fairy: "#f9a8d4",
};

/** Type color, falling back to the "normal" gray for anything unknown. */
export function typeColor(type: string): string {
  return TYPE_COLORS[type] ?? TYPE_COLORS.normal;
}

// White glyph SVGs (MIT, github.com/duiker101/pokemon-type-svg-icons) — draw on a type-colored background
export function typeIconUrl(type: string): string {
  return `https://cdn.jsdelivr.net/gh/duiker101/pokemon-type-svg-icons@1.0.0/icons/${type}.svg`;
}
