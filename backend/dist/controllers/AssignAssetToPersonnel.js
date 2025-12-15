import prisma from '../utils/prisma.js';
export default async function AssignAssetToPersonnel(req, res) {
    try {
        let { equipmentId, baseId, userId, quantity } = req.body;
        if (req.role !== 'ADMIN' && req.role !== 'BASE_COMMANDER' && req.role !== 'LOGISTICS_PERSONNEL') {
            return res.status(403).json({ success: false, message: 'Unauthorized to assign assets' });
        }
        if (req.role === 'BASE_COMMANDER' && req.baseId !== baseId) {
            return res.status(403).json({ success: false, message: 'Base Commander can only assign assets from their own base' });
        }
        //check stockss..
        const stock = await prisma.baseStock.findUnique({
            where: { baseId_equipmentId: { baseId, equipmentId } },
        });
        if (!stock || stock.currentQuantity < quantity) {
            return res.status(400).json({ success: false, message: 'Insufficient stock for assignment' });
        }
        // decrement stock
        await prisma.baseStock.update({
            where: { id: stock.id },
            data: { currentQuantity: stock.currentQuantity - quantity },
        });
        const assignment = await prisma.assignment.create({
            data: {
                equipmentId,
                baseId,
                userId,
                quantity,
                status: 'ACTIVE',
                createdBy: req.userId
            }
        });
        // audit loggingg
        await prisma.auditLog.create({
            data: {
                actorId: req.userId,
                action: 'CREATE_ASSIGNMENT',
                entity: 'Assignment',
                entityId: assignment.id,
                payload: { equipmentId, baseId, userId, quantity }
            }
        });
        return res.status(201).json({
            success: true,
            message: 'Asset assigned successfully',
            data: assignment
        });
    }
    catch (error) {
        console.error("RBAC error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
// model Assignment {
//   id           String           @id @default(uuid())
//   equipmentId  String
//   baseId       String
//   userId       String
//   quantity     Int
//   status       AssignmentStatus
//   dateAssigned DateTime         @default(now())
//   dateReturned DateTime?
//   createdBy    String
//   equipment Equipment @relation(fields: [equipmentId], references: [id])
//   base      Base      @relation(fields: [baseId], references: [id])
//   user      User      @relation("AssignmentUser", fields: [userId], references: [id])
//   creator   User      @relation("AssignmentCreator", fields: [createdBy], references: [id])
//   @@unique([equipmentId, userId, dateAssigned])
// }
//# sourceMappingURL=AssignAssetToPersonnel.js.map