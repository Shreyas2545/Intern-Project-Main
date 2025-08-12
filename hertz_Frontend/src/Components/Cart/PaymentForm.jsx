import React, { useState } from "react";
import { motion } from "framer-motion";

const buttonVariants = {
  hover: { scale: 1.05, y: -2, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

export default function PaymentForm({ method, total }) {
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleUpiChange = (e) => {
    setUpiId(e.target.value);
  };

  return (
    <div className="space-y-4">
      {method === "card" && (
        <div className="space-y-4">
          <div>
            <label className="block text-blue-900 text-sm font-medium">
              Card Number
            </label>
            <input
              type="text"
              name="number"
              value={cardDetails.number}
              onChange={handleCardChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-blue-900 text-sm font-medium">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiry"
                value={cardDetails.expiry}
                onChange={handleCardChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YY"
                required
              />
            </div>
            <div>
              <label className="block text-blue-900 text-sm font-medium">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleCardChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
                required
              />
            </div>
          </div>
        </div>
      )}
      {method === "upi" && (
        <div>
          <label className="block text-blue-900 text-sm font-medium">
            UPI ID
          </label>
          <input
            type="text"
            value={upiId}
            onChange={handleUpiChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@upi"
            required
          />
        </div>
      )}
      {method === "cod" && (
        <p className="text-blue-900/70 text-sm">
          Pay ₹{total.toFixed(2)} on delivery. No prepayment required.
        </p>
      )}
    </div>
  );
}
