import { syncPendingOperations } from "./syncService";
import { fetchVisits } from "../redux/slices/visitSlice";
import { fetchHealthRecords } from "../redux/slices/healthRecordSlice";

let isSyncing = false;

export const startAutoSync = (dispatch) => {
  const handleOnline = async () => {
    if (isSyncing) {
      return;
    }

    try {
      isSyncing = true;

      console.log(
        "Internet restored. Starting automatic sync..."
      );

      const result =
        await syncPendingOperations();


      console.log(
        "Automatic sync result:",
        result
      );

      // Refresh Redux visits after successful sync
      if (result.success && result.synced > 0) {
  dispatch(fetchVisits());
  dispatch(fetchHealthRecords());
}

    } catch (error) {
      console.error(
        "Automatic sync failed:",
        error
      );
    } finally {
      isSyncing = false;
    }
  };

  window.addEventListener(
    "online",
    handleOnline
  );

  return () => {
    window.removeEventListener(
      "online",
      handleOnline
    );
  };
};