import type { Request, Response } from "express";
import prisma from "../utils/prisma.js";
import { createAuditLog } from "../utils/createAuditLog.js";

export default async function NewPurchase(req: Request, res: Response) {
  try {
    // Logistics personnel & Admin CAN create  onlyy
    if (req.role !== "LOGISTICS_PERSONNEL" && req.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to create purchase",
      });
    }

    const { baseId, items } = req.body;

    if (!baseId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid purchase data",
      });
    }
    const purchase = await prisma.purchase.create({
      data: {
        baseId,
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
      },
    });

    for (const item of purchase.items) {
      const stock = await prisma.baseStock.findUnique({
        where: { baseId_equipmentId: { baseId, equipmentId: item.equipmentId } },
      });

      if (stock) {
        await prisma.baseStock.update({
          where: { id: stock.id },
          data: { currentQuantity: stock.currentQuantity + item.quantity },
        });
      } else {
        await prisma.baseStock.create({
          data: {
            baseId,
            equipmentId: item.equipmentId,
            openingQuantity: 0,
            currentQuantity: item.quantity,
          },
        });
      }

      await prisma.transaction.create({
        data: {
          txType: "PURCHASE",
          baseId,
          equipmentId: item.equipmentId,
          quantity: item.quantity,
          sourceType: "PURCHASE",
          sourceId: purchase.id,
          performedBy: req.userId,
        },
      });
    }
    await createAuditLog({
      actorId: req.userId,
      action: "CREATE_PURCHASE",
      entity: "Purchase",
      entityId: purchase.id,
      payload: {
        baseId,
        items,
        totalItems: items.length,
      },
    });

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      purchase,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
