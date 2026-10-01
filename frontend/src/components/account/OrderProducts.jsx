import React from "react";
import { getImageUrl } from "../../utils/imageUrl";

const DEFAULT_PRODUCTS = [
  {
    name: "Red Capsicum",
    price: 14.00,
    quantity: 5,
    image: "/saleimg.jpg"
  },
  {
    name: "Green Capsicum",
    price: 14.00,
    quantity: 2,
    image: "/leaves.jpg"
  },
  {
    name: "Green Chilli",
    price: 26.70,
    quantity: 10,
    image: "/maingreen.jpg"
  }
];

const OrderProducts = ({ items }) => {
  const productList = items && items.length > 0 ? items : DEFAULT_PRODUCTS;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <th className="py-3.5 px-6">Product</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Quantity</th>
              <th className="py-3.5 px-6 text-right sm:text-left">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {productList.map((item, idx) => {
              const price = Number(item.price) || 0;
              const quantity = Number(item.quantity) || 1;
              const subtotal = price * quantity;
              const imgSource = item.image
                ? getImageUrl(item.image, "/saleimg.jpg")
                : "/saleimg.jpg";

              return (
                <tr key={idx} className="hover:bg-gray-50/50 transition">
                  {/* Product Details (Image + Name) */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={imgSource}
                        alt={item.name}
                        className="w-12 h-12 object-contain bg-gray-50 border border-gray-150 rounded-lg p-1 shrink-0"
                        onError={(e) => {
                          e.target.src = "/saleimg.jpg";
                        }}
                      />
                      <span className="font-semibold text-gray-900 line-clamp-2">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                    ${price.toFixed(2)}
                  </td>

                  {/* Quantity */}
                  <td className="py-4 px-4 text-gray-700 whitespace-nowrap">
                    x{quantity}
                  </td>

                  {/* Subtotal */}
                  <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap text-right sm:text-left">
                    ${subtotal.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderProducts;
