import { cacheGet, cacheSet } from "./cache";

const BASE = "https://pokeapi.co/api/v2";
const PAGE_SIZE = 20;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NamedResource {
  name: string;
  url: string;
}

export interface PokemonListItem {
  id: number;
  name: string;
  sprite: string;
}

export interface PokemonType {
  slot: number;
  type: NamedResource;
}

export interface PokemonStat {
  base_stat: number;
  stat: NamedResource;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    front_shiny: string | null;
    other: {
      "official-artwork": { front_default: string | null };
    };
  };
  types: PokemonType[];
  stats: PokemonStat[];
  species: NamedResource;
}

export interface PokemonSpecies {
  id: number;
  generation: NamedResource;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: NamedResource;
    version: NamedResource;
  }>;
}

export interface GenerationListItem {
  id: number;
  name: string;
}

export interface GenerationDetail {
  id: number;
  name: string;
  main_region: NamedResource;
  version_groups: NamedResource[];
  pokemon_species: NamedResource[];
}

export interface TypeDetail {
  pokemon: Array<{ pokemon: NamedResource }>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function idFromUrl(url: string): number {
  const parts = url.replace(/\/$/, "").split("/");
  return Number(parts[parts.length - 1]);
}

function spriteUrl(id: number): string {
  return `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/${id}.png`;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PokeAPI ${res.status}: ${url}`);
  return res.json() as Promise<T>;
}

// ─── Pokémon list (paginated) ──────────────────────────────────────────────────

export async function fetchPokemonPage(page: number): Promise<PokemonListItem[]> {
  const offset = (page - 1) * PAGE_SIZE;
  const cacheKey = `@pokedex/pokemon_page_${page}`;

  const cached = await cacheGet<PokemonListItem[]>(cacheKey);
  if (cached) return cached.map((item) => ({ ...item, sprite: spriteUrl(item.id) }));

  const data = await fetchJson<{ results: NamedResource[] }>(
    `${BASE}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`
  );

  const items: PokemonListItem[] = data.results.map((r) => {
    const id = idFromUrl(r.url);
    return { id, name: r.name, sprite: spriteUrl(id) };
  });

  await cacheSet(cacheKey, items);
  return items;
}

// ─── Pokémon detail ────────────────────────────────────────────────────────────

export async function fetchPokemonDetail(id: number): Promise<PokemonDetail> {
  const cacheKey = `@pokedex/pokemon_detail_${id}`;

  const cached = await cacheGet<PokemonDetail>(cacheKey);
  if (cached) return cached;

  const data = await fetchJson<PokemonDetail>(`${BASE}/pokemon/${id}`);
  await cacheSet(cacheKey, data);
  return data;
}

// ─── Pokémon species (flavor text + generation) ────────────────────────────────

export async function fetchPokemonSpecies(id: number): Promise<PokemonSpecies> {
  const cacheKey = `@pokedex/pokemon_species_${id}`;

  const cached = await cacheGet<PokemonSpecies>(cacheKey);
  if (cached) return cached;

  const data = await fetchJson<PokemonSpecies>(`${BASE}/pokemon-species/${id}`);
  await cacheSet(cacheKey, data);
  return data;
}

export function spriteUrlFromId(id: number): string {
  return `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/${id}.png`;
}

export function shinySpriteUrlFromId(id: number): string {
  return `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/shiny/${id}.png`;
}

export function getFlavorText(species: PokemonSpecies): string {
  const entry = species.flavor_text_entries.find(
    (e) => e.language.name === "en"
  );
  return entry
    ? entry.flavor_text.replace(/\f|\n/g, " ")
    : "No description available.";
}

// ─── Generation list ──────────────────────────────────────────────────────────

export async function fetchGenerations(): Promise<GenerationListItem[]> {
  const cacheKey = "@pokedex/generations_index";

  const cached = await cacheGet<GenerationListItem[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchJson<{ results: NamedResource[] }>(
    `${BASE}/generation?limit=9&offset=0`
  );

  const items: GenerationListItem[] = data.results.map((r) => ({
    id: idFromUrl(r.url),
    name: r.name,
  }));

  await cacheSet(cacheKey, items);
  return items;
}

// ─── Generation detail ────────────────────────────────────────────────────────

export async function fetchGenerationDetail(id: number): Promise<GenerationDetail> {
  const cacheKey = `@pokedex/generation_${id}`;

  const cached = await cacheGet<GenerationDetail>(cacheKey);
  if (cached) return cached;

  const data = await fetchJson<GenerationDetail>(`${BASE}/generation/${id}`);
  await cacheSet(cacheKey, data);
  return data;
}

// ─── Pokémon by generation (paginated from species list) ──────────────────────

export async function fetchPokemonByGeneration(
  generationId: number,
  page: number,
  prefetchedDetail?: GenerationDetail
): Promise<{ items: PokemonListItem[]; total: number }> {
  const cacheKey = `@pokedex/gen_pokemon_${generationId}_page_${page}`;
  const totalKey = `@pokedex/gen_pokemon_${generationId}_total`;

  const cachedItems = await cacheGet<PokemonListItem[]>(cacheKey);
  const cachedTotal = await cacheGet<number>(totalKey);
  if (cachedItems && cachedTotal !== null) {
    return { items: cachedItems, total: cachedTotal };
  }

  const gen = prefetchedDetail ?? await fetchGenerationDetail(generationId);
  const total = gen.pokemon_species.length;

  // Species are not returned in national dex order — sort by id extracted from url
  const sorted = [...gen.pokemon_species].sort(
    (a, b) => idFromUrl(a.url) - idFromUrl(b.url)
  );

  const offset = (page - 1) * PAGE_SIZE;
  const pageSpecies = sorted.slice(offset, offset + PAGE_SIZE);

  const items: PokemonListItem[] = pageSpecies.map((s) => {
    const id = idFromUrl(s.url);
    return { id, name: s.name, sprite: spriteUrl(id) };
  });

  await cacheSet(cacheKey, items);
  await cacheSet(totalKey, total);
  return { items, total };
}

// ─── Search by name ───────────────────────────────────────────────────────────

export async function searchPokemonByName(query: string): Promise<PokemonListItem[]> {
  if (!query.trim()) return [];
  try {
    const detail = await fetchPokemonDetail(
      // PokéAPI accepts name as id
      query.toLowerCase() as unknown as number
    );
    const sprite =
      detail.sprites.front_default ??
      detail.sprites.other["official-artwork"].front_default ??
      spriteUrl(detail.id);
    return [{ id: detail.id, name: detail.name, sprite }];
  } catch {
    return [];
  }
}

// ─── Search by type ───────────────────────────────────────────────────────────

export async function fetchPokemonByType(typeName: string): Promise<PokemonListItem[]> {
  const cacheKey = `@pokedex/type_${typeName.toLowerCase()}`;

  const cached = await cacheGet<PokemonListItem[]>(cacheKey);
  if (cached) return cached.map((item) => ({ ...item, sprite: spriteUrl(item.id) }));

  const data = await fetchJson<TypeDetail>(
    `${BASE}/type/${typeName.toLowerCase()}`
  );

  const items: PokemonListItem[] = data.pokemon
    .map((entry) => {
      const id = idFromUrl(entry.pokemon.url);
      return { id, name: entry.pokemon.name, sprite: spriteUrl(id) };
    })
    .sort((a, b) => a.id - b.id);

  await cacheSet(cacheKey, items);
  return items;
}
