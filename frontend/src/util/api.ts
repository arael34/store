async function viewCart(cookie: string) {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": cookie,
        },
    }

    const res = await fetch("http://localhost:3000/api/cart/view", options)

    return await res.json()
}

function addToCart(cookie: string, product: string) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": cookie,
        },
        body: JSON.stringify({
            product: product,
        }),
    }

    fetch("http://localhost:3000/api/cart/add", options)
}

function removeFromCart(cookie: string, product: string) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": cookie,
        },
        body: JSON.stringify({
            product: product,
        }),
    }

    fetch("http://localhost:3000/api/cart/remove", options)
}

function clearCart(cookie: string) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": cookie,
        },
    }

    fetch("http://localhost:3000/api/cart/clear", options)
}

function updateCart(cookie: string, product: string, quantity: number) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": cookie,
        },
        body: JSON.stringify({
            product: product,
            quantity: quantity,
        }),
    };

    fetch("http://localhost:3000/api/cart/update", options);
}

function checkout(cookie: string) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": cookie,
        },
    };

    fetch("http://localhost:3000/api/checkout", options);
}

async function fetchProducts() {
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const res = await fetch("http://localhost:3000/api/products", options);
    return await res.json();
}

export {
    viewCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCart,
    checkout,
    fetchProducts,
};
