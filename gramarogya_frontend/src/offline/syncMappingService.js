import db from "./db";

export const saveSyncMapping = async ({
  entityType,
  localId,
  serverId,
}) => {
  if (!entityType || !localId || !serverId) {
    return;
  }

  await db.syncMappings.put({
    entityType,
    localId,
    serverId,
  });
};

export const getServerIdFromLocalId = async ({
  entityType,
  localId,
}) => {
  if (!entityType || !localId) {
    return null;
  }

  const mapping = await db.syncMappings
    .where("[entityType+localId]")
    .equals([entityType, localId])
    .first();

  return mapping?.serverId || null;
};

export const getAllSyncMappings = async () => {
  return await db.syncMappings.toArray();
};