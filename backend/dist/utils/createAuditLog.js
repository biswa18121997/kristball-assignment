import prisma from "../utils/prisma.js";
export async function createAuditLog({ actorId, action, entity, entityId, payload = {}, }) {
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
    }
    catch (error) {
        console.error("Audit log failed:", error);
    }
}
//# sourceMappingURL=createAuditLog.js.map