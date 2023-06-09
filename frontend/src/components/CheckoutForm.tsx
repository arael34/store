import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

function Checkout() {
    return (
        <div>
            <Elements stripe={stripePromise}>
                <PaymentElement />
                <button>Pay</button>
            </Elements>
        </div>
    );
}

export default Checkout;
