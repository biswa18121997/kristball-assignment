import prisma from "../utils/prisma.js";
export default async function GetAuditLogs(req, res) {
    try {
        let auditLogs;
        if (req.role === "ADMIN") {
            auditLogs = await prisma.auditLog.findMany({
                orderBy: {
                    createdAt: "desc",
                },
            });
        }
        else if (req.role === "BASE_COMMANDER") {
            auditLogs = await prisma.auditLog.findMany({
                where: {
                    entityId: req.baseId,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to view audit logs",
            });
        }
        return res.status(200).json({
            success: true,
            count: auditLogs.length,
            auditLogs,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
//# sourceMappingURL=GetAuditLogs.js.map