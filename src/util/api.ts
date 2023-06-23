/**
 * Client side API calls. Don't use server stuff like process.env.
 */
import { v1 as uuid } from "uuid";

function addToCart(
  productId: string,
  cookies: { [key: string]: string },
  setCookies: (name: "cart", value: string) => void
) {
    let cookie = cookies.cart;
    if (!cookie) {
      cookie = uuid();
      setCookies("cart", cookie);
    }

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "sessionId": cookie, "productId": productId }),
    };
    void fetch(`${window.location.origin}/api/cart/add`, options);
}

function removeFromCart(productId: string, cookie: string) {    
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "sessionId": cookie, "productId": productId }),
    };
    void fetch(`${window.location.origin}/api/cart/remove`, options);
}

function updateCart(productId: string, quantity: number, cookie: string) {    
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "sessionId": cookie,
        "productId": productId,
        "quantity": quantity,
      }),
    };
    void fetch(`${window.location.origin}/api/cart/update`, options);
}

function clearCart(cookie: string) {    
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "sessionId": cookie }),
    };
    void fetch(`${window.location.origin}/api/cart/clear`, options);
}

async function viewCart(cookie: string) {    
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const res = await fetch(
      `${window.location.origin}/api/cart/view?sessionId=${cookie}`,
      options
    );
    return await res.json();
}

export { addToCart, removeFromCart, updateCart, clearCart, viewCart };
