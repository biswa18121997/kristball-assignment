import type { Request, Response } from "express";
import prisma from "../utils/prisma.js";
import { createAuditLog } from "../utils/createAuditLog.js";

export default async function GetAllTransfers(req: Request, res: Response) {
  try {
    const { role, baseId, userId } = req;
    if (
      role !== "ADMIN" &&
      role !== "BASE_COMMANDER" &&
      role !== "LOGISTICS_PERSONNEL"
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view transfers",
      });
    }
    let whereClause: any = {};
    if (role !== "ADMIN") {
      // nonn-admins see transfers of their base only..
      whereClause = {
        OR: [
          { fromBaseId: baseId }, // trander outt
          { toBaseId: baseId },   // tranferr  inn
        ],
      };
    }
    const transfers = await prisma.transfer.findMany({
      where: whereClause,
      include: {
        fromBase: true,
        toBase: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            equipment: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    await createAuditLog({
      actorId: userId,
      action: "VIEW_TRANSFERS",
      entity: "Transfer",
      payload: {
        role,
        baseId: baseId ?? "ALL",
        count: transfers.length,
      },
    });

    return res.status(200).json({
      success: true,
      count: transfers.length,
      transfers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
