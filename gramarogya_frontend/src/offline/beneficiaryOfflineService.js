import db from "./db";

/**
 * Save ASHA's beneficiaries to IndexedDB.
 *
 * This is normally called after fetching beneficiaries
 * from the backend while online.
 */
export const saveBeneficiariesOffline = async (
  beneficiaries
) => {
  console.log(
    "BENEFICIARIES RECEIVED FOR OFFLINE:",
    beneficiaries
  );

  console.log(
    "IS ARRAY:",
    Array.isArray(beneficiaries)
  );

  if (!Array.isArray(beneficiaries)) {
    console.log(
      "NOT AN ARRAY - NOTHING SAVED"
    );
    return;
  }

  console.log(
    "FIRST BENEFICIARY:",
    beneficiaries[0]
  );

  await db.transaction(
    "rw",
    db.beneficiaries,
    async () => {
      await db.beneficiaries.clear();

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
 * Get one beneficiary by ID.
 */
export const getOfflineBeneficiaryById = async (
  id
) => {
  if (!id) {
    return null;
  }

  return await db.beneficiaries.get(id);
};

/**
 * Clear all locally stored beneficiaries.
 */
export const clearOfflineBeneficiaries = async () => {
  await db.beneficiaries.clear();
};