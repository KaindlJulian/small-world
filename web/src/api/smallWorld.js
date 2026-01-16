const csvUrl = 'm.gz';

export async function fetchCsv() {
    const response = await fetch(csvUrl, {
        headers: {
            Accept: 'application/gzip, text/csv',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${csvUrl} (${response.status})`);
    }

    return await response.text();
}
