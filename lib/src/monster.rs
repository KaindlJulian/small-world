use std::hash::{Hash, Hasher};
use std::num::ParseIntError;
use std::str::FromStr;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Eq, PartialEq)]
pub struct Monster {
    id: u32,
    passcode: u32,
    name: String,
    attribute: Attribute,
    level: Level,
    r#type: Type,
    atk: Option<u32>,
    def: Option<u32>,
}

impl Hash for Monster {
    fn hash<H: Hasher>(&self, state: &mut H) {
        state.write_u32(self.id);
    }
}

impl Monster {
    pub fn name(&self) -> &str {
        &self.name
    }
}

#[wasm_bindgen]
impl Monster {
    #[wasm_bindgen(constructor)]
    pub fn new(
        id: u32,
        passcode: u32,
        name: &str,
        attribute: Attribute,
        level: Level,
        r#type: Type,
        atk: Option<u32>,
        def: Option<u32>,
    ) -> Monster {
        Monster {
            id,
            passcode,
            name: name.to_string(),
            attribute,
            level,
            r#type,
            atk,
            def,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn id(&self) -> u32 {
        self.id
    }

    #[wasm_bindgen(getter)]
    pub fn passcode(&self) -> u32 {
        self.passcode
    }

    #[wasm_bindgen(getter)]
    pub fn name_wasm(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn attribute(&self) -> Attribute {
        self.attribute
    }

    #[wasm_bindgen(getter)]
    pub fn level(&self) -> Level {
        self.level
    }

    #[wasm_bindgen(getter)]
    pub fn r#type(&self) -> Type {
        self.r#type
    }

    #[wasm_bindgen(getter)]
    pub fn atk(&self) -> Option<u32> {
        self.atk
    }

    #[wasm_bindgen(getter)]
    pub fn def(&self) -> Option<u32> {
        self.def
    }
}

#[wasm_bindgen]
#[derive(Debug, Copy, Clone, Eq, PartialEq, Hash)]
pub enum Attribute {
    DARK,
    DIVINE,
    EARTH,
    FIRE,
    LIGHT,
    WATER,
    WIND,
}

impl FromStr for Attribute {
    type Err = ();

    fn from_str(string: &str) -> Result<Attribute, Self::Err> {
        Ok(match string {
            "DARK" => Attribute::DARK,
            "DIVINE" => Attribute::DIVINE,
            "EARTH" => Attribute::EARTH,
            "FIRE" => Attribute::FIRE,
            "LIGHT" => Attribute::LIGHT,
            "WATER" => Attribute::WATER,
            "WIND" => Attribute::WIND,
            _ => return Err(()),
        })
    }
}

#[wasm_bindgen]
#[derive(Debug, Copy, Clone, Eq, PartialEq, Hash)]
pub enum Type {
    Aqua,
    Beast,
    BeastWarrior,
    Cyberse,
    Dinosaur,
    DivineBeast,
    Dragon,
    Fairy,
    Fiend,
    Fish,
    Insect,
    Illusion,
    Machine,
    Plant,
    Psychic,
    Pyro,
    Reptile,
    Rock,
    SeaSerpent,
    Spellcaster,
    Thunder,
    Warrior,
    WingedBeast,
    Wyrm,
    Zombie,
}

impl FromStr for Type {
    type Err = ();

    fn from_str(string: &str) -> Result<Self, Self::Err> {
        Ok(match string {
            "Aqua" => Type::Aqua,
            "Beast" => Type::Beast,
            "Beast-Warrior" => Type::BeastWarrior,
            "Cyberse" => Type::Cyberse,
            "Dinosaur" => Type::Dinosaur,
            "Divine-Beast" => Type::DivineBeast,
            "Dragon" => Type::Dragon,
            "Fairy" => Type::Fairy,
            "Fiend" => Type::Fiend,
            "Fish" => Type::Fish,
            "Insect" => Type::Insect,
            "Illusion" => Type::Illusion,
            "Machine" => Type::Machine,
            "Plant" => Type::Plant,
            "Psychic" => Type::Psychic,
            "Pyro" => Type::Pyro,
            "Reptile" => Type::Reptile,
            "Rock" => Type::Rock,
            "Sea Serpent" => Type::SeaSerpent,
            "Spellcaster" => Type::Spellcaster,
            "Thunder" => Type::Thunder,
            "Warrior" => Type::Warrior,
            "Winged Beast" => Type::WingedBeast,
            "Wyrm" => Type::Wyrm,
            "Zombie" => Type::Zombie,
            _ => return Err(()),
        })
    }
}

#[wasm_bindgen]
#[derive(Debug, Copy, Clone, Eq, PartialEq, Hash)]
pub struct Level(u32);

impl FromStr for Level {
    type Err = ParseIntError;

    fn from_str(string: &str) -> Result<Level, Self::Err> {
        let a: u32 = string.parse()?;
        Ok(Level(a))
    }
}

#[wasm_bindgen]
impl Level {
    pub fn new(value: u32) -> Level {
        Level(value)
    }
    pub fn value(&self) -> u32 {
        self.0
    }
}
