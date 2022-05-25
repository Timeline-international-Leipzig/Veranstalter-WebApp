import React from "react";
import ReactDOM from "react-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
//const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

function PayPalTest(props) {
  const initialOptions = {
    "client-id":
      "AUi52IAzI3T7POmfpI5BJr-HwuXXg15VsTSqV43ERUcv73K55LHlpSjC0nfi2Tl-jW9rqekNTq0mjZQS",
    currency: "EUR",
    intent: "capture",
    // "data-client-token": "abc123xyz==",
  };
  function createOrder(data, actions) {
    console.log(data, actions);
    return actions.order.create({
      purchase_units: [
        {
          description: "test",
          amount: {
            currency_code: "EUR",
            value: "30.00",
          },
        },
      ],
    });
  }

  function onApprove(data, actions) {
    console.log(data, actions);
    return actions.order.capture();
  }

  function onError(error) {
    console.log(error);
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
        onError={(error) => onError(error)}
        fundingSource="paypal"
      />
    </PayPalScriptProvider>
  );
}
export default PayPalTest;

/*
const paypal = useRef();

useEffect(() => {
  window.paypal
    .Buttons({
      createOrder: (data, actions, err) => {
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [
            {
              description: "Cool looking table",
              amount: {
                currency_code: "CAD",
                value: 650.0,
              },
            },
          ],
        });
      },
      onApprove: async (data, actions) => {
        const order = await actions.order.capture();
        console.log(order);
      },
      onError: (err) => {
        console.log(err);
      },
    })
    .render(paypal.current);
}, []);
*/
