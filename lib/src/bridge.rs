use crate::bitset::BitSet;
use crate::index::{BitSetIndex, MonsterIndex};
use crate::monster::Monster;
use itertools::Itertools;
use std::collections::HashSet;

/// Finds bridge monsters using bitset intersections.
///
/// For each monster, its neighborhood is represented as a bitset over the global monster index.
/// All neighborhood bitsets are intersected (`AND`), yielding exactly those monsters that appear
/// in every neighborhood.
///```
/// // monsters with >= 1 matching property
/// candidates =
///       Index[Attribute][DARK]
///     | Index[Level][4]
///     | Index[Type][Fiend]
///     | Index[ATK][1700]
///     | Index[DEF][0]
///
/// // monsters with >= 2 matching properties
/// exclude = Index[Attribute][DARK] & Index[Level][4] ... Index[ATK][1700] | Index[DEF][0] // 5*4/2 = 10 combinations
///
/// // exactly 1 matching property
/// neighborhood = candidate & ~exclude
///
/// // intersection of neighborhoods are bridges
/// bridges = neighborhood(m1) & neighborhood(m2)
/// ```
pub fn search_bridge_bitset(monsters: &[&Monster], index: &BitSetIndex) -> Option<BitSet> {
    monsters
        .iter()
        .map(|m| find_neighborhood_bitset(m, index))
        .reduce(|a, b| a.and(&b))
}

pub fn find_neighborhood_bitset(monster: &Monster, index: &BitSetIndex) -> BitSet {
    let sets = [
        index.by_attribute.get(&monster.attribute()).unwrap(),
        index.by_level.get(&monster.level()).unwrap(),
        index.by_type.get(&monster.r#type()).unwrap(),
        index.by_atk.get(&monster.atk()).unwrap(),
        index.by_def.get(&monster.def()).unwrap(),
    ];

    // >= 1 property in common
    let candidates = sets
        .iter()
        .fold(BitSet::new(index.len()), |acc: BitSet, s| acc.or(s));

    // >= 2 properties in common
    let exclude = sets
        .iter()
        .combinations(2)
        .map(|pair| pair[0].and(&pair[1]))
        .fold(BitSet::new(index.len()), |acc: BitSet, s| acc.or(&s));

    // 1 property in common
    candidates.and(&exclude.not())
}

/// Finds bridge monsters by computing the intersection of neighborhood sets.
///
/// Given at least two monsters, this function returns all monsters that appear
/// in the neighborhood of every input monster, using a precomputed index for
/// efficient lookup.
///
/// Neighborhoods are intersected incrementally to limit intermediate result
/// sizes. Runtime is proportional to the total size of the neighborhoods,
/// and memory usage is linear in the size of the intersection.
pub fn search_bridges<'a>(
    monsters: &[&Monster],
    index: &MonsterIndex<'a>,
) -> Option<Vec<&'a Monster>> {
    if monsters.len() < 2 {
        return None;
    }

    let bridges = monsters
        .iter()
        .map(|monster| find_neighborhood(monster, &index))
        .fold(
            find_neighborhood(monsters.first().unwrap(), &index),
            |acc, neighbourhood| {
                acc.intersection(&neighbourhood)
                    .copied()
                    .collect::<HashSet<_>>()
            },
        )
        .iter()
        .copied()
        .collect::<Vec<&'a Monster>>();

    Some(bridges)
}

fn find_neighborhood<'a>(monster: &Monster, index: &MonsterIndex<'a>) -> HashSet<&'a Monster> {
    [
        index.by_attribute.get(&monster.attribute()).unwrap(),
        index.by_level.get(&monster.level()).unwrap(),
        index.by_type.get(&monster.r#type()).unwrap(),
        index.by_atk.get(&monster.atk()).unwrap(),
        index.by_def.get(&monster.def()).unwrap(),
    ]
    .iter()
    .fold(HashSet::new(), |mut acc: HashSet<&Monster>, monsters| {
        for m in monsters.iter() {
            if [
                monster.attribute() == m.attribute(),
                monster.level() == m.level(),
                monster.r#type() == m.r#type(),
                monster.atk() == m.atk(),
                monster.def() == m.def(),
            ]
            .iter()
            .filter(|&eq| *eq)
            .count()
                == 1
            {
                // if exactly one property matches
                acc.insert(m);
            }
        }
        acc
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::util::parse_csv_file;

    #[test]
    fn test_bridge_count() {
        let monsters = parse_csv_file("testing_data.csv");
        let index = MonsterIndex::new(&monsters);
        let bs_index = BitSetIndex::new(&monsters);

        let query = [11927, 15004]
            .iter()
            .map(|&m| index.by_id[&m])
            .collect::<Vec<&Monster>>();

        assert_eq!(search_bridges(&query, &index).unwrap().len(), 21);
        assert_eq!(
            search_bridge_bitset(&query, &bs_index)
                .unwrap()
                .count_ones(),
            21
        );
    }

    #[test]
    fn test_multi_intersection() {
        let monsters = parse_csv_file("testing_data.csv");
        let index = MonsterIndex::new(&monsters);
        let bs_index = BitSetIndex::new(&monsters);

        let query = [6032, 4446, 11642, 13863, 14618, 14813, 5421]
            .iter()
            .map(|&m| index.by_id[&m])
            .collect::<Vec<&Monster>>();

        assert_eq!(search_bridges(&query, &index).unwrap().len(), 3);
        assert_eq!(
            search_bridge_bitset(&query, &bs_index)
                .unwrap()
                .count_ones(),
            3
        );
    }

    #[test]
    fn test_unknown_atk_stat() {
        let monsters = parse_csv_file("testing_data.csv");
        let index = MonsterIndex::new(&monsters);

        let result = search_bridges(
            &[
                index.by_id.get(&19857_u32).unwrap(),
                index.by_id.get(&5834_u32).unwrap(),
            ],
            &index,
        );
        dbg!(&result.unwrap());
    }
}
