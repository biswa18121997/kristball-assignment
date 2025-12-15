import prisma from "../utils/prisma.js";
export async function createAuditLog({ actorId, action, entity, entityId, payload = {}, }) {
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
    }
    catch (error) {
        console.error("Audit log failed:", error);
    }
}
//# sourceMappingURL=createAuditLog.js.map