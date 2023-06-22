/**
 * Client side API calls. Don't use server stuff like process.env.
 */

import { ObjectId } from "bson";

function addToCart(
  productId: string,
  cookies: { [key: string]: string },
  setCookies: (name: "cart", value: string) => void
) {
    let cookie = cookies.cart;
    if (!cookie) {
      cookie = new ObjectId().toHexString();
      setCookies("cart", cookie);
    }

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "sessionId": cookie, "productId": productId }),
    };
    void fetch(`${window.location.origin}/api/cart/add`, options);
}

function removeFromCart(productId: string) {
    let cookie = ""; // TODO get cookie
    
    const options = {
      method: "POST",
      body: JSON.stringify({ "sessionId": cookie, "productId": productId }),
    };
    void fetch(`${window.location.origin}/api/cart/remove`, options);
}

function updateCart(productId: string, quantity: number) {
    let cookie = ""; // TODO get cookie
    
    const options = {
      method: "POST",
      body: JSON.stringify({ "sessionId": cookie, "productId": productId, "quantity": quantity }),
    };
    void fetch(`${window.location.origin}/api/cart/update`, options);
}

function clearCart() {
    let cookie = ""; // TODO get cookie
    
    const options = {
      method: "POST",
      body: JSON.stringify({ "sessionId": cookie }),
    };
    void fetch(`${window.location.origin}/api/cart/clear`, options);
}

function viewCart() {
    let cookie = ""; // TODO get cookie
    
    const options = {
      method: "POST",
      body: JSON.stringify({ "sessionId": cookie }),
    };
    void fetch(`${window.location.origin}/api/cart/view`, options);
}

export { addToCart, removeFromCart, updateCart, clearCart, viewCart };
