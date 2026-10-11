jest.mock("./cache", () => ({ cached: jest.fn() }));

import { filterPokemon, type PokemonListItem } from "./pokeapi";

const list: PokemonListItem[] = [
  { id: 4, name: "charmander", sprite: "" },
  { id: 5, name: "charmeleon", sprite: "" },
  { id: 6, name: "charizard", sprite: "" },
  { id: 25, name: "pikachu", sprite: "" },
  { id: 172, name: "pichu", sprite: "" },
];
const names = (items: PokemonListItem[]) => items.map((p) => p.name);

test("filterPokemon", () => {
  expect(names(filterPokemon(list, {}))).toHaveLength(5);
  expect(names(filterPokemon(list, { query: "  CHAR " }))).toEqual(["charmander", "charmeleon", "charizard"]);
  expect(names(filterPokemon(list, { query: "#25" }))).toEqual(["pikachu"]);
  expect(names(filterPokemon(list, { query: "25" }))).toEqual(["pikachu"]);
  expect(names(filterPokemon(list, { typeIds: new Set([4, 5, 6]) }))).toEqual(["charmander", "charmeleon", "charizard"]);
  expect(names(filterPokemon(list, { speciesIds: new Set([25]) }))).toEqual(["pikachu"]);
  expect(names(filterPokemon(list, { query: "pi", speciesIds: new Set([25, 172]), typeIds: new Set([172]) }))).toEqual([
    "pichu",
  ]);
});
