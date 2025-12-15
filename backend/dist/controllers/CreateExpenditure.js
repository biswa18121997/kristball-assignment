import prisma from "../utils/prisma.js";
import { createAuditLog } from "../utils/createAuditLog.js";
export default async function CreateExpenditure(req, res) {
    try {
        const { baseId, equipmentId, quantity, reason } = req.body;
        if (!baseId || !equipmentId || !quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: "Invalid expenditure data" });
        }
        if (req.role !== "ADMIN" && req.role !== "BASE_COMMANDER" && req.role !== "LOGISTICS_PERSONNEL") {
            return res.status(403).json({ success: false, message: "Unauthorized to record expenditures" });
        }
        if (req.role === "BASE_COMMANDER" && req.baseId !== baseId) {
            return res.status(403).json({ success: false, message: "Base Commander can only record expenditures for their own base" });
        }
        // check stock
        const stock = await prisma.baseStock.findUnique({
            where: { baseId_equipmentId: { baseId, equipmentId } },
        });
        if (!stock || stock.currentQuantity < quantity) {
            return res.status(400).json({ success: false, message: "Insufficient stock for expenditure" });
        }
        const expenditure = await prisma.expenditure.create({
            data: {
                baseId,
                equipmentId,
                quantity,
                reason,
                performedBy: req.userId,
            },
        });
        // decrement stock
        await prisma.baseStock.update({
            where: { id: stock.id },
            data: { currentQuantity: stock.currentQuantity - quantity },
        });
        // createng transaction afyer expenditure ..
        await prisma.transaction.create({
            data: {
                txType: "EXPENDITURE",
                baseId,
                equipmentId,
                quantity,
                sourceType: "EXPENDITURE",
                sourceId: expenditure.id,
                performedBy: req.userId,
            },
        });
        // audit loging..
        await createAuditLog({
            actorId: req.userId,
            action: "CREATE_EXPENDITURE",
            entity: "Expenditure",
            entityId: expenditure.id,
            payload: { baseId, equipmentId, quantity, reason },
        });
        return res.status(201).json({ success: true, message: "Expenditure recorded", expenditure });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
//# sourceMappingURL=CreateExpenditure.js.map