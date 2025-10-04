const cache = new Map();

export const apiCache = {
  set: (key, data, ttl = 60000) => {
    cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  },
  
  get: (key) => {
    const item = cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      cache.delete(key);
      return null;
    }
    return item.data;
  },
  
  invalidate: (key) => cache.delete(key),
  
  clear: () => cache.clear(),
  
  invalidatePattern: (pattern) => {
    const regex = new RegExp(pattern);
    for (const key of cache.keys()) {
      if (regex.test(key)) {
        cache.delete(key);
      }
    }
  }
};