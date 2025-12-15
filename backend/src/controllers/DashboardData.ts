import prisma from "../utils/prisma.js";
import type { Request, Response } from "express";
import { Role, TransactionType } from "@prisma/client";

export default async function DashboardData(req: Request, res: Response) {
  try {
    const {
      fromDate,
      toDate,
      baseId: queryBaseId,
      equipmentType,
    } = req.query as {
      fromDate?: string;
      toDate?: string;
      baseId?: string;
      equipmentType?: string;
    };
    let baseFilter: string | undefined;

    if (req.role === Role.ADMIN) {
      baseFilter = queryBaseId; // admin may see all or specific base
    } else if (req.role === Role.BASE_COMMANDER) {
      baseFilter = req.baseId; // forced to own base
    } else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view dashboard",
      });
    }
    const dateFilter =
      fromDate || toDate
        ? {
            createdAt: {
              ...(fromDate && { gte: new Date(fromDate) }),
              ...(toDate && { lte: new Date(toDate) }),
            },
          }
        : {};

    const equipmentFilter = equipmentType
      ? {
          equipment: { type: equipmentType },
        }
      : {};

    const stock = await prisma.baseStock.findMany({
      // @ts-ignore
      where: {
        ...(baseFilter && { baseId: baseFilter }),
        ...equipmentFilter,
      },
      include: { equipment: true },
    });

    const openingBalance = stock.reduce(
      (sum, s) => sum + s.openingQuantity,
      0
    );

    const closingBalance = stock.reduce(
      (sum, s) => sum + s.currentQuantity,
      0
    );
    const transactions = await prisma.transaction.findMany({
      // @ts-ignore
      where: {
        ...(baseFilter && { baseId: baseFilter }),
        ...dateFilter,
        ...(equipmentType && {
          equipment: { type: equipmentType },
        }),
      },
    });

    const purchases = transactions.filter(
      (t) => t.txType === TransactionType.PURCHASE
    );
    const transferIn = transactions.filter(
      (t) => t.txType === TransactionType.TRANSFER_IN
    );
    const transferOut = transactions.filter(
      (t) => t.txType === TransactionType.TRANSFER_OUT
    );
    const expenditureTx = transactions.filter(
      (t) => t.txType === TransactionType.EXPENDITURE
    );

    const netMovement =
      purchases.reduce((s, t) => s + t.quantity, 0) +
      transferIn.reduce((s, t) => s + t.quantity, 0) -
      transferOut.reduce((s, t) => s + t.quantity, 0);
    const assignedCount = await prisma.assignment.aggregate({
      _sum: { quantity: true },
      where: {
        ...(baseFilter && { baseId: baseFilter }),
        ...dateFilter,
      },
    });
    const expendedCount = await prisma.expenditure.aggregate({
      _sum: { quantity: true },
      where: {
        ...(baseFilter && { baseId: baseFilter }),
        ...dateFilter,
      },
    });
    return res.status(200).json({
      success: true,
      filtersApplied: {
        baseId: baseFilter ?? "ALL",
        fromDate,
        toDate,
        equipmentType,
      },
      metrics: {
        openingBalance,
        closingBalance,
        netMovement,
        assigned: assignedCount._sum.quantity ?? 0,
        expended: expendedCount._sum.quantity ?? 0,
      },
      breakdown: {
        purchases,
        transferIn,
        transferOut,
        expenditure: expenditureTx,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Dashboard fetch failed",
    });
  }
}
