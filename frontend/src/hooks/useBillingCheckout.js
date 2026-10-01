import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  showOrderSuccessAlert,
  showErrorAlert,
  showWarningAlert
} from "../utils/sweetalert";

export const getApiBaseUrl = () => {
  const envUrl = import.meta.env?.VITE_API_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }
  const host = typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "localhost";
  return `http://${host}:5000/api`;
};

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const parseSafeJson = async (res) => {
  try {
    const text = await res.text();
    if (!text || text.trim().startsWith("<")) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const useBillingCheckout = () => {
  const {
    cartItems,
    subtotal,
    shippingFee,
    grandTotal,
    appliedCoupon,
    discountAmount,
    clearCart
  } = useCart();

  const navigate = useNavigate();

  const [formData, setFormData] = useState(() => {
    let savedUser = null;
    try {
      const raw = localStorage.getItem("ecobazar_user");
      if (raw) savedUser = JSON.parse(raw);
    } catch {}

    const nameParts = savedUser?.name ? savedUser.name.split(" ") : [];
    const fName = savedUser?.firstName || nameParts[0] || "";
    const lName = savedUser?.lastName || nameParts.slice(1).join(" ") || "";

    return {
      firstName: fName,
      lastName: lName,
      company: savedUser?.company || "",
      street: savedUser?.address?.street || "",
      country: savedUser?.address?.country || "United States",
      state: savedUser?.address?.state || "",
      zipCode: savedUser?.address?.zipCode || "",
      email: savedUser?.email || "",
      phone: savedUser?.phone || "",
      orderNotes: ""
    };
  });

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [apiError, setApiError] = useState("");
  const [resendEmailInput, setResendEmailInput] = useState("");
  const [showResendInput, setShowResendInput] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [isResending, setIsResending] = useState(false);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "https://placehold.co/100x100?text=Product";
    if (imgPath.startsWith("http")) return imgPath;
    return `http://localhost:5000${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.street.trim()) newErrors.street = "Street address is required";
    if (!formData.state.trim()) newErrors.state = "State or city is required";
    if (!formData.zipCode.trim()) newErrors.zipCode = "Zip / Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const syncCustomerToDatabase = async () => {
    const customerRes = await fetch(`${getApiBaseUrl()}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        street: formData.street.trim(),
        city: formData.state.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        country: formData.country.trim(),
        orderNotes: formData.orderNotes.trim()
      })
    });

    const customerData = await parseSafeJson(customerRes);
    if (customerData?.customer) return customerData.customer;

    return {
      _id: "cust_" + Date.now(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      address: {
        street: formData.street.trim(),
        city: formData.state.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        country: formData.country.trim()
      }
    };
  };

  const submitOrderToBackend = async (customerObj, paymentPayload = {}) => {
    const isOnline = paymentMethod === "ONLINE" || paymentMethod === "RAZORPAY";
    const billingEmail = (formData.email || customerObj.email || "").trim().toLowerCase();
    const billingName = (`${formData.firstName} ${formData.lastName}`).trim() || customerObj.name;
    const billingPhone = (formData.phone || customerObj.phone || "").trim();
    const billingAddress = {
      street: (formData.street || "").trim(),
      city: (formData.state || "").trim(),
      state: (formData.state || "").trim(),
      zipCode: (formData.zipCode || "").trim(),
      country: (formData.country || "United States").trim()
    };

    const orderPayload = {
      customerId: customerObj._id,
      customerDetails: {
        name: billingName,
        email: billingEmail,
        phone: billingPhone,
        address: billingAddress
      },
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: Number(item.finalPrice ?? item.price ?? 0),
        quantity: Number(item.quantity) || 1,
        unit: item.unit || "kg",
        image: item.image || ""
      })),
      paymentMethod: isOnline ? "ONLINE" : "COD",
      couponCode: appliedCoupon?.code || "",
      discountAmount: Number(discountAmount) || 0,
      orderNotes: formData.orderNotes.trim(),
      ...paymentPayload
    };

    const orderRes = await fetch(`${getApiBaseUrl()}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload)
    });

    const orderData = await parseSafeJson(orderRes);
    if (!orderRes.ok || !orderData?.order) {
      throw new Error(orderData?.message || "Failed to record order on server");
    }

    const createdOrder = orderData.order;
    try {
      const prevOrders = JSON.parse(localStorage.getItem("ecobazar_orders") || "[]");
      localStorage.setItem(
        "ecobazar_orders",
        JSON.stringify([
          createdOrder,
          ...prevOrders.filter((o) => o.orderNumber !== createdOrder.orderNumber)
        ])
      );
    } catch (e) {}

    clearCart();
    setOrderComplete(createdOrder);

    showOrderSuccessAlert(createdOrder).then((result) => {
      if (result.isConfirmed) {
        navigate(createdOrder._id ? `/account/orders/${createdOrder._id}` : "/account/orders");
      }
    });
  };

  const handleResendEmail = async (overrideEmail) => {
    if (!orderComplete?._id) return;
    const targetEmail = (overrideEmail || resendEmailInput || orderComplete.customerDetails?.email || "").trim().toLowerCase();
    if (!targetEmail) return;
    setIsResending(true);
    setResendStatus("");
    try {
      const res = await fetch(`${getApiBaseUrl()}/orders/${orderComplete._id}/resend-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await parseSafeJson(res);
      if (data?.success && data?.emailSent) {
        setResendStatus(`Email successfully sent to ${targetEmail}`);
        setOrderComplete((prev) => ({
          ...prev,
          customerDetails: {
            ...prev?.customerDetails,
            email: targetEmail
          }
        }));
        setShowResendInput(false);
      } else {
        setResendStatus(data?.message || "Failed to send email. Please check email address.");
      }
    } catch (e) {
      setResendStatus("Failed to send email. Please check network connection.");
    } finally {
      setIsResending(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm()) {
      const firstError = Object.values(errors)[0] || "Please fill in all required customer fields";
      setApiError(firstError);
      showWarningAlert("Incomplete Details", firstError);
      return;
    }

    if (cartItems.length === 0) {
      const msg = "Your cart is empty. Please add products before placing an order.";
      setApiError(msg);
      showWarningAlert("Empty Cart", msg);
      return;
    }

    setIsProcessing(true);

    try {
      const customer = await syncCustomerToDatabase();

      if (paymentMethod === "ONLINE" || paymentMethod === "RAZORPAY") {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
        }

        const numericTotal = Number(grandTotal) || 0;
        let rzpOrderId = "";
        let razorpayKey = "rzp_test_TfO0HJeaFfjYpg";
        let amountInPaise = Math.max(100, Math.round(numericTotal * 100));

        try {
          const rzpRes = await fetch(`${getApiBaseUrl()}/orders/razorpay/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: numericTotal,
              receipt: `rcpt_${Date.now()}`
            })
          });

          const rzpData = await parseSafeJson(rzpRes);
          if (rzpData?.orderId) rzpOrderId = rzpData.orderId;
          if (rzpData?.keyId) razorpayKey = rzpData.keyId;
          if (rzpData?.amount) amountInPaise = rzpData.amount;
        } catch (_) {}

        const options = {
          key: razorpayKey,
          amount: amountInPaise,
          currency: "INR",
          name: "Ecobazar Groceries",
          description: "Fresh & Organic Groceries Payment",
          image: "https://placehold.co/128x128/16a34a/ffffff?text=Ecobazar",
          ...(rzpOrderId ? { order_id: rzpOrderId } : {}),
          handler: async function (response) {
            try {
              setIsProcessing(true);
              await submitOrderToBackend(customer, {
                razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpayOrderId: response.razorpay_order_id || rzpOrderId || `order_${Date.now()}`,
                razorpaySignature: response.razorpay_signature || "test_signature",
                paymentMethod: "ONLINE"
              });
            } catch (err) {
              setApiError(err.message || "Payment verification failed");
            } finally {
              setIsProcessing(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email.trim(),
            contact: formData.phone.trim()
          },
          notes: {
            address: `${formData.street}, ${formData.state}`
          },
          theme: {
            color: "#16a34a"
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on("payment.failed", function (response) {
          const desc = response.error?.description || "Transaction declined";
          setApiError(`Payment Failed: ${desc}`);
          showErrorAlert("Payment Declined", desc);
          setIsProcessing(false);
        });

        razorpayInstance.open();
      } else {
        await submitOrderToBackend(customer, {
          paymentMethod: paymentMethod === "BANK_TRANSFER" ? "BANK_TRANSFER" : "COD"
        });
      }
    } catch (err) {
      const msg = err.message || "An unexpected error occurred during payment.";
      setApiError(msg);
      showErrorAlert("Order Failed", msg);
      setIsProcessing(false);
    }
  };

  return {
    cartItems,
    subtotal,
    shippingFee,
    grandTotal,
    appliedCoupon,
    discountAmount,
    formData,
    paymentMethod,
    setPaymentMethod,
    errors,
    isProcessing,
    orderComplete,
    apiError,
    resendEmailInput,
    setResendEmailInput,
    showResendInput,
    setShowResendInput,
    resendStatus,
    isResending,
    getImageUrl,
    handleInputChange,
    handleResendEmail,
    handlePayment
  };
};
