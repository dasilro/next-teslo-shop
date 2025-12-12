//import { OrderStatus, PayPalButton, Title } from "@/components";
import { OrderStatus, Title } from "@/components";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getOrderById } from "@/actions/order/get-order-by-id";
import { currencyFormat } from "../../../../utils/currencyFormat";

interface Props {
  params: { id: string };
}

export default async function OrdersPage({ params }: Props) {
  const { id } = await params;
  if (!id) {
    redirect("/orders/history");
  }

  const { ok, order } = await getOrderById(id);

  if (!ok) redirect("/orders/history");

  if (!order) {
    return <div>Cargando...</div>;
  }
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split("-").at(-1)}`}></Title>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={order.isPaid} />
            {/* Items */}
            {order.OrderItem.map((item) => (
              <div key={item.id} className="flex mb-5">
                <Image
                  width={100}
                  height={100}
                  style={{ width: 100, height: 100 }}
                  alt={item.Product.title}
                  src={`/products/${item.Product.productImage[0].url}`}
                  className="mr-5 rounded"
                ></Image>
                <div>
                  <p>{item.Product.title}</p>
                  <p>
                    ${item.price} x {item.quantity}
                  </p>
                  <p className="font-bold">
                    Subtotal: {currencyFormat(item.quantity * item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Resumen del pedido */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-2">
              <p>{`${order.OrderAddress?.firstName} ${order.OrderAddress?.lastName}`}</p>
              <p>{order.OrderAddress?.address}</p>
              <p>{order.OrderAddress?.address2}</p>
              <p>{`${order.OrderAddress?.city} ${order.OrderAddress?.postalCode}`}</p>
              <p>{order.OrderAddress?.country}</p>
              <p>{order.OrderAddress?.phone}</p>
            </div>
            {/* Divider */}
            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className="text-2xl mb-2">Resumen de pedido</h2>
            <div className="grid grid-cols-2">
              <span>Número productos</span>
              <span className="text-right">
                {order.itemsInOrder == 1
                  ? "1 artículo"
                  : `${order.itemsInOrder} artículos`}
              </span>
              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormat(order.subTotal)}
              </span>
              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order.tax)}</span>
              <span className="mt-5 text-2xl">Total</span>
              <span className="mt-5 text-2xl text-right">
                {currencyFormat(order.total)}
              </span>
            </div>
            <div className="mt-5 mb-2 w-full">
              {order.isPaid ? (
                <OrderStatus isPaid={order.isPaid} />
              ) : (
                <div></div>
                /*
                  <PayPalButton amount={order.total} orderId={order.id} />
                  */
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
