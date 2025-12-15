import prisma from "../utils/prisma.js";
export default async function GetAllAssignments(req, res) {
    try {
        if (req.role !== "ADMIN" && req.role !== "BASE_COMMANDER" && !req.baseId) {
            return res.status(403).json({
                message: "Unauthorized",
                success: false,
            });
        }
        const where = req.baseId
            ? { baseId: req.baseId }
            : {};
        const assignments = await prisma.assignment.findMany({
            where,
            include: {
                equipment: true,
                base: true,
                creator: true,
                user: true,
            },
        });
        return res.status(200).json({
            message: "Assignments fetched successfully",
            success: true,
            assignments,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}
//# sourceMappingURL=GetAllAssignments.js.map