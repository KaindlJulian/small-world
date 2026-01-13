const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

export async function fetchCards(passcodes) {
    if (passcodes.length === 0) {
        return [];
    }

    const request = new URL(url);
    request.searchParams.set('id', passcodes.join(','));
    request.searchParams.set('misc', 'yes');

    console.log(`Fetching cards: ${request.toString()}`);

    const response = await fetch(request);

    if (!response.ok) {
        throw new Error(`Failed to fetch cards (${response.status})`);
    }

    const json = await response.json();
    return json.data;
}

// https://ygoprodeck.com/api-guide/#response-info
export function mapToCard(d) {
    return {
        id: d.misc_info[0].konami_id,
        passcode: d.id,
        name: d.name,
        attribute: d.attribute,
        level: d.level,
        properties: d.typeline,
        text: d.desc,
        atk: d.atk,
        def: d.def,
        frame: d.frameType,
    };
}
