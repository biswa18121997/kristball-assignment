import prisma from "../utils/prisma.js";
import { createAuditLog } from "../utils/createAuditLog.js";
export default async function GetExpenditures(req, res) {
    try {
        let expenditures;
        if (req.role === "ADMIN") {
            expenditures = await prisma.expenditure.findMany({
                include: {
                    base: true,
                    equipment: true,
                    performer: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }
        else if (req.role === "BASE_COMMANDER") {
            expenditures = await prisma.expenditure.findMany({
                where: {
                    baseId: req.baseId,
                },
                include: {
                    base: true,
                    equipment: true,
                    performer: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to view expenditures",
            });
        }
        await createAuditLog({
            actorId: req.userId,
            action: "VIEW_EXPENDITURES",
            entity: "Expenditure",
            entityId: req.role === "BASE_COMMANDER" ? req.baseId : ' ',
            payload: {
                role: req.role,
            },
        });
        return res.status(200).json({
            success: true,
            expenditures,
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
//# sourceMappingURL=GetExpenditures.js.map