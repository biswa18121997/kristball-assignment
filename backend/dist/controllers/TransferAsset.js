import prisma from "../utils/prisma.js";
import { createAuditLog } from "../utils/createAuditLog.js";
export default async function TransferAsset(req, res) {
    try {
        const { fromBaseId, toBaseId, items } = req.body;
        if (!fromBaseId || !toBaseId || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid transfer data",
            });
        }
        if (req.role === "BASE_COMMANDER") {
            // Base commander can ONLY transfer from his own base
            if (fromBaseId !== req.baseId) {
                return res.status(403).json({
                    success: false,
                    message: "Base Commander can only transfer assets from their own base",
                });
            }
        }
        else if (req.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to transfer assets",
            });
        }
        const transfer = await prisma.transfer.create({
            data: {
                fromBaseId,
                toBaseId,
                createdBy: req.userId,
                items: {
                    create: items.map((item) => ({
                        equipmentId: item.equipmentId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: {
                items: true,
                fromBase: true,
                toBase: true,
            },
        });
        // decrement stock for fromBase and create TRANSFER_OUT transactions
        for (const item of transfer.items) {
            const stock = await prisma.baseStock.findUnique({
                where: { baseId_equipmentId: { baseId: fromBaseId, equipmentId: item.equipmentId } },
            });
            if (!stock || stock.currentQuantity < item.quantity) {
                // rollback transfer if insufficient stock
                await prisma.transfer.delete({ where: { id: transfer.id } });
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for equipment ${item.equipmentId} at base ${fromBaseId}`,
                });
            }
            await prisma.baseStock.update({
                where: { id: stock.id },
                data: { currentQuantity: stock.currentQuantity - item.quantity },
            });
            await prisma.transaction.create({
                data: {
                    txType: "TRANSFER_OUT",
                    baseId: fromBaseId,
                    equipmentId: item.equipmentId,
                    quantity: item.quantity,
                    sourceType: "TRANSFER",
                    sourceId: transfer.id,
                    performedBy: req.userId,
                },
            });
        }
        await createAuditLog({
            actorId: req.userId,
            action: "CREATE_TRANSFER",
            entity: "Transfer",
            entityId: transfer.id,
            payload: {
                fromBaseId,
                toBaseId,
                items,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Transfer created successfully",
            transfer,
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
//# sourceMappingURL=TransferAsset.js.map