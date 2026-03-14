import React from "react";
import { FaUndoAlt, FaMoneyBillAlt, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const features = [
  {
    id: 1,
    icon: <FaUndoAlt className="text-green-600 text-lg sm:text-xl" />,
    text: "1 Day Easy Return",
    link: "onedayreturn",
  },
  {
    id: 2,
    icon: <FaMoneyBillAlt className="text-green-600 text-lg sm:text-xl" />,
    text: "Cash on Delivery",
    link: "cashondelivery",
  },
  {
    id: 3,
    icon: <FaTag className="text-green-600 text-lg sm:text-xl" />,
    text: "Lowest Prices",
  },
];

const FeatureStrip = () => {
  const navigate = useNavigate();

  return (
    <section className="py-4 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {features.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => item.link && navigate(item.link)}
              className="group flex items-center gap-4 cursor-pointer"
            >
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                {item.icon}
              </div>
              <span className="text-base font-bold text-gray-700 group-hover:text-emerald-600 transition-colors">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureStrip;
