use crate::monster::Monster;
use base64::prelude::*;
use csv::{Reader, ReaderBuilder};
use std::path::Path;
use wasm_bindgen::prelude::*;

pub fn parse_csv_file<P: AsRef<Path>>(path: P) -> Vec<Monster> {
    let mut rdr = Reader::from_path(path).expect("Failed to open CSV file");
    let mut monsters = vec![];

    for result in rdr.records() {
        let record = result.expect("Failed to read CSV record");
        let id: u32 = record[0].parse().expect("Invalid id");
        let passcode: u32 = record[7].parse().expect("Invalid passcode");
        let name = &record[1];
        let attribute = record[2].parse().expect("Invalid attribute");
        let level = record[3].parse().expect("Invalid level");
        let r#type = record[4].parse().expect("Invalid type");
        let atk = record[5]
            .parse()
            .map(|e: i32| if e == -1 { None } else { Some(e as u32) })
            .expect("Invalid atk");
        let def = record[6]
            .parse()
            .map(|e: i32| if e == -1 { None } else { Some(e as u32) })
            .expect("Invalid def");
        monsters.push(Monster::new(
            id, passcode, name, attribute, level, r#type, atk, def,
        ));
    }

    monsters
}

pub fn parse_csv(data: &str) -> Vec<Monster> {
    let mut rdr = ReaderBuilder::new().from_reader(data.as_bytes());
    let mut monsters = vec![];

    for result in rdr.records() {
        let record = result.expect("Failed to read CSV record");
        let id: u32 = record[0].parse().expect("Invalid id");
        let passcode: u32 = record[7].parse().expect("Invalid passcode");
        let name = &record[1];
        let attribute = record[2].parse().expect("Invalid attribute");
        let level = record[3].parse().expect("Invalid level");
        let r#type = record[4].parse().expect("Invalid type");
        let atk = record[5]
            .parse()
            .map(|e: i32| if e == -1 { None } else { Some(e as u32) })
            .expect("Invalid atk");
        let def = record[6]
            .parse()
            .map(|e: i32| if e == -1 { None } else { Some(e as u32) })
            .expect("Invalid def");
        monsters.push(Monster::new(
            id, passcode, name, attribute, level, r#type, atk, def,
        ));
    }

    monsters
}

#[wasm_bindgen]
pub fn parse_ydk(ydk: &str, ignore_extra: bool) -> Vec<u32> {
    let mut ids = vec![];
    let mut skip_extra = false;
    for line in ydk.lines() {
        let line = line.trim();
        if ignore_extra && line.contains("extra") {
            skip_extra = true;
        }
        if line.contains("main") || line.contains("side") {
            skip_extra = false;
        }
        if line.starts_with('#') || line.starts_with('!') || line.is_empty() || skip_extra {
            continue;
        }
        if let Ok(id) = line.parse::<u32>() {
            ids.push(id);
        }
    }
    ids
}

#[wasm_bindgen]
/// Encode into a YDKE main deck string
pub fn encode_ydke_main(ids: &[u32]) -> String {
    let cards = BASE64_STANDARD
        .encode(
            ids.iter()
                .flat_map(|id| id.to_le_bytes())
                .collect::<Vec<u8>>(),
        )
        .to_string();
    format!("ydke://{}!!!", cards)
}

#[wasm_bindgen]
pub fn decode_ydke(ydke: &str, ignore_extra: bool) -> Vec<u32> {
    let parts: Vec<_> = ydke
        .trim_start_matches("ydke://")
        .split('!')
        .take(3)
        .collect();
    let [main, extra, side] = parts.as_slice() else {
        panic!("Expected exactly 3 parts");
    };

    let selected_parts = if ignore_extra {
        vec![main, side]
    } else {
        vec![main, extra, side]
    };

    selected_parts
        .iter()
        .filter_map(|part| BASE64_STANDARD.decode(part).ok())
        .map(|bytes| {
            bytes
                .chunks(4)
                .filter_map(|chunk| {
                    if chunk.len() == 4 {
                        Some(u32::from_le_bytes([chunk[0], chunk[1], chunk[2], chunk[3]]))
                    } else {
                        None
                    }
                })
                .collect::<Vec<u32>>()
        })
        .flatten()
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_csv() {
        let _monsters = parse_csv("../m.csv");
    }

    #[test]
    fn test_ydke_decode_no_side() {
        let ydke = "ydke://R7x9AEe8fQBHvH0AMdwRATHcEQEx3BEBeA09AxNWxAMTVsQDE1bEA6OpVwWjqVcFryPeAK8j3gCvI94AOLFjBDixYwQ4sWME/omcBf6JnAWyMswFNQeDAjUHgwI1B4MCdDleA3Q5XgN0OV4DIfa7AYoMdAG1dg4BAa/JBAGvyQQBr8kEYmqzA6p4kwLpzMgF6czIBenMyAUiSJkAIkiZAA==!gZ1eA92drgDUc6AAgQqVAjXQkAM10JADNdCQA81CVwXjUkIBg/jHA8oavwGWunMBlrpzAQJcggICXIIC!!";
        let ids = decode_ydke(ydke, true);
        println!("{:?}", ids);
        assert_eq!(ids.len(), 40);
        assert_eq!(ids[0], 8240199);
    }

    //OfUdBKOpVwU1B4MCeA09A9canwGt4goCoJQEArIyzAU4sWME b69ADHcEQHBcjEFE1bEA/6JnAVHvH0ARK0EBa8j3gA=
    #[test]
    fn test_ydke_decodes_2() {
        let ydke = "ydke://OfUdBKOpVwU1B4MCeA09A9canwGt4goCoJQEArIyzAU4sWME+b69ADHcEQHBcjEFE1bEA/6JnAVHvH0ARK0EBa8j3gA=!!!";
        let ids = decode_ydke(ydke, true);
        assert_eq!(ids.len(), 17);
    }

    #[test]
    fn test_ydke_decode() {
        let ydke = "ydke://R7x9AEe8fQBHvH0AMdwRATHcEQEx3BEBeA09AxNWxAMTVsQDE1bEA6OpVwWjqVcFryPeAK8j3gCvI94AOLFjBDixYwQ4sWME/omcBf6JnAWyMswFNQeDAjUHgwI1B4MCdDleA3Q5XgN0OV4DIfa7AYoMdAG1dg4BAa/JBAGvyQQBr8kEYmqzA6p4kwLpzMgF6czIBenMyAUiSJkAIkiZAA==!gZ1eA92drgDUc6AAgQqVAjXQkAM10JADNdCQA81CVwXjUkIBg/jHA8oavwGWunMBlrpzAQJcggICXIIC!RK0EBUStBAXBcjEFwXIxBfm+vQCglAQCOfUdBK3iCgKt4goCreIKAtcanwHXGp8BYr4XBWK+FwVivhcF!";
        let ids = decode_ydke(ydke, true);
        assert_eq!(ids.len(), 55);
        assert_eq!(ids[0], 8240199);
    }

    #[test]
    fn test_ydke_encode() {
        let ids = vec![
            8240199, 8240199, 8240199, 17947697, 17947697, 17947697, 54332792, 63198739, 63198739,
            63198739, 89631139, 89631139, 14558127, 14558127, 14558127, 73642296, 73642296,
            73642296, 94145022, 94145022, 97268402, 42141493, 42141493, 42141493, 56506740,
            56506740, 56506740, 29095457, 24382602, 17725109, 80326401, 80326401, 80326401,
            62089826, 43219114, 97045737, 97045737, 97045737, 10045474, 10045474,
        ];
        let ydke = encode_ydke_main(&ids);
        assert_eq!(
            ydke,
            "ydke://R7x9AEe8fQBHvH0AMdwRATHcEQEx3BEBeA09AxNWxAMTVsQDE1bEA6OpVwWjqVcFryPeAK8j3gCvI94AOLFjBDixYwQ4sWME/omcBf6JnAWyMswFNQeDAjUHgwI1B4MCdDleA3Q5XgN0OV4DIfa7AYoMdAG1dg4BAa/JBAGvyQQBr8kEYmqzA6p4kwLpzMgF6czIBenMyAUiSJkAIkiZAA==!!!"
        );
    }

    #[test]
    fn test_ydk_no_extra() {
        let ydk = r#"#main 
8240199
8240199
8240199
17947697
17947697
17947697
54332792
63198739
63198739
63198739
89631139
89631139
14558127
14558127
14558127
73642296
73642296
73642296
94145022
94145022
97268402
42141493
42141493
42141493
56506740
56506740
56506740
29095457
24382602
17725109
80326401
80326401
80326401
62089826
43219114
97045737
97045737
97045737
10045474
10045474
#extra 
56532353
11443677
10515412
43321985
59822133
59822133
59822133
89604813
21123811
63436931
29301450
24361622
24361622
42097666
42097666
!side 
84192580
84192580
87126721
87126721
12435193
33854624
69072185
34267821
34267821
34267821
27204311
27204311
85442146
85442146
85442146
"#;
        let ids = parse_ydk(ydk, true);
        assert_eq!(ids.len(), 55);
    }

    #[test]
    fn test_ydk() {
        let ydk = r#"#main 
8240199
8240199
8240199
17947697
17947697
17947697
54332792
63198739
63198739
63198739
89631139
89631139
14558127
14558127
14558127
73642296
73642296
73642296
94145022
94145022
97268402
42141493
42141493
42141493
56506740
56506740
56506740
29095457
24382602
17725109
80326401
80326401
80326401
62089826
43219114
97045737
97045737
97045737
10045474
10045474
#extra 
56532353
11443677
10515412
43321985
59822133
59822133
59822133
89604813
21123811
63436931
29301450
24361622
24361622
42097666
42097666
!side 
84192580
84192580
87126721
87126721
12435193
33854624
69072185
34267821
34267821
34267821
27204311
27204311
85442146
85442146
85442146
"#;
        let ids = parse_ydk(ydk, false);
        assert_eq!(ids.len(), 70);
        assert_eq!(ids[0], 8240199);
        assert_eq!(ids[ids.len() - 1], 85442146);
    }
}
