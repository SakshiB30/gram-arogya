import db from "./db";

/**
 * Save ASHA's beneficiaries to IndexedDB.
 *
 * This is normally called after fetching beneficiaries
 * from the backend while online.
 *
 * Important:
 * We do NOT clear the entire IndexedDB store here.
 * This prevents cached beneficiaries from other ASHA
 * contexts or previously stored records from being
 * accidentally removed.
 */
export const saveBeneficiariesOffline = async (
  beneficiaries
) => {
  console.log(
    "BENEFICIARIES RECEIVED FOR OFFLINE:",
    beneficiaries
  );

  if (!Array.isArray(beneficiaries)) {
    console.log(
      "NOT AN ARRAY - NOTHING SAVED"
    );

    return;
  }

  if (beneficiaries.length === 0) {
    console.log(
      "EMPTY BENEFICIARY RESPONSE - EXISTING CACHE PRESERVED"
    );

    return beneficiaries;
  }

  console.log(
    "FIRST BENEFICIARY:",
    beneficiaries[0]
  );

  /**
   * Update only the beneficiaries received
   * from the backend.
   *
   * Existing cached beneficiaries are preserved.
   */
  await db.transaction(
    "rw",
    db.beneficiaries,
    async () => {
      await db.beneficiaries.bulkPut(
        beneficiaries
      );
    }
  );

  const stored =
    await db.beneficiaries.toArray();

  console.log(
    "BENEFICIARIES STORED IN INDEXEDDB:",
    stored
  );

  return beneficiaries;
};

/**
 * Get all offline beneficiaries
 * assigned to a particular ASHA.
 */
export const getOfflineBeneficiaries = async (
  ashaId
) => {
  if (!ashaId) {
    return [];
  }

  return await db.beneficiaries
    .where("ashaId")
    .equals(ashaId)
    .toArray();
};

/**
 * Get one beneficiary by ID
 * only if it belongs to the requested ASHA.
 */
export const getOfflineBeneficiaryById = async (
  id,
  ashaId
) => {
  if (!id || !ashaId) {
    return null;
  }

  const beneficiary =
    await db.beneficiaries.get(id);

  if (!beneficiary) {
    return null;
  }

  /**
   * Ownership check.
   *
   * An ASHA can access only their own
   * cached beneficiaries.
   */
  if (beneficiary.ashaId !== ashaId) {
    console.warn(
      "OFFLINE BENEFICIARY ACCESS DENIED:",
      {
        beneficiaryId: id,
        requestedAshaId: ashaId,
        ownerAshaId: beneficiary.ashaId,
      }
    );

    return null;
  }

  return beneficiary;
};

/**
 * Clear all locally stored beneficiaries.
 *
 * This function is intentionally kept separate
 * from saveBeneficiariesOffline().
 */
export const clearOfflineBeneficiaries =
  async () => {
    await db.beneficiaries.clear();
  };