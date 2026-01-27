const csvUrl = 'm.gz';

export async function fetchCsv() {
    const response = await fetch(csvUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${csvUrl} (${response.status})`);
    }

    // vite automatically decompresses in dev mode
    if (import.meta.env.DEV) {
        return await response.text();
    }

    const ds = new DecompressionStream('gzip');
    const decompressedStream = response.body.pipeThrough(ds);
    return await new Response(decompressedStream).text();
}
