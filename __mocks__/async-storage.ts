const storage = new Map<string, string>();

export const getItem = async (key: string) => (storage.has(key) ? storage.get(key) ?? null : null);
export const setItem = async (key: string, value: string) => storage.set(key, value);
export const removeItem = async (key: string) => storage.delete(key);
export const clear = async () => storage.clear();

export default { getItem, setItem, removeItem, clear };
