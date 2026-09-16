import { useState } from "react";

import { syncPendingOperations } from "./syncService";

import {
  getAllSyncOperations,
  getFailedSyncOperations,
  retrySyncOperation,
} from "./syncQueueService";

const SyncTest = () => {
  const [message, setMessage] = useState("");
  const [operations, setOperations] = useState([]);

  const loadQueue = async () => {
  try {
    const data = await getAllSyncOperations();

    console.log("Sync Queue:", data);

    console.log(
      "TARGET VISIT OPERATIONS:",
      data.filter(
        (op) =>
          op.entityType === "VISIT" &&
          op.localId ===
            "LOCAL_VISIT_a6698f38-6ab1-4309-a512-8063bf2764ee"
      )
    );

    setOperations(data);
  } catch (error) {
    console.error(
      "Failed to load sync queue:",
      error
    );
  }
};

  const startSync = async () => {
    try {
      setMessage("Syncing pending operations...");

      const result = await syncPendingOperations();

      console.log("Sync Result:", result);

      setMessage(
        `Sync completed. Synced: ${result.synced}, Failed: ${result.failed}`
      );

      await loadQueue();
    } catch (error) {
      console.error("Sync failed:", error);

      setMessage("Sync failed.");
    }
  };

  const retryFailedOperations = async () => {
    console.log("RETRY BUTTON CLICKED");

    try {
      const failedOperations = await getFailedSyncOperations();

      console.log("Failed Operations:", failedOperations);

      for (const operation of failedOperations) {
        await retrySyncOperation(operation.id);
      }

      await loadQueue();

      setMessage(
        `${failedOperations.length} failed operation(s) moved to PENDING.`
      );
    } catch (error) {
      console.error("Retry failed:", error);

      setMessage("Retry failed.");
    }
  };

  return (
    <div style={{ padding: "20px", fontSize: "16px" }}>
      <h2>Sync Engine Test</h2>

      <button
        onClick={loadQueue}
        style={{
          marginRight: "10px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        Load Queue
      </button>

      <button
        onClick={startSync}
        style={{
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        Start Sync
      </button>

      <button
        onClick={retryFailedOperations}
        style={{
          marginLeft: "10px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        Retry Failed
      </button>

      {message && (
        <p style={{ marginTop: "15px" }}>
          {message}
        </p>
      )}

      <h3>Sync Queue</h3>

      {operations.length === 0 ? (
        <p>No operations found.</p>
      ) : (
        <pre>{JSON.stringify(operations, null, 2)}</pre>
      )}
    </div>
  );
};

export default SyncTest;