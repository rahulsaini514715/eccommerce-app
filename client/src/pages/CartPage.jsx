import React from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //total amount
 const totalAmount = () => {
  let total = 0;
  cart?.forEach((item) => {
    total += item.price;
  });
  return Math.round(total * 100); // convert to paise
};

const handleRazorpayPayment = async () => {
  const amount = totalAmount();

  if (amount <= 0) {
    toast.error("Cart is empty or amount is invalid.");
    return;
  }

  try {
    const { data: order } = await axios.post(
      "http://localhost:8080/api/v1/product/razorpay/order",
      { amount },
      {
        headers: {
          Authorization: auth?.token,
        },
      }
    );

    const options = {
      key: "rzp_test_5s5nzeIDNeiCXm",
      amount: order.amount,
      currency: "INR",
      name: "My Ecommerce",
      description: "Order Payment",
      order_id: order.id,
      handler: async function (response) {
        const verifyRes = await axios.post(
          "http://localhost:8080/api/v1/product/razorpay/verify",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            cart,
          },
          {
            headers: {
              Authorization: auth?.token,
            },
          }
        );

        if (verifyRes.data.success) {
          localStorage.removeItem("cart");
          setCart([]);
          toast.success("Payment Successful");
          navigate("/dashboard/user/orders");
        } else {
          toast.error("Payment verification failed");
        }
      },
      prefill: {
        name: auth?.user?.name,
        email: auth?.user?.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong in payment");
  }
};

  console.log("total amount ",totalAmount())

  return (
    <Layout>
  <div className="container py-4">
    {/* Header */}
    <div className="row mb-4">
      <div className="col-md-12 text-center">
        <h2 className="bg-light p-3 rounded">
          Hello, <span className="text-primary">{auth?.token && auth?.user?.name}</span>
        </h2>
        <h5 className="mt-3">
          {cart?.length ? (
            <>
              You have <span className="text-success">{cart.length}</span> item(s) in your cart
              {auth?.token ? "" : " — please login to checkout."}
            </>
          ) : (
            "Your Cart is Empty"
          )}
        </h5>
      </div>
    </div>

    <div className="row">
      {/* Cart Items */}
      <div className="col-md-8">
        {cart?.map((p) => (
          <div className="card mb-3 shadow-sm" key={p._id}>
            <div className="row g-0 align-items-center">
              <div className="col-md-4">
                <img
                  src={`http://localhost:8080/api/v1/product/product-photo/${p._id}`}
                  className="img-fluid rounded-start"
                  alt={p.name}
                  style={{ height: "170px", objectFit: "contain" }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description.substring(0, 50)}...</p>
                  <p className="card-text fw-bold">$ {p.price}</p>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeCartItem(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="col-md-4">
        <div className="card shadow-sm p-3">
          <h4 className="text-center mb-3">Cart Summary</h4>
          <p className="text-muted text-center">Review and proceed to checkout</p>
          <hr />
          <h5 className="text-center">Total: {totalPrice()}</h5>

          {/* Address Section */}
          {auth?.user?.address ? (
            <div className="mt-3 text-center">
              <h6 className="fw-bold">Delivery Address</h6>
              <p>{auth?.user?.address}</p>
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={() => navigate("/dashboard/user/profile")}
              >
                Update Address
              </button>
            </div>
          ) : (
            <div className="mt-3 text-center">
              {auth?.token ? (
                <button
                  className="btn btn-outline-warning"
                  onClick={() => navigate("/dashboard/user/profile")}
                >
                  Update Address
                </button>
              ) : (
                <button
                  className="btn btn-outline-warning"
                  onClick={() =>
                    navigate("/login", {
                      state: "/cart",
                    })
                  }
                >
                  Please Login to Checkout
                </button>
              )}
            </div>
          )}

          {/* Payment Button */}
          {auth?.token && cart?.length > 0 && auth?.user?.address && (
            <button
              className="btn btn-primary w-100 mt-4"
              onClick={handleRazorpayPayment}
            >
              Make Payment
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
</Layout>

  );
};

export default CartPage;
