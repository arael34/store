import { useState, useEffect } from "react";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { viewCart, removeFromCart, clearCart, checkout } from "@/util/api";

type ItemSchema = {
  id: string;
  productid: string;
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

  return (
    <div>
      <Link href="/">Home</Link>
      <div className="flex"> 
        <h1>Cart</h1>
        <button onClick={() => clearCart(cookies.cart)}>
          Clear cart
        </button>
      </div>
      <ul>
        {cart.length ? cart.map((item: ItemSchema) => (
          <>
            <li key={item.id}>
              {item.productid} - {item.quantity}
            </li>
            <button onClick={() => removeFromCart(item.productid, cookies.cart)}>
              Remove
            </button>
          </>
        )) : (
          <p>No items in your cart.</p>
        )}
      </ul>
      <button onClick={() => void checkout(cookies.cart)}>
        Checkout
      </button>
    </div>
  );
}

export default Cart;
