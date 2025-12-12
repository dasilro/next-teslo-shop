"use client";
import { useCartStore } from "@/store";
import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { currencyFormat } from "@/utils";

export const OrderSummary = () => {
  const { itemsInCart, subTotal, tax, total } = useCartStore(
    useShallow((state) => state.getSummaryInformation())
  );
  useEffect(() => {
    setLoaded(true);
  }, []);

  const [loaded, setLoaded] = useState(false);

  if (!loaded) return <p>Loading...</p>;
  return (
    <div className="grid grid-cols-2">
      <span>Número productos</span>
      <span className="text-right">
        {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
      </span>
      <span>Subtotal</span>
      <span className="text-right">{currencyFormat(subTotal)}</span>
      <span>Impuestos (15%)</span>
      <span className="text-right">{currencyFormat(tax)}</span>
      <span className="mt-5 text-2xl">Total</span>
      <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
    </div>
  );
};
