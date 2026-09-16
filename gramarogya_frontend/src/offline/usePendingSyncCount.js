import { useEffect, useState } from "react";
import db from "./db";

const usePendingSyncCount = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const loadSyncStatus = async () => {
    try {
      const pending = await db.syncQueue
        .where("status")
        .equals("PENDING")
        .count();

      const syncingOperations = await db.syncQueue
        .where("status")
        .equals("SYNCING")
        .count();

      const failed = await db.syncQueue
        .where("status")
        .equals("FAILED")
        .count();

      setPendingCount(pending + failed);
      setSyncing(syncingOperations > 0);
    } catch (error) {
      console.error(
        "Failed to load sync status:",
        error
      );
    }
  };

  useEffect(() => {
    loadSyncStatus();

    const interval = setInterval(
      loadSyncStatus,
      1000
    );

    return () => clearInterval(interval);
  }, []);

  return {
    pendingCount,
    syncing,
  };
};

export default usePendingSyncCount;