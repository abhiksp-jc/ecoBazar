import React from "react";

const OrderAddress = ({ order, currentUser }) => {
  // Extract billing and shipping details from order or logged in user
  const customerDetails = order?.customerDetails || {};
  const orderAddress = customerDetails.address || {};

  const name =
    customerDetails.name ||
    currentUser?.name ||
    (currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ""}`.trim() : "") ||
    "Customer";

  const email =
    customerDetails.email ||
    currentUser?.email ||
    "";

  const phone =
    customerDetails.phone ||
    currentUser?.phone ||
    "";

  const street =
    orderAddress.street ||
    currentUser?.address?.street ||
    "No address provided";

  const cityStateZip =
    orderAddress.city || orderAddress.state || orderAddress.zipCode
      ? `${orderAddress.city ? orderAddress.city + ", " : ""}${orderAddress.state || ""} ${orderAddress.zipCode || ""}`.trim()
      : "";

  return (
    <>
      {/* BILLING ADDRESS CARD */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between shadow-2xs">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Billing Address
          </span>
          <h3 className="text-sm font-bold text-gray-900 mb-1.5">{name}</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            {street}
            <br />
            {cityStateZip}
          </p>
        </div>

        <div className="space-y-1 text-xs text-gray-600 border-t border-gray-100 pt-3">
          <div>
            <span className="text-gray-400 font-medium">Email: </span>
            <span className="text-gray-800">{email}</span>
          </div>
          <div>
            <span className="text-gray-400 font-medium">Phone: </span>
            <span className="text-gray-800">{phone}</span>
          </div>
        </div>
      </div>

      {/* SHIPPING ADDRESS CARD */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between shadow-2xs">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Shipping Address
          </span>
          <h3 className="text-sm font-bold text-gray-900 mb-1.5">{name}</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            {street}
            <br />
            {cityStateZip}
          </p>
        </div>

        <div className="space-y-1 text-xs text-gray-600 border-t border-gray-100 pt-3">
          <div>
            <span className="text-gray-400 font-medium">Email: </span>
            <span className="text-gray-800">{email}</span>
          </div>
          <div>
            <span className="text-gray-400 font-medium">Phone: </span>
            <span className="text-gray-800">{phone}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderAddress;
