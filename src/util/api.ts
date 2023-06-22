/**
 * Client side API calls. Don't use server stuff like process.env.
 */

import { ObjectId } from "bson";

function addToCart(productId: string) {
    let cookie = ""; // TODO get cookie
    if (!cookie) {
      cookie = new ObjectId().toHexString();
    }
  
    const options = {
      method: "POST",
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

export { addToCart, removeFromCart };
