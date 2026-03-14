import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdLocalOffer } from "react-icons/md";
import { IoMdContact } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";

const footerBanner = {
  title: "Stay Updated with Our Offers",
  contactText: "Contact Us",
  contactLink: "/contactus",
  arrivalsText: "New Arrivals",
  arrivalsLink: "/arrivals",
};

const StayUpdated = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(footerBanner.arrivalsLink);
  };

  return (
    <section className="relative text-center py-16 bg-gradient-to-br from-green-50 via-white to-green-100 rounded-t-3xl shadow-inner overflow-hidden">
      {/* Decorative Icons */}
      <div className="absolute top-4 left-4 text-green-300 text-6xl opacity-20 animate-spin-slow">
        <MdLocalOffer />
      </div>
      <div className="absolute bottom-4 right-4 text-green-300 text-6xl opacity-20 animate-bounce">
        <TbTruckDelivery />
      </div>

      <h3 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-6 animate-fade-in-up">
        {footerBanner.title}
      </h3>

      <div className="flex justify-center gap-6">
        <Link to={footerBanner.contactLink}>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-lg font-medium shadow-md transition-all flex items-center gap-2">
            <IoMdContact /> {footerBanner.contactText}
          </button>
        </Link>
      </div>

      <Link to={footerBanner.arrivalsLink}>
        <button
          onClick={handleNavigate}
          className="fixed bottom-6 right-6 bg-white text-green-600 border border-green-400 px-5 py-2 rounded-full shadow-lg hover:bg-green-500 hover:text-white transition-all duration-300 z-50 flex items-center gap-2"
        >
          <MdLocalOffer className="text-lg" /> {footerBanner.arrivalsText}
        </button>
      </Link>
    </section>
  );
};

export default StayUpdated;
