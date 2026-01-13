const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

export async function fetchCards(passcodes) {
    if (passcodes.length === 0) {
        return [];
    }

    console.log(`Fetching cards: ${passcodes.join(',')}`);

    const response = await fetch(`${url}?id=${passcodes.join(',')}&misc=yes`);

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
        atk: d.atk === '-1' ? undefined : d.atk,
        def: d.def === '-1' ? undefined : d.def,
        frame: d.frameType,
    };
}
