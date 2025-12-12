"use client";
import { on } from "events";
import React, { useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  onQuantityChanged: (quantity: number) => void;
}

export const QuantitySelector = ({ quantity, onQuantityChanged }: Props) => {
  const onQuantityChange = (value: number) => {
    const newValue = quantity + value;
    if (newValue < 1) return;
    onQuantityChanged(newValue);
  };
  return (
    <div className="flex">
      <button>
        <IoRemoveCircleOutline
          size={30}
          onClick={() => onQuantityChange(-1)}
        ></IoRemoveCircleOutline>
      </button>
      <span className="w-20 mx-3 px-5 bg-gray-200 text-center rounded">
        {quantity}
      </span>
      <button>
        <IoAddCircleOutline
          size={30}
          onClick={() => onQuantityChange(1)}
        ></IoAddCircleOutline>
      </button>
    </div>
  );
};
