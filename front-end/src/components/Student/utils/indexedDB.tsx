export const saveFileOffline = async (file: File, meta: any) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("acadtrack-db", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("documents")) {
        db.createObjectStore("documents", { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction("documents", "readwrite");
      const store = tx.objectStore("documents");

      store.put({
        id: crypto.randomUUID(),
        file,
        meta,
        status: "pending",
        createdAt: Date.now(),
      });

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    };
    request.onerror = () => reject(request.error);
  });
};