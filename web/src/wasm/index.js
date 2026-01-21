let wasm;

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    }
}

let WASM_VECTOR_LEN = 0;

const LevelFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_level_free(ptr >>> 0, 1));

const LinkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_link_free(ptr >>> 0, 1));

const MonsterFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_monster_free(ptr >>> 0, 1));

const SmallWorldSearcherFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_smallworldsearcher_free(ptr >>> 0, 1));

/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6}
 */
export const Attribute = Object.freeze({
    DARK: 0, "0": "DARK",
    DIVINE: 1, "1": "DIVINE",
    EARTH: 2, "2": "EARTH",
    FIRE: 3, "3": "FIRE",
    LIGHT: 4, "4": "LIGHT",
    WATER: 5, "5": "WATER",
    WIND: 6, "6": "WIND",
});

export class Level {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Level.prototype);
        obj.__wbg_ptr = ptr;
        LevelFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LevelFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_level_free(ptr, 0);
    }
    /**
     * @param {number} value
     * @returns {Level}
     */
    static new(value) {
        const ret = wasm.level_new(value);
        return Level.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    value() {
        const ret = wasm.level_value(this.__wbg_ptr);
        return ret >>> 0;
    }
}
if (Symbol.dispose) Level.prototype[Symbol.dispose] = Level.prototype.free;

export class Link {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Link.prototype);
        obj.__wbg_ptr = ptr;
        LinkFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LinkFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_link_free(ptr, 0);
    }
    /**
     * @returns {Monster}
     */
    get start() {
        const ret = wasm.link_start(this.__wbg_ptr);
        return Monster.__wrap(ret);
    }
    /**
     * @returns {Monster}
     */
    get bridge() {
        const ret = wasm.link_bridge(this.__wbg_ptr);
        return Monster.__wrap(ret);
    }
    /**
     * @returns {Monster}
     */
    get target() {
        const ret = wasm.link_target(this.__wbg_ptr);
        return Monster.__wrap(ret);
    }
}
if (Symbol.dispose) Link.prototype[Symbol.dispose] = Link.prototype.free;

export class Monster {
    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Monster.prototype);
        obj.__wbg_ptr = ptr;
        MonsterFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MonsterFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_monster_free(ptr, 0);
    }
    /**
     * The passcode of the monster
     * @returns {number}
     */
    get id() {
        const ret = wasm.monster_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number | undefined}
     */
    get atk() {
        const ret = wasm.monster_atk(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    get def() {
        const ret = wasm.monster_def(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @param {number} id
     * @param {string} name
     * @param {Attribute} attribute
     * @param {Level} level
     * @param {Type} type
     * @param {number | null} [atk]
     * @param {number | null} [def]
     */
    constructor(id, name, attribute, level, type, atk, def) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(level, Level);
        var ptr1 = level.__destroy_into_raw();
        const ret = wasm.monster_new(id, ptr0, len0, attribute, ptr1, type, isLikeNone(atk) ? 0x100000001 : (atk) >>> 0, isLikeNone(def) ? 0x100000001 : (def) >>> 0);
        this.__wbg_ptr = ret >>> 0;
        MonsterFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @returns {Type}
     */
    get type() {
        const ret = wasm.monster_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Level}
     */
    get level() {
        const ret = wasm.monster_level(this.__wbg_ptr);
        return Level.__wrap(ret);
    }
    /**
     * @returns {Attribute}
     */
    get attribute() {
        const ret = wasm.monster_attribute(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get name_wasm() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.monster_name_wasm(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) Monster.prototype[Symbol.dispose] = Monster.prototype.free;

export class SmallWorldSearcher {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SmallWorldSearcherFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_smallworldsearcher_free(ptr, 0);
    }
    /**
     * Find monsters that connect every source monster to every target monster.
     * @param {Uint32Array} source
     * @param {Uint32Array} target
     * @returns {Monster[] | undefined}
     */
    find_common_bridges(source, target) {
        const ptr0 = passArray32ToWasm0(source, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(target, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.smallworldsearcher_find_common_bridges(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        let v3;
        if (ret[0] !== 0) {
            v3 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v3;
    }
    /**
     * For every monster in the pool, find to which other monsters from the pool it can link to, excluding self-links.
     * @param {Uint32Array} pool_ids
     * @returns {Link[]}
     */
    compute_links_within(pool_ids) {
        const ptr0 = passArray32ToWasm0(pool_ids, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.smallworldsearcher_compute_links_within(this.__wbg_ptr, ptr0, len0);
        var v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v2;
    }
    /**
     * @param {Uint32Array} ids
     * @returns {Monster[] | undefined}
     */
    find_universal_bridges(ids) {
        const ptr0 = passArray32ToWasm0(ids, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.smallworldsearcher_find_universal_bridges(this.__wbg_ptr, ptr0, len0);
        let v2;
        if (ret[0] !== 0) {
            v2 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v2;
    }
    /**
     * Given two monsters m1 and m2, lookup the first property that connects them.
     * Returns a String or None if they are not connected.
     * @param {number} m1
     * @param {number} m2
     * @returns {string | undefined}
     */
    compute_connecting_property(m1, m2) {
        const ret = wasm.smallworldsearcher_compute_connecting_property(this.__wbg_ptr, m1, m2);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * @returns {Monster[]}
     */
    get_all() {
        const ret = wasm.smallworldsearcher_get_all(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @param {string} data
     */
    constructor(data) {
        const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.smallworldsearcher_from_csv(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        SmallWorldSearcherFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} id
     * @returns {Monster | undefined}
     */
    get_by_id(id) {
        const ret = wasm.smallworldsearcher_get_by_id(this.__wbg_ptr, id);
        return ret === 0 ? undefined : Monster.__wrap(ret);
    }
}
if (Symbol.dispose) SmallWorldSearcher.prototype[Symbol.dispose] = SmallWorldSearcher.prototype.free;

/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24}
 */
export const Type = Object.freeze({
    Aqua: 0, "0": "Aqua",
    Beast: 1, "1": "Beast",
    BeastWarrior: 2, "2": "BeastWarrior",
    Cyberse: 3, "3": "Cyberse",
    Dinosaur: 4, "4": "Dinosaur",
    DivineBeast: 5, "5": "DivineBeast",
    Dragon: 6, "6": "Dragon",
    Fairy: 7, "7": "Fairy",
    Fiend: 8, "8": "Fiend",
    Fish: 9, "9": "Fish",
    Insect: 10, "10": "Insect",
    Illusion: 11, "11": "Illusion",
    Machine: 12, "12": "Machine",
    Plant: 13, "13": "Plant",
    Psychic: 14, "14": "Psychic",
    Pyro: 15, "15": "Pyro",
    Reptile: 16, "16": "Reptile",
    Rock: 17, "17": "Rock",
    SeaSerpent: 18, "18": "SeaSerpent",
    Spellcaster: 19, "19": "Spellcaster",
    Thunder: 20, "20": "Thunder",
    Warrior: 21, "21": "Warrior",
    WingedBeast: 22, "22": "WingedBeast",
    Wyrm: 23, "23": "Wyrm",
    Zombie: 24, "24": "Zombie",
});

/**
 * @param {string} ydke
 * @param {boolean} ignore_extra
 * @returns {Uint32Array}
 */
export function decode_ydke(ydke, ignore_extra) {
    const ptr0 = passStringToWasm0(ydke, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.decode_ydke(ptr0, len0, ignore_extra);
    var v2 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

/**
 * Encode into a YDKE main deck string
 * @param {Uint32Array} ids
 * @returns {string}
 */
export function encode_ydke_main(ids) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passArray32ToWasm0(ids, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.encode_ydke_main(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {string} ydk
 * @param {boolean} ignore_extra
 * @returns {Uint32Array}
 */
export function parse_ydk(ydk, ignore_extra) {
    const ptr0 = passStringToWasm0(ydk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.parse_ydk(ptr0, len0, ignore_extra);
    var v2 = getArrayU32FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
    return v2;
}

const EXPECTED_RESPONSE_TYPES = new Set(['basic', 'cors', 'default']);

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && EXPECTED_RESPONSE_TYPES.has(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg___wbindgen_throw_dd24417ed36fc46e = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_link_new = function(arg0) {
        const ret = Link.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_monster_new = function(arg0) {
        const ret = Monster.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_externrefs;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
    };

    return imports;
}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('index_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
