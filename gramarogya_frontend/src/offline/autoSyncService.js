import { syncPendingOperations } from "./syncService";

import {
  recoverAllStuckSyncOperations,
} from "./syncQueueService";

import { fetchVisits } from "../redux/slices/visitSlice";
import { fetchHealthRecords } from "../redux/slices/healthRecordSlice";

let isSyncing = false;

export const startAutoSync = (dispatch) => {

  /**
   * Run synchronization.
   *
   * Before starting a new sync, recover any operations
   * that were left in SYNCING state because the app,
   * browser, or network was interrupted.
   */
  const runSync = async () => {
    if (isSyncing) {
      return;
    }

    /**
     * Only synchronize when internet is available.
     */
    if (!navigator.onLine) {
      console.log(
        "Device is offline. Sync skipped."
      );

      return;
    }

    try {
      isSyncing = true;

      /**
       * Recover operations that were previously
       * stuck in SYNCING state.
       */
      const recoveredCount =
        await recoverAllStuckSyncOperations();

      if (recoveredCount > 0) {
        console.log(
          `Recovered ${recoveredCount} stuck sync operation(s).`
        );
      }

      console.log(
        "Starting automatic sync..."
      );

      const result =
        await syncPendingOperations();

      console.log(
        "Automatic sync result:",
        result
      );

      /**
       * Refresh Redux data after successful synchronization.
       *
       * This keeps the online UI consistent with the
       * newly synchronized backend data.
       */
      if (
        result.success &&
        result.synced > 0
      ) {
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

  /**
   * Internet restored.
   */
  const handleOnline = async () => {
    console.log(
      "Internet restored."
    );

    await runSync();
  };

  window.addEventListener(
    "online",
    handleOnline
  );

  /**
   * Also attempt recovery when the application
   * starts while the device is already online.
   *
   * A small delay allows Redux/app initialization
   * to complete before synchronization begins.
   */
  if (navigator.onLine) {
    setTimeout(() => {
      runSync();
    }, 1000);
  }

  /**
   * Cleanup function.
   */
  return () => {
    window.removeEventListener(
      "online",
      handleOnline
    );
  };
};