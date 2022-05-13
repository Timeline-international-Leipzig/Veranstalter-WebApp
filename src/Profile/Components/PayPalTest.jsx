import React from "react";
import PaypalExpressBtn from "react-paypal-express-checkout";

function PayPalTest() {
  const client = {
    sandbox: "sb-caodf16320171@business.example.com",
    production:
      "AU3YdG3br1l-ewHz6EdBGFEaZMwi676WUfK3qIxapWdxjbzCLdCahkNev4uhgnsoRk3mHMOMh9UxIiAF",
  };

  function onError(error) {
    console.log("Error!", error);
  }

  function onCancel(data) {
    console.log("The payment was cancelled!", data);
  }

  function onSuccess(payment) {
    console.log("The payment was succeeded!", payment);
  }

  return (
    <div style={{ margin: "1.5rem", textAlign: "center" }}>
      <PaypalExpressBtn
        env="sandbox"
        client={client}
        currency="EUR"
        total="30"
        onError={onError}
        onSuccess={onSuccess}
        onCancel={onCancel}
        style={{ shape: "rect", size: "medium", margin: "1.5rem" }}
      />
    </div>
  );
}
export default PayPalTest;
