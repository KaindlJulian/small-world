use crate::bitset::BitSet;
use crate::bridge::{find_neighborhood_bitset, search_bridge_bitset};
use crate::index::BitSetIndex;
use crate::monster::Monster;
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct SmallWorldSearcher {
    monsters: Vec<Monster>,
    id2index: HashMap<u32, usize>,
    pass2index: HashMap<u32, usize>,
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
            pass2index: monsters
                .iter()
                .enumerate()
                .map(|(i, m)| (m.passcode(), i))
                .collect::<HashMap<u32, usize>>(),
            monsters,
        }
    }

    #[wasm_bindgen(constructor)]
    pub fn from_csv(data: &str) -> Self {
        let monsters = crate::util::parse_csv(data);
        SmallWorldSearcher::new(monsters)
    }

    fn find_bridges(&self, monsters: &[&Monster]) -> Option<Vec<&Monster>> {
        let bridges = search_bridge_bitset(&monsters, &self.index)?;
        let monsters = self.bitset_to_monsters(&bridges);

        if monsters.is_empty() {
            None
        } else {
            Some(monsters)
        }
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

    pub fn find_bridges_ids(&self, ids: &[u32]) -> Option<Vec<Monster>> {
        let monsters = ids
            .iter()
            .map(|id| &self.monsters[self.id2index[id]])
            .collect::<Vec<&Monster>>();
        self.find_bridges(&monsters)
            .map(|bridges| bridges.into_iter().cloned().collect())
    }

    pub fn find_bridges_pass(&self, passcodes: &[u32]) -> Option<Vec<Monster>> {
        let monsters = passcodes
            .iter()
            .map(|pass| &self.monsters[self.pass2index[pass]])
            .collect::<Vec<&Monster>>();
        self.find_bridges(&monsters)
            .map(|bridges| bridges.into_iter().cloned().collect())
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
    fn test_compute_links_within() {
        let searcher = SmallWorldSearcher::from_csv(include_str!("../m.csv"));
        // Primite-Blue-Eyes.ydk
        let pool = [12950, 4007, 17762, 8933, 20602, 20603, 14741, 20754, 12292];
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
}
