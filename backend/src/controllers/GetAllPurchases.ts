import type { Request, Response } from "express";
import prisma from "../utils/prisma.js";
import { createAuditLog } from "../utils/createAuditLog.js";

export default async function GetAllPurchases(req: Request, res: Response) {
  try {
    const { role, baseId, userId } = req;

    if (role !== "ADMIN" && role !== "BASE_COMMANDER") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view purchases",
      });
    }
    const where =
      role === "ADMIN"
        ? undefined
        : baseId
        ? { baseId }
        : undefined;

    const purchases = await prisma.purchase.findMany({
      where,
      include: {
        items: {
          include: {
            equipment: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        base: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    if (userId) {
      await createAuditLog({
        actorId: userId,
        action: "VIEW_PURCHASES",
        entity: "Purchase",
        payload: {
          role,
          baseId: baseId ?? "ALL",
          resultCount: purchases.length,
        },
      });
    }

    return res.status(200).json({
      success: true,
      count: purchases.length,
      purchases,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
