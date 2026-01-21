/* tslint:disable */
/* eslint-disable */

export enum Attribute {
  DARK = 0,
  DIVINE = 1,
  EARTH = 2,
  FIRE = 3,
  LIGHT = 4,
  WATER = 5,
  WIND = 6,
}

export class Level {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  static new(value: number): Level;
  value(): number;
}

export class Link {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  readonly start: Monster;
  readonly bridge: Monster;
  readonly target: Monster;
}

export class Monster {
  free(): void;
  [Symbol.dispose](): void;
  constructor(id: number, name: string, attribute: Attribute, level: Level, type: Type, atk?: number | null, def?: number | null);
  /**
   * The passcode of the monster
   */
  readonly id: number;
  readonly atk: number | undefined;
  readonly def: number | undefined;
  readonly type: Type;
  readonly level: Level;
  readonly attribute: Attribute;
  readonly name_wasm: string;
}

export class SmallWorldSearcher {
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Find monsters that connect every source monster to every target monster.
   */
  find_common_bridges(source: Uint32Array, target: Uint32Array): Monster[] | undefined;
  /**
   * For every monster in the pool, find to which other monsters from the pool it can link to, excluding self-links.
   */
  compute_links_within(pool_ids: Uint32Array): Link[];
  find_universal_bridges(ids: Uint32Array): Monster[] | undefined;
  /**
   * Given two monsters m1 and m2, lookup the first property that connects them.
   * Returns a String or None if they are not connected.
   */
  compute_connecting_property(m1: number, m2: number): string | undefined;
  get_all(): Monster[];
  constructor(data: string);
  get_by_id(id: number): Monster | undefined;
}

export enum Type {
  Aqua = 0,
  Beast = 1,
  BeastWarrior = 2,
  Cyberse = 3,
  Dinosaur = 4,
  DivineBeast = 5,
  Dragon = 6,
  Fairy = 7,
  Fiend = 8,
  Fish = 9,
  Insect = 10,
  Illusion = 11,
  Machine = 12,
  Plant = 13,
  Psychic = 14,
  Pyro = 15,
  Reptile = 16,
  Rock = 17,
  SeaSerpent = 18,
  Spellcaster = 19,
  Thunder = 20,
  Warrior = 21,
  WingedBeast = 22,
  Wyrm = 23,
  Zombie = 24,
}

export function decode_ydke(ydke: string, ignore_extra: boolean): Uint32Array;

/**
 * Encode into a YDKE main deck string
 */
export function encode_ydke_main(ids: Uint32Array): string;

export function parse_ydk(ydk: string, ignore_extra: boolean): Uint32Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_link_free: (a: number, b: number) => void;
  readonly __wbg_smallworldsearcher_free: (a: number, b: number) => void;
  readonly link_bridge: (a: number) => number;
  readonly link_start: (a: number) => number;
  readonly link_target: (a: number) => number;
  readonly smallworldsearcher_compute_connecting_property: (a: number, b: number, c: number) => [number, number];
  readonly smallworldsearcher_compute_links_within: (a: number, b: number, c: number) => [number, number];
  readonly smallworldsearcher_find_common_bridges: (a: number, b: number, c: number, d: number, e: number) => [number, number];
  readonly smallworldsearcher_find_universal_bridges: (a: number, b: number, c: number) => [number, number];
  readonly smallworldsearcher_from_csv: (a: number, b: number) => number;
  readonly smallworldsearcher_get_all: (a: number) => [number, number];
  readonly smallworldsearcher_get_by_id: (a: number, b: number) => number;
  readonly decode_ydke: (a: number, b: number, c: number) => [number, number];
  readonly encode_ydke_main: (a: number, b: number) => [number, number];
  readonly parse_ydk: (a: number, b: number, c: number) => [number, number];
  readonly __wbg_level_free: (a: number, b: number) => void;
  readonly __wbg_monster_free: (a: number, b: number) => void;
  readonly level_new: (a: number) => number;
  readonly level_value: (a: number) => number;
  readonly monster_atk: (a: number) => number;
  readonly monster_attribute: (a: number) => number;
  readonly monster_def: (a: number) => number;
  readonly monster_id: (a: number) => number;
  readonly monster_level: (a: number) => number;
  readonly monster_name_wasm: (a: number) => [number, number];
  readonly monster_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => number;
  readonly monster_type: (a: number) => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __externref_drop_slice: (a: number, b: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
