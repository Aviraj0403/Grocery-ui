import React from "react";
import { Slide, Zoom } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";
import { FaSprayCan, FaLeaf, FaMugHot } from "react-icons/fa";

import adbanner from "../assets/dio1.png";
import adbanner1 from "../assets/skin4.png";
import adbanner2 from "../assets/lal1.png";

const banners = [
  {
    id: 1,
    bgColor: "bg-orange-200",
    title: "Smell Great with Shanumart Deals!",
    cashback: "Max cashback: 2%",
    code: "CARE02",
    img: adbanner,
    link: "/category/696232d098494c2decd6fa0e",
    icon: <FaSprayCan className="text-3xl text-orange-600 mb-2" />,
    hoverShadow: "hover:shadow-[0_10px_15px_-3px_rgba(255,115,0,0.6)]",
  },
  {
    id: 2,
    bgColor: "bg-yellow-200",
    title: "Glow Naturally Shop Skincare at Shanumart!",
    img: adbanner1,
    link: "/category/68474771cace49c52299e5d2",
    icon: <FaLeaf className="text-3xl text-yellow-700 mb-2" />,
    hoverShadow: "hover:shadow-[0_10px_15px_-3px_rgba(234,179,8,0.6)]",
  },
  {
    id: 3,
    bgColor: "bg-green-200",
    title: "Protect Your Baby With ShanuMart👶!",
    code: "CARE12",
    img: adbanner2,
    link: "/category/684dc41ff21525212b194334",
    icon: <FaMugHot className="text-3xl text-green-700 mb-2" />,
    hoverShadow: "hover:shadow-[0_10px_15px_-3px_rgba(34,197,94,0.6)]",
  },
];

const PromoBanners = () => {
  const navigate = useNavigate();

  const handleClick = (link) => {
    // scroll position save
    sessionStorage.setItem("scrollPosition", window.scrollY);

    navigate(link);
  };

  return (
    <section className="px-4 py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {banners.map((banner, index) => {
          const Wrapper = Zoom;

          return (
            <Wrapper key={banner.id}>
              <div
                className={`relative ${banner.bgColor} rounded-3xl shadow-sm overflow-hidden flex flex-row items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border border-white/50`}
              >
                {/* Text Content */}
                <div className="w-1/2 p-6 z-10">
                  <div className="p-2 bg-white/50 rounded-lg w-fit mb-3">
                    {banner.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                    {banner.title}
                  </h3>
                  <button
                    onClick={() => handleClick(banner.link)}
                    className="bg-gray-900 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-emerald-600 transition-colors shadow-sm"
                  >
                    Shop Now
                  </button>
                </div>

                {/* Image Section */}
                <div className="w-1/2 flex justify-end items-center h-full pr-2">
                  <img
                    src={banner.img}
                    alt={banner.title}
                    className="w-full h-40 object-contain group-hover:scale-110 transition-transform duration-500"
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