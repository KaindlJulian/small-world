use std::fmt;
use std::hash::{Hash, Hasher};
use std::num::ParseIntError;
use std::str::FromStr;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(Debug, Clone, Eq, PartialEq)]
pub struct Monster {
    id: u32, // the passcode
    name: String,
    attribute: Attribute,
    level: u32,
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
    pub fn new(
        id: u32,
        name: &str,
        attribute: Attribute,
        level: u32,
        r#type: Type,
        atk: Option<u32>,
        def: Option<u32>,
    ) -> Monster {
        Monster {
            id,
            name: name.to_string(),
            attribute,
            level,
            r#type,
            atk,
            def,
        }
    }

    pub fn name(&self) -> &str {
        &self.name
    }

    pub fn attribute(&self) -> Attribute {
        self.attribute
    }

    pub fn r#type(&self) -> Type {
        self.r#type
    }
}

#[wasm_bindgen]
impl Monster {
    #[wasm_bindgen(getter)]
    pub fn id(&self) -> u32 {
        self.id
    }

    #[wasm_bindgen(getter)]
    pub fn level(&self) -> u32 {
        self.level
    }

    #[wasm_bindgen(getter)]
    pub fn atk(&self) -> Option<u32> {
        self.atk
    }

    #[wasm_bindgen(getter)]
    pub fn def(&self) -> Option<u32> {
        self.def
    }

    #[wasm_bindgen(getter)]
    pub fn name_js(&self) -> String {
        self.name.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn attribute_js(&self) -> String {
        self.attribute.to_string()
    }

    #[wasm_bindgen(getter)]
    pub fn type_js(&self) -> String {
        self.r#type.to_string()
    }
}

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

impl fmt::Display for Attribute {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let s = match self {
            Attribute::DARK => "DARK",
            Attribute::DIVINE => "DIVINE",
            Attribute::EARTH => "EARTH",
            Attribute::FIRE => "FIRE",
            Attribute::LIGHT => "LIGHT",
            Attribute::WATER => "WATER",
            Attribute::WIND => "WIND",
        };
        write!(f, "{}", s)
    }
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

impl fmt::Display for Type {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let s = match self {
            Type::Aqua => "Aqua",
            Type::Beast => "Beast",
            Type::BeastWarrior => "Beast-Warrior",
            Type::Cyberse => "Cyberse",
            Type::Dinosaur => "Dinosaur",
            Type::DivineBeast => "Divine-Beast",
            Type::Dragon => "Dragon",
            Type::Fairy => "Fairy",
            Type::Fiend => "Fiend",
            Type::Fish => "Fish",
            Type::Insect => "Insect",
            Type::Illusion => "Illusion",
            Type::Machine => "Machine",
            Type::Plant => "Plant",
            Type::Psychic => "Psychic",
            Type::Pyro => "Pyro",
            Type::Reptile => "Reptile",
            Type::Rock => "Rock",
            Type::SeaSerpent => "Sea Serpent",
            Type::Spellcaster => "Spellcaster",
            Type::Thunder => "Thunder",
            Type::Warrior => "Warrior",
            Type::WingedBeast => "Winged Beast",
            Type::Wyrm => "Wyrm",
            Type::Zombie => "Zombie",
        };
        write!(f, "{}", s)
    }
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
