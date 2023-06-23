import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { viewCart } from "@/util/api";

type ItemSchema = {
  id: number;
  productId: string;
  quantity: number;
};

function Cart() {
  const [cookies] = useCookies(["cart"]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    viewCart(cookies.cart).then((data) => {
      setCart(data.cart);
      setLoading(false);
    });
  }, [cookies.cart]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!cart.length) {
    return <h1>No items in your cart.</h1>;
  }

  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cart.map((item: ItemSchema) => (
          <li key={item.id}>
            {item.productId} - {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Cart;
