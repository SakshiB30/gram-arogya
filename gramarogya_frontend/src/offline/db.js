import Dexie from "dexie";

const db = new Dexie("GramArogyaOfflineDB");

db.version(1).stores({
  beneficiaries: "id, ashaId",
  visits: "id, beneficiaryId, scheduledDate, status",
  healthRecords: "id, beneficiaryId, visitId",
  syncQueue: "++id, operationId, entityType, status, createdAt",
});

db.version(2).stores({
  beneficiaries: "id, ashaId",
  visits: "id, beneficiaryId, scheduledDate, status",
  healthRecords: "id, beneficiaryId, visitId",
  syncQueue: "++id, operationId, entityType, status, createdAt",
  syncMappings: "++id, [entityType+localId], entityType, localId, serverId",
});

export default db;