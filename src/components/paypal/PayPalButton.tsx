// "use client";
// import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
// import {
//   CreateOrderData,
//   CreateOrderActions,
//   OnApproveActions,
//   OnApproveData,
// } from "@paypal/paypal-js";
// import React from "react";
// import { setTransactionId } from "@/actions";
// import { paypalCheckPayment } from "@/actions/payments/paypal-payment";

// interface PayPalButtonProps {
//   orderId: string;
//   amount: number;
// }

// export const PayPalButton = ({ orderId, amount }: PayPalButtonProps) => {
//   const [{ isPending }] = usePayPalScriptReducer();
//   const roundedAmount = (Math.round(amount * 100) / 100).toFixed(2);

//   const createOrder = async (
//     data: CreateOrderData,
//     actions: CreateOrderActions
//   ): Promise<string> => {
//     const transactionId = await actions.order.create({
//       intent: "CAPTURE",
//       purchase_units: [
//         {
//           invoice_id: orderId,
//           amount: {
//             value: `${roundedAmount}`,
//             currency_code: "USD",
//           },
//         },
//       ],
//     });

//     // Guardar el transaction id en la base de datos
//     const { ok, message } = await setTransactionId(orderId, transactionId);
//     if (!ok) {
//       throw new Error("No se pudo actualizar el pedido: " + message);
//     }
//     console.log("createOrder", transactionId);
//     return transactionId;
//   };

//   const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
//     const details = await actions.order!.capture();
//     if (!details || !details.id) return;
//     await paypalCheckPayment(details.id);
//   };

//   if (isPending) {
//     return (
//       <div className="animate-pulse mb-16">
//         <div className="h-11 bg-gray-300 rounded"></div>
//         <div className="h-11 bg-gray-300 rounded mt-2"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative z-0">
//       <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
//     </div>
//   );
// };
