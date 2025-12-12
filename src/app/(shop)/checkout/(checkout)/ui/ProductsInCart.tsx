"use client";
import { useCartStore } from "@/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { currencyFormat } from "../../../../../utils/currencyFormat";

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const productsInCart = useCartStore((state) => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <p>Loading...</p>;
  return (
    <>
      {productsInCart.map((product) => (
        <div key={`${product.slug}${product.size}`} className="flex mb-5">
          <Image
            width={100}
            height={100}
            style={{ width: 100, height: 100 }}
            alt={product.title}
            src={`/products/${product.image}`}
            className="mr-5 rounded"
          ></Image>
          <div>
            <span>
              {product.size} - {product.title} ({product.quantity})
            </span>
            <p className="font-bold">
              {currencyFormat(product.price * product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
