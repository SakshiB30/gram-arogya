import { useEffect, useState } from "react";
import db from "./db";

const useSyncQueue = () => {
  const [operations, setOperations] = useState([]);

  const loadOperations = async () => {
    try {
      const data = await db.syncQueue
        .orderBy("createdAt")
        .reverse()
        .toArray();

      setOperations(data);
    } catch (error) {
      console.error("Failed to load sync queue:", error);
    }
  };

  useEffect(() => {
    loadOperations();

    const interval = setInterval(loadOperations, 1000);

    return () => clearInterval(interval);
  }, []);

  return operations;
};

export default useSyncQueue;