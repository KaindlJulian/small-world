import { parse_csv } from '../wasm';

const csvUrl = 'monsters.csv';

export async function fetchCsv() {
    const response = await fetch(csvUrl, {
        headers: { 'content-type': 'text/csv;charset=UTF-8' },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch csv (${response.status})`);
    }

    //return parse_csv(await response.text());
    return response.text();
}
