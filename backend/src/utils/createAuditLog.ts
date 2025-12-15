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
    const log = await prisma.auditLog.create({
      data: {
        actorId,
        action,
        entity,
        entityId,
        payload,
      },
    });

    console.info("Audit log created:", JSON.stringify(log));
    return log;
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}
