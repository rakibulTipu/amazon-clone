import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { Link, useHistory } from "react-router-dom";
import CheckoutProduct from "./CheckoutProduct";
import "./Payment.css";
import { getBasketTotal } from "./reducer";
import { useStateValue } from "./StateProvider";
import axios from "axios";

function Payment() {
  const [{ basket, user }, dispatch] = useStateValue();
  const history = useHistory();
  const stripe = useStripe();
  const elements = useElements();

  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState("");

  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
    //generate the special stripe secret which allows us to charge a customer

    const getClientSecret = async () => {
      const response = await axios({
        method: "post",
        // stripe expects the total in a currencies submits
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });
      setClientSecret(response.data.clientSecret);
    };
    getClientSecret();
  }, [basket]);

  console.log("the secret is", clientSecret);

  const handleSubmit = async (event) => {
    // do all the fancy stripe stuff...
    event.preventDefault();
    setProcessing(true);

    const payLoad = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        // paymentIntent = payment confirmation

        setSucceeded(true);
        setError(null);
        setProcessing(false);

        dispatch({
          type: "EMPTY_BASKET",
        });

        history.replace("/orders");
      });
  };
  const handleChange = (event) => {
    //Listen for changes in the cardElement
    // and deploy any errors as the customer types their card details

    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  return (
    <div className="payment">
      <div className="paymentContainer">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>)
        </h1>

        {/* payment section delivery address */}
        <div className="paymentSection">
          <div className="paymentTitle">
            <h3>Delivery address</h3>
          </div>
          <div className="paymentAddress">
            <p>{user?.email}</p>
            <p>123 react lane</p>
            <p>los angeles,ca </p>
          </div>
        </div>

        {/* payment seciton review items */}
        <div className="paymentSection">
          <div className="paymentTitle">
            <h3>review items and delivery</h3>
          </div>
          <div className="paymentItems">
            {basket.map((item) => (
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        {/* payment section payment method */}
        <div className="paymentSection">
          <div className="paymentTitle">
            <h3>payment method</h3>
          </div>
          <div className="paymentDetails">
            {/* stripe functionality goes here */}

            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange}></CardElement>

              <div className="paymentPriceContainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      <h3>Order Total: {value}</h3>{" "}
                    </>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
                <button disabled={process || disabled || succeeded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>
              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
