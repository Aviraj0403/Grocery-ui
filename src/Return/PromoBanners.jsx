import React from "react";
import { Slide, Zoom } from "react-awesome-reveal";
import { Link, useNavigate } from "react-router-dom";
import { FaSprayCan, FaLeaf, FaMugHot } from "react-icons/fa"; // Icons
import adbanner from "../assets/dio1.png";
import adbanner1 from "../assets/skin4.png";
import adbanner2 from "../assets/tea1.png";

// Banners with icons
const banners = [
  {
    id: 1,
    bgColor: "bg-orange-200",
    title: "Smell Great with Shanumart Deals!",
    cashback: "Max cashback: 2%",
    code: "CARE02",
    img: adbanner,
    link: "/category/684dc29ff21525212b194314", // Example link to detergent category
    icon: <FaSprayCan className="text-3xl text-orange-600 mb-2" />,
    hoverShadow: "hover:shadow-[0_10px_15px_-3px_rgba(255,115,0,0.6)]",
  },
  {
    id: 2,
    bgColor: "bg-yellow-200",
    title: "Glow Naturally Shop Skincare at Shanumart!",
    img: adbanner1,
    link:"/category/68474771cace49c52299e5d2",
    icon: <FaLeaf className="text-3xl text-yellow-700 mb-2" />,
    hoverShadow: "hover:shadow-[0_10px_15px_-3px_rgba(234,179,8,0.6)]",
  },
  {
    id: 3,
    bgColor: "bg-green-200",
    title: "Have Great Day with Shanumart Tea 🐄!",
    code: "CARE12",
    img: adbanner2,
    link:"/category/684580bb5b1b7564a62a37ce",
    icon: <FaMugHot className="text-3xl text-green-700 mb-2" />,
    hoverShadow: "hover:shadow-[0_10px_15px_-3px_rgba(34,197,94,0.6)]",
  },
];

const PromoBanners = () => {
  const navigate = useNavigate();

  return (
    <section className="px-4 max-w-7xl mx-auto pt-2 pb-8 mt-[-24px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner, index) => {
          const Wrapper = index < 2 ? Zoom : Slide;
          const direction = index < 2 ? undefined : "right";

          return (
            <Wrapper key={banner.id} {...(direction ? { direction } : {})}>
              <div
                className={`relative ${banner.bgColor} rounded-xl shadow-lg overflow-hidden w-full flex flex-row items-stretch transition-all duration-500 ${banner.hoverShadow} hover:scale-[1.02]`}
              >
                {/* Text Content */}
                <div className="w-1/2 p-5 flex flex-col justify-center items-start text-left">
                  {banner.icon}
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 leading-snug">
                    {banner.title}
                  </h3>
                  <Link
                    to="#"
                    onClick={() => navigate(banner.link)}
                    className="bg-green-700 text-white px-4 py-2 rounded-full hover:bg-white hover:text-orange-300 transition-all duration-700"
                  >
                    Shop Now
                  </Link>
                </div>

                {/* Image Section */}
                <div className="w-1/2 h-48 sm:h-60 lg:h-auto">
                  <img
                    src={banner.img}
                    alt={`ad-banner-${banner.id}`}
                    className="w-full h-full object-contain rounded-r-xl"
                  />
                </div>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </section>
  );
};

export default PromoBanners;
