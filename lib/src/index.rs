use crate::bitset::BitSet;
use crate::monster::{Attribute, Level, Monster, Type};
use std::collections::{HashMap, HashSet};

/// A bitset based index
pub struct BitSetIndex {
    len: usize,
    pub by_attribute: HashMap<Attribute, BitSet>,
    pub by_level: HashMap<Level, BitSet>,
    pub by_type: HashMap<Type, BitSet>,
    pub by_atk: HashMap<Option<u32>, BitSet>,
    pub by_def: HashMap<Option<u32>, BitSet>,
}

impl BitSetIndex {
    pub fn new(monsters: &Vec<Monster>) -> BitSetIndex {
        let len = monsters.len();
        let mut by_attribute: HashMap<Attribute, BitSet> = HashMap::new();
        let mut by_level: HashMap<Level, BitSet> = HashMap::new();
        let mut by_type: HashMap<Type, BitSet> = HashMap::new();
        let mut by_atk: HashMap<Option<u32>, BitSet> = HashMap::new();
        let mut by_def: HashMap<Option<u32>, BitSet> = HashMap::new();

        for (i, m) in monsters.iter().enumerate() {
            by_attribute
                .entry(m.attribute())
                .or_insert_with(|| BitSet::new(len))
                .set(i);
            by_level
                .entry(m.level())
                .or_insert_with(|| BitSet::new(len))
                .set(i);
            by_type
                .entry(m.r#type())
                .or_insert_with(|| BitSet::new(len))
                .set(i);
            by_atk
                .entry(m.atk())
                .or_insert_with(|| BitSet::new(len))
                .set(i);
            by_def
                .entry(m.def())
                .or_insert_with(|| BitSet::new(len))
                .set(i);
        }

        BitSetIndex {
            len,
            by_attribute,
            by_level,
            by_type,
            by_atk,
            by_def,
        }
    }

    pub fn len(&self) -> usize {
        self.len
    }
}

/// A simple inverted index structure providing multiple lookups for monsters.
pub struct MonsterIndex<'a> {
    pub by_id: HashMap<u32, &'a Monster>,
    pub by_attribute: HashMap<Attribute, HashSet<&'a Monster>>,
    pub by_level: HashMap<Level, HashSet<&'a Monster>>,
    pub by_type: HashMap<Type, HashSet<&'a Monster>>,
    pub by_atk: HashMap<Option<u32>, HashSet<&'a Monster>>,
    pub by_def: HashMap<Option<u32>, HashSet<&'a Monster>>,
}

impl<'a> MonsterIndex<'a> {
    pub fn new(monsters: &'a Vec<Monster>) -> MonsterIndex<'a> {
        let mut by_id: HashMap<u32, &Monster> = HashMap::new();
        let mut by_attribute: HashMap<Attribute, HashSet<&Monster>> = HashMap::new();
        let mut by_level: HashMap<Level, HashSet<&Monster>> = HashMap::new();
        let mut by_type: HashMap<Type, HashSet<&Monster>> = HashMap::new();
        let mut by_atk: HashMap<Option<u32>, HashSet<&Monster>> = HashMap::new();
        let mut by_def: HashMap<Option<u32>, HashSet<&Monster>> = HashMap::new();

        for m in monsters {
            by_id.entry(m.id()).insert_entry(m);
            by_attribute
                .entry(m.attribute())
                .or_insert_with(HashSet::new)
                .insert(m);
            by_level
                .entry(m.level())
                .or_insert_with(HashSet::new)
                .insert(m);
            by_type
                .entry(m.r#type())
                .or_insert_with(HashSet::new)
                .insert(m);
            by_atk.entry(m.atk()).or_insert_with(HashSet::new).insert(m);
            by_def.entry(m.def()).or_insert_with(HashSet::new).insert(m);
        }

        MonsterIndex {
            by_id,
            by_attribute,
            by_level,
            by_type,
            by_atk,
            by_def,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::util::parse_csv_file;
    use std::str::FromStr;

    #[test]
    fn test_example() {
        let monsters = parse_csv_file("testing_data.csv");
        let index = BitSetIndex::new(&monsters);
        assert_eq!(
            index
                .by_attribute
                .get(&Attribute::WATER)
                .unwrap()
                .count_ones(),
            4
        );
        assert_eq!(
            index
                .by_level
                .get(&Level::from_str("4").unwrap())
                .unwrap()
                .count_ones(),
            6
        );
        assert_eq!(index.by_type.get(&Type::Fish).unwrap().count_ones(), 4);
        assert_eq!(
            index.by_atk.get(&Option::<u32>::None).unwrap().count_ones(),
            2
        );
        assert_eq!(
            index.by_def.get(&Option::<u32>::None).unwrap().count_ones(),
            2
        );
    }

    #[test]
    fn test_fixed() {
        let monsters = parse_csv_file("testing_data.csv");
        let index = BitSetIndex::new(&monsters);
        assert_eq!(index.by_attribute.len(), 7);
        assert_eq!(index.by_level.len(), 9);
        assert_eq!(index.by_type.len(), 10);
    }

    #[test]
    fn test_min_grouping() {
        let monsters = parse_csv_file("testing_data.csv");
        let index = BitSetIndex::new(&monsters);
        assert_ne!(index.by_attribute.len(), monsters.len());
        assert_ne!(index.by_level.len(), monsters.len());
        assert_ne!(index.by_type.len(), monsters.len());
        assert_ne!(index.by_atk.len(), monsters.len());
        assert_ne!(index.by_def.len(), monsters.len());
    }
}
