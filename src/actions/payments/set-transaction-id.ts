"use server";

import { prisma } from "@/lib/prisma";

export const setTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { transactionId },
    });
    if (!updatedOrder) {
      return { ok: false, message: "Order not found" };
    }
    return { ok: true, message: "Transaction ID updated successfully" };
  } catch (error) {
    return {
      ok: false,
      message: "Database error: " + (error as Error).message,
    };
  }
};
