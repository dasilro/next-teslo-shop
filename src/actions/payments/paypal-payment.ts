"use server";

import { PaypalOrderStatusResponse } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPayPalBearerToken();
  if (!authToken) {
    return { ok: false, message: "No se pudo obtener el token de PayPal" };
  }
  const resp = await verifyPayPalPayment(paypalTransactionId, authToken);
  if (!resp) {
    return { ok: false, message: "No se pudo verificar el pago con PayPal" };
  }
  const { status, purchase_units } = resp;
  const { invoice_id: orderId } = purchase_units[0];

  if (status !== "COMPLETED") {
    return { ok: false, message: "Aun no se ha pagado en paypal" };
  }

  // Realizar la actualización del pedido en la base de datos.
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { isPaid: true, paidAt: new Date() },
    });

    revalidatePath(`/orders/${orderId}`);
    return { ok: true, message: "Pedido actualizado correctamente" };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al actualizar el pedido en la base de datos",
    };
  }
};

const getPayPalBearerToken = async (): Promise<string | null> => {
  const base64Token = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);
  myHeaders.append("Cache-Control", `no-cache`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
    redirect: "follow",
  };

  try {
    const result = await fetch(
      process.env.PAYPAL_OAUTH_URL ?? "",
      requestOptions
    ).then((response) => response.json());
    return result.access_token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyPayPalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PaypalOrderStatusResponse | null> => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);
  myHeaders.append("Cache-Control", `no-cache`);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;
  try {
    const response = await fetch(paypalOrderUrl, requestOptions).then(
      (response) => response.json()
    );
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
