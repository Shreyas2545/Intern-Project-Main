// src/contexts/CouponContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CouponContext = createContext();

export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error("useCoupon must be used within a CouponProvider");
  }
  return context;
};

export const CouponProvider = ({ children }) => {
  const [bannerCoupon, setBannerCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBannerCoupon = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/coupons/public",
          { headers: { "Content-Type": "application/json" } }
        );
        if (data.success && data.data.length > 0) {
          setBannerCoupon(data.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch public coupons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBannerCoupon();
  }, []);

  return (
    <CouponContext.Provider value={{ bannerCoupon, loading }}>
      {children}
    </CouponContext.Provider>
  );
};
