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
    <section className="py-6 mb-0">
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 p-4 rounded-xl border border-green-300 bg-gradient-to-br from-green-50 via-white to-green-100 shadow-md min-h-[60px]">
        {features.map((item, idx) => (
          <React.Fragment key={item.id}>
            <div
              onClick={() => item.link && navigate(item.link)}
              className="flex items-center gap-2 px-2 sm:px-4 py-2 rounded-full bg-white hover:bg-green-100 hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              {item.icon}
              <span className="text-sm sm:text-base text-gray-800 font-medium">
                {item.text}
              </span>
            </div>

            {/* Divider for larger screens except last item */}
            {idx !== features.length - 1 && (
              <div className="hidden sm:block border-l h-6 border-gray-300" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default FeatureStrip;
