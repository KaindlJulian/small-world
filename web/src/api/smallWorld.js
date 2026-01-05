const csvUrl = 'monsters.csv';

export async function fetchCsv() {
    const response = await fetch(csvUrl, {
        headers: { 'content-type': 'text/csv;charset=UTF-8' },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch csv (${response.status})`);
    }

    return response.text();
}
