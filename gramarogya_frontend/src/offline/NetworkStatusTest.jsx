import useNetworkStatus from "./useNetworkStatus";

import {
  saveVisitsOffline,
  getOfflineVisits,
} from "./visitOfflineService";

const NetworkStatusTest = () => {
  const online = useNetworkStatus();

  const testDatabase = async () => {
    try {
      const testVisit = {
        id: "TEST_VISIT_001",
        beneficiaryId: "TEST001",
        scheduledDate: "2026-09-13",
        status: "Pending",
        visitType: "Home Visit",
        notes: "Offline test visit",
      };

      // Save test visit to IndexedDB
      await saveVisitsOffline([testVisit]);

      // Read visits from IndexedDB
      const visits = await getOfflineVisits();

      console.log("Offline visits:", visits);
    } catch (error) {
      console.error("Offline visit test failed:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontSize: "20px" }}>
      <div>
        {online ? "🟢 Online" : "🟠 Offline Mode"}
      </div>

      <button
        onClick={testDatabase}
        style={{
          marginTop: "10px",
          padding: "8px 12px",
          cursor: "pointer",
        }}
      >
        Test Offline Visit Storage
      </button>
    </div>
  );
};

export default NetworkStatusTest;