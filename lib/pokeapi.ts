import { cached } from "./cache";

const BASE = "https://pokeapi.co/api/v2";
const SPRITES = "https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon";

// ─── Types (trimmed shapes — only what the app renders gets cached) ───────────

interface NamedResource {
  name: string;
  url: string;
}

export interface PokemonListItem {
  id: number;
  name: string;
  sprite: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  artwork: string | null;
  types: string[];
  stats: { name: string; value: number }[];
  abilities: { name: string; hidden: boolean }[];
}

export interface PokemonSpecies {
  id: number;
  genus: string | null;
  flavorTexts: { version: string; text: string }[];
  evolutionChainUrl: string | null;
}

export interface GenerationListItem {
  id: number;
  name: string;
}

export interface GenerationDetail {
  id: number;
  region: string;
  games: string[];
  speciesIds: number[]; // sorted national dex ids
}

/** Evolution stages by depth, e.g. [[eevee], [vaporeon, jolteon, ...]] */
export type EvolutionStages = { id: number; name: string }[][];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function idFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return Number(parts[parts.length - 1]);
}

export function spriteUrlFromId(id: number): string {
  return `${SPRITES}/${id}.png`;
}

export function shinyArtworkUrlFromId(id: number): string {
  return `${SPRITES}/other/official-artwork/shiny/${id}.png`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PokeAPI ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

// ─── Full national dex index (one request, then everything is local) ──────────

export async function fetchAllPokemon(): Promise<PokemonListItem[]> {
  const index = await cached("species_index", async () => {
    const data = await fetchJson<{ results: NamedResource[] }>(
      `${BASE}/pokemon-species?limit=2000`
    );
    return data.results
      .map((r) => ({ id: idFromUrl(r.url), name: r.name }))
      .sort((a, b) => a.id - b.id);
  });
  return index.map((p) => ({ ...p, sprite: spriteUrlFromId(p.id) }));
}

export function filterPokemon(
  list: PokemonListItem[],
  { query = "", typeIds, speciesIds }: { query?: string; typeIds?: Set<number>; speciesIds?: Set<number> }
): PokemonListItem[] {
  const q = query.trim().toLowerCase().replace(/^#/, "");
  const asId = /^\d+$/.test(q) ? Number(q) : null;
  return list.filter(
    (p) =>
      (!speciesIds || speciesIds.has(p.id)) &&
      (!typeIds || typeIds.has(p.id)) &&
      (!q || p.id === asId || p.name.includes(q))
  );
}

// ─── Pokémon detail ────────────────────────────────────────────────────────────

export function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  return cached(`pokemon_${id}`, async () => {
    const d = await fetchJson<any>(`${BASE}/pokemon/${id}`);
    return {
      id: d.id,
      name: d.name,
      height: d.height,
      weight: d.weight,
      artwork: d.sprites.other?.["official-artwork"]?.front_default ?? d.sprites.front_default ?? null,
      types: d.types.map((t: any) => t.type.name),
      stats: d.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
      abilities: d.abilities.map((a: any) => ({ name: a.ability.name, hidden: a.is_hidden })),
    };
  });
}

// ─── Pokémon species (flavor text, genus, evolution link) ─────────────────────

export function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  return cached(`species_${id}`, async () => {
    const s = await fetchJson<any>(`${BASE}/pokemon-species/${id}`);
    // Deduplicated english flavor texts keyed by version name
    const seen = new Set<string>();
    const flavorTexts: PokemonSpecies["flavorTexts"] = [];
    for (const e of s.flavor_text_entries) {
      if (e.language.name !== "en" || seen.has(e.version.name)) continue;
      seen.add(e.version.name);
      flavorTexts.push({ version: e.version.name, text: e.flavor_text.replace(/\f|\n/g, " ") });
    }
    return {
      id: s.id,
      genus: s.genera.find((g: any) => g.language.name === "en")?.genus ?? null,
      flavorTexts,
      evolutionChainUrl: s.evolution_chain?.url ?? null,
    };
  });
}

// ─── Evolution chain ──────────────────────────────────────────────────────────

export function fetchEvolutionChain(url: string): Promise<EvolutionStages> {
  return cached(`evolution_${idFromUrl(url)}`, async () => {
    const data = await fetchJson<any>(url);
    const stages: EvolutionStages = [];
    let level = [data.chain];
    while (level.length) {
      stages.push(level.map((n: any) => ({ id: idFromUrl(n.species.url), name: n.species.name })));
      level = level.flatMap((n: any) => n.evolves_to);
    }
    return stages;
  });
}

// ─── Generations ──────────────────────────────────────────────────────────────

export function fetchGenerations(): Promise<GenerationListItem[]> {
  return cached("generations", async () => {
    const data = await fetchJson<{ results: NamedResource[] }>(`${BASE}/generation`);
    return data.results.map((r) => ({ id: idFromUrl(r.url), name: r.name }));
  });
}

export function fetchGenerationDetail(id: number): Promise<GenerationDetail> {
  return cached(`generation_${id}`, async () => {
    const g = await fetchJson<any>(`${BASE}/generation/${id}`);
    return {
      id: g.id,
      region: g.main_region.name,
      games: g.version_groups.map((vg: NamedResource) => vg.name.replace(/-/g, " ")),
      // Species are not returned in national dex order
      speciesIds: g.pokemon_species.map((s: NamedResource) => idFromUrl(s.url)).sort((a: number, b: number) => a - b),
    };
  });
}

// ─── Pokémon ids by type ──────────────────────────────────────────────────────

export function fetchPokemonIdsByType(typeName: string): Promise<number[]> {
  return cached(`type_${typeName}`, async () => {
    const data = await fetchJson<{ pokemon: { pokemon: NamedResource }[] }>(`${BASE}/type/${typeName}`);
    return data.pokemon.map((e) => idFromUrl(e.pokemon.url));
  });
}
