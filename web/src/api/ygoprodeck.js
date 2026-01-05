// https://ygoprodeck.com/api-guide/

const url = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

export async function fetchCards(passcodes) {
    if (passcodes.length === 0) {
        return [];
    }

    const request = new URL(url);
    request.searchParams.set('id', passcodes.join(','));
    request.searchParams.set('misc', 'yes');

    const response = await fetch(request);
    console.log('i did a fetch');

    if (!response.ok) {
        throw new Error(`Failed to fetch cards (${response.status})`);
    }

    const json = await response.json();
    return json.data;
}
