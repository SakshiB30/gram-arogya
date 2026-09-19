import { useEffect, useState } from "react";
import db from "./db";

const useSyncQueue = (ashaId) => {
  const [operations, setOperations] = useState([]);

  const loadOperations = async () => {
    try {
      const data = await db.syncQueue
        .orderBy("createdAt")
        .reverse()
        .toArray();

      if (!ashaId) {
        setOperations([]);
        return;
      }

      /*
       * Only show operations belonging to
       * the currently logged-in ASHA.
       */
      const filteredOperations = data.filter(
        (operation) =>
          operation.ashaId === ashaId
      );

      setOperations(filteredOperations);
    } catch (error) {
      console.error(
        "Failed to load sync queue:",
        error
      );

      setOperations([]);
    }
  };

  useEffect(() => {
    loadOperations();

    const interval = setInterval(
      loadOperations,
      1000
    );

    return () => {
      clearInterval(interval);
    };
  }, [ashaId]);

  return operations;
};

export default useSyncQueue;