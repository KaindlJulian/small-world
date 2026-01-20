use crate::bitset::BitSet;
use crate::bridge::{find_neighborhood_bitset, search_bridge_bitset};
use crate::index::BitSetIndex;
use crate::monster::Monster;
use core::panic;
use std::collections::HashMap;
use std::vec;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct SmallWorldSearcher {
    monsters: Vec<Monster>,
    id2index: HashMap<u32, usize>,
    index: BitSetIndex,
}

#[wasm_bindgen]
impl SmallWorldSearcher {
    fn new(monsters: Vec<Monster>) -> Self {
        SmallWorldSearcher {
            index: BitSetIndex::new(&monsters),
            id2index: monsters
                .iter()
                .enumerate()
                .map(|(i, m)| (m.id(), i))
                .collect::<HashMap<u32, usize>>(),
            monsters,
        }
    }

    #[wasm_bindgen(constructor)]
    pub fn from_csv(data: &str) -> Self {
        let monsters = crate::util::parse_csv(data);
        SmallWorldSearcher::new(monsters)
    }

    fn bitset_to_monsters(&self, bitset: &BitSet) -> Vec<&Monster> {
        let mut monsters = vec![];

        for i in 0..bitset.len() {
            if bitset.get(i) {
                monsters.push(&self.monsters[i]);
            }
        }

        monsters
    }

    fn ids_to_monsters(&self, ids: &[u32]) -> Vec<&Monster> {
        ids.iter()
            .filter_map(|id| self.id2index.get(id).map(|&idx| &self.monsters[idx]))
            .collect()
    }

    // Find monsters that acts as bridge between all given monster.
    pub fn find_universal_bridges(&self, ids: &[u32]) -> Option<Vec<Monster>> {
        let monsters = self.ids_to_monsters(ids);

        let bridges = search_bridge_bitset(&monsters, &self.index)?;
        let monsters = self.bitset_to_monsters(&bridges);

        if monsters.is_empty() {
            None
        } else {
            Some(monsters.into_iter().cloned().collect())
        }
    }

    /// Find monsters that connect every source monster to every target monster.
    pub fn find_common_bridges(&self, source: &[u32], target: &[u32]) -> Option<Vec<Monster>> {
        let source_monsters = self.ids_to_monsters(source);
        let target_monsters = self.ids_to_monsters(target);

        let mut common_bridges: Option<BitSet> = None;
        for source in &source_monsters {
            for target in &target_monsters {
                let bridges = search_bridge_bitset(&[source, target], &self.index)?;
                common_bridges = match &common_bridges {
                    Some(cb) => Some(cb.and(&bridges)),
                    None => Some(bridges),
                };
            }
        }

        if let Some(cb) = common_bridges {
            let monsters = self.bitset_to_monsters(&cb);
            if monsters.is_empty() {
                None
            } else {
                Some(monsters.into_iter().cloned().collect())
            }
        } else {
            None
        }
    }

    pub fn get_by_id(&self, id: u32) -> Option<Monster> {
        self.id2index
            .get(&id)
            .map(|idx| self.monsters[*idx].clone())
    }

    pub fn get_all(&self) -> Vec<Monster> {
        self.monsters.iter().cloned().collect()
    }

    /// For every monster in the pool, find to which other monsters from the pool it can link to, excluding self-links.
    pub fn compute_links_within(&self, pool_ids: &[u32]) -> Vec<Link> {
        let mut pool_mask = BitSet::new(self.monsters.len());
        let mut pool_indices = vec![];

        for id in pool_ids {
            if let Some(idx) = self.id2index.get(id) {
                pool_indices.push(*idx);
                pool_mask.set(*idx);
            }
        }

        let mut result = vec![];

        for start_idx in pool_indices.iter() {
            let start_neigborhood =
                find_neighborhood_bitset(&self.monsters[*start_idx], &self.index);

            // intersect N(start) with pool -> gives us the 1st step of small world
            let step_1 = start_neigborhood.and(&pool_mask);

            for bridge_idx in step_1.ones() {
                let bridge_neighborhood =
                // intersect N(bridge) with pool -> gives us the 2nd step of small world
                    find_neighborhood_bitset(&self.monsters[bridge_idx], &self.index);
                let step_2 = bridge_neighborhood.and(&pool_mask);
                // every monster in step_2 is reachable from start via bridge
                for target_idx in step_2.ones() {
                    // ignore self-links
                    if target_idx == *start_idx {
                        continue;
                    }
                    result.push(Link {
                        start: self.monsters[*start_idx].clone(),
                        bridge: self.monsters[bridge_idx].clone(),
                        target: self.monsters[target_idx].clone(),
                    });
                }
            }
        }

        result
    }

    /// Given two monsters m1 and m2, lookup the first property that connects them.
    /// Returns a String or None if they are not connected.
    pub fn compute_connecting_property(&self, m1: u32, m2: u32) -> Option<String> {
        let index_1 = self.id2index.get(&m1).unwrap();
        let index_2 = self.id2index.get(&m2).unwrap();

        let monster_1 = &self.monsters[*index_1];
        let monster_2 = &self.monsters[*index_2];

        let sets_1 = [
            self.index.by_attribute.get(&monster_1.attribute()).unwrap(),
            self.index.by_level.get(&monster_1.level()).unwrap(),
            self.index.by_type.get(&monster_1.r#type()).unwrap(),
            self.index.by_atk.get(&monster_1.atk()).unwrap(),
            self.index.by_def.get(&monster_1.def()).unwrap(),
        ];
        let sets_2 = [
            self.index.by_attribute.get(&monster_2.attribute()).unwrap(),
            self.index.by_level.get(&monster_2.level()).unwrap(),
            self.index.by_type.get(&monster_2.r#type()).unwrap(),
            self.index.by_atk.get(&monster_2.atk()).unwrap(),
            self.index.by_def.get(&monster_2.def()).unwrap(),
        ];

        for (i, (s1, s2)) in sets_1.iter().zip(sets_2.iter()).enumerate() {
            if s1.get(*index_2) && s2.get(*index_1) {
                return match i {
                    0 => Some(format!("Attribute: {:?}", monster_1.attribute())),
                    1 => Some(format!("Level: {}", monster_1.level().value())),
                    2 => Some(format!("Type: {:?}", monster_1.r#type())),
                    3 => Some(format!(
                        "ATK: {}",
                        monster_1.atk().map_or("?".into(), |v| v.to_string())
                    )),
                    4 => Some(format!(
                        "DEF: {}",
                        monster_1.def().map_or("?".into(), |v| v.to_string())
                    )),
                    _ => panic!("unreachable"),
                };
            }
        }

        None
    }
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Link {
    start: Monster,
    bridge: Monster,
    target: Monster,
}

#[wasm_bindgen]
impl Link {
    #[wasm_bindgen(getter)]
    pub fn start(&self) -> Monster {
        self.start.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn bridge(&self) -> Monster {
        self.bridge.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn target(&self) -> Monster {
        self.target.clone()
    }
}

// test
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_common_bridges() {
        let searcher = SmallWorldSearcher::from_csv(include_str!("../testing_data.csv"));
        let source = [86988864];
        let target = [23771716];

        let bridges = searcher.find_common_bridges(&source, &target).unwrap();

        assert_eq!(bridges.len(), 1);
    }

    #[test]
    fn test_compute_links_within() {
        let searcher = SmallWorldSearcher::from_csv(include_str!("../testing_data.csv"));
        let pool = [
            14558127, 89631139, 33854624, 97268402, 17947697, 54332792, 27204311, 63198739, 8240199,
        ];
        let links = searcher.compute_links_within(&pool);
        for link in links {
            println!(
                "{} --({})--> {}",
                link.start().name(),
                link.bridge().name(),
                link.target().name(),
            );
        }
    }

    #[test]
    fn test_compute_connecting_property() {
        let searcher = SmallWorldSearcher::from_csv(include_str!("../testing_data.csv"));
        let m1 = 55697723; // Surfacing Big Jaws
        let m2 = 7150545; // Buzzsaw Shark
        let property = searcher.compute_connecting_property(m1, m2);
        assert_eq!(property, Some("Attribute: WATER".into()));
    }
}
