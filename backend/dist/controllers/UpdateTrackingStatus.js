import prisma from "../utils/prisma.js";
import { createAuditLog } from "../utils/createAuditLog.js";
export default async function UpdateTrackingStatus(req, res) {
    try {
        const { transferId, newStatus, oldStatus } = req.body;
        const transfer = await prisma.transfer.findUnique({
            where: { id: transferId },
            include: {
                fromBase: true,
                toBase: true,
                createdByUser: true,
                items: true,
            },
        });
        if (!transfer) {
            return res.status(404).json({
                message: "Transfer not found",
                success: false,
            });
        }
        // only logistics personnel or admin can update other bases; base commander limited to own base..
        // @ts-ignore
        if (transfer.fromBase.id !== req.baseId && req.role !== "LOGISTICS_PERSONNEL" && req.role !== "ADMIN") {
            return res.status(403).json({
                message: "Unauthorized to update tracking status for this transfer",
                success: false,
            });
        }
        const updatedTransfer = await prisma.transfer.update({
            where: { id: transferId },
            data: { status: newStatus },
        });
        if (newStatus === "COMPLETED") {
            for (const item of transfer.items) {
                const toStock = await prisma.baseStock.findUnique({
                    where: { baseId_equipmentId: { baseId: transfer.toBaseId, equipmentId: item.equipmentId } },
                });
                if (toStock) {
                    await prisma.baseStock.update({
                        where: { id: toStock.id },
                        data: { currentQuantity: toStock.currentQuantity + item.quantity },
                    });
                }
                else {
                    await prisma.baseStock.create({
                        data: {
                            baseId: transfer.toBaseId,
                            equipmentId: item.equipmentId,
                            openingQuantity: 0,
                            currentQuantity: item.quantity,
                        },
                    });
                }
                await prisma.transaction.create({
                    data: {
                        txType: "TRANSFER_IN",
                        baseId: transfer.toBaseId,
                        equipmentId: item.equipmentId,
                        quantity: item.quantity,
                        sourceType: "TRANSFER",
                        sourceId: transfer.id,
                        performedBy: req.userId,
                    },
                });
            }
        }
        await createAuditLog({
            actorId: req.userId,
            action: "UPDATE_TRANSFER_STATUS",
            entity: "Transfer",
            entityId: transferId,
            payload: {
                oldStatus,
                newStatus,
                fromBaseId: transfer.fromBase.id,
                toBaseId: transfer.toBase.id,
            },
        });
        res.status(200).json({
            message: "Tracking status updated successfully",
            success: true,
            updatedTransfer,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}
//# sourceMappingURL=UpdateTrackingStatus.js.map