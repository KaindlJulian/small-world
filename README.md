# Small World Searcher

Live Demo: https://small-world-search.vercel.app/

A web tool to help Yu-Gi-Oh! players visualize interactions and find "bridges" for the card Small World.

Built with Preact, D3.js, and a custom Rust search engine compiled to WebAssembly. A Python script syncs with [YGOPRODeck](https://ygoprodeck.com/), updates the card database, and uploads card images to a Cloudflare R2 bucket.

## What is "Small World"?

Small World allows a player to swap a monster in their hand for any specific monster in their deck. However, the two monsters must be connected through a third "bridge" monster, which must also be in the deck.

The Constraint: For the connection to be valid, each step (Hand → Bridge, Bridge → Target) must share exactly one of the following properties:

- Attribute
- Level
- Type
- ATK
- DEF

If they share zero properties, or more than one, the connection is invalid.

## Features

1. Deck View: 
    - Upload or build your decklist to generate a connectivity graph. This visualizes how effective Small World will be within your specific deck. 
    - Cards are represented as nodes, and edges indicate valid bridge possibilities.

2. Bridge Explorer:
    - Select a source monster from your hand.
    - Select a target monster from your deck.
    - The tool lists every monster in the game that can act as a bridge between them.
    - Visualizes the connection path (Nodes are cards, edges are the specific stat that connects them).

## Search Implementation

Instead of comparing card objects iteratively, this approach uses pre-built indices where every specific property value (e.g., Level: 4, Attribute: "DARK") corresponds to a `BitSet` over all cards.

```rust
// Pseudo-code:
fn neighborhood(card) -> BitSet {
    // 1. Find Candidates (Match >= 1 property)
    let candidates = Index.ATTR[card.attr] | Index.LVL[card.lvl] | Index.TYPE[card.type] ... ;
    
    // 2. Find Exclusions (Match >= 2 properties)
    // Intersection of every pair
    let exclude = (Index.ATTR[card.attr] & Index.LVL[card.lvl]) | 
                  (Index.ATTR[card.attr] & Index.TYPE[card.type]) | ... ;
    
    // 3. Calculate Neighborhood (Match exactly 1)
    // Remove anything that matched more than once
    let neighborhood = candidates & (!exclude);

    neighborhood
}

// 4. Find Bridges
// The possible bridges are the intersection of neighborhoods
let bridges = neighborhood(hand_card) & neighborhood(target_card);
```


## Credits

- Attribute Icons & Level Stars: [Falzar FZ](https://yugipedia.com/wiki/User:Falzar_FZ) on Yugipedia (CC BY-SA 3.0).
- Card Data & API: [YGOPRODeck](https://ygoprodeck.com/)
