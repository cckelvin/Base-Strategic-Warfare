// Map tile caching utility using browser CacheStorage API and IndexedDB metadata
// Ensures satellite tiles and map state are cached to avoid reloading every time.

const TILE_CACHE_NAME = 'base-warfare-map-tiles-v1';

export async function getCachedTileBlobUrl(tileUrl: string): Promise<string | null> {
  if (!('caches' in window)) return null;

  try {
    const cache = await caches.open(TILE_CACHE_NAME);
    const cachedResponse = await cache.match(tileUrl);

    if (cachedResponse) {
      const blob = await cachedResponse.blob();
      return URL.createObjectURL(blob);
    }

    // Fetch and cache tile in background
    fetch(tileUrl, { mode: 'cors' })
      .then(async (response) => {
        if (response.ok) {
          const clone = response.clone();
          await cache.put(tileUrl, clone);
        }
      })
      .catch(() => {
        // Silently handle offline/fetch issue
      });
  } catch (err) {
    console.debug('Tile cache lookup failure:', err);
  }

  return null;
}
