use crate::bridge::search_bridge_bitset;
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
    #[wasm_bindgen(constructor)]
    pub fn new(monsters: Vec<Monster>) -> Self {
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

    fn find_bridges(&self, monsters: &[&Monster]) -> Option<Vec<&Monster>> {
        let bridges = search_bridge_bitset(&monsters, &self.index)?;
        let mut monsters = vec![];

        for i in 0..bridges.len() {
            if bridges.get(i) {
                monsters.push(&self.monsters[i]);
            }
        }

        if monsters.is_empty() {
            None
        } else {
            Some(monsters)
        }
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
}
