import prisma from "../utils/prisma.js";

interface AuditParams {
  actorId?: string;
  action: string;
  entity?: string;
  entityId?: string;
  payload?: any;
}

export async function createAuditLog({
  actorId,
  action,
  entity,
  entityId,
  payload = {},
}: AuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        entity,
        entityId,
        payload,
      },
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}
