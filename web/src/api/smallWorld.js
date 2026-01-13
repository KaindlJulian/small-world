const csvUrl = 'm.gz';

export async function fetchCsv() {
    const response = await fetch(csvUrl, {
        headers: { 'content-type': 'application/gzip' },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${csvUrl} (${response.status})`);
    }

    const stream = response.body;
    const decompressedResponse = new Response(
        stream.pipeThrough(new DecompressionStream('gzip')),
    );

    return await decompressedResponse.text();
}
