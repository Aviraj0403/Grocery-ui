import React from "react";
import { Slide } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";
import { FaTooth, FaSoap, FaArrowRight } from "react-icons/fa";
import image1 from "../assets/Tooth2.png";
import image2 from "../assets/Surf1.png";

const BannerSection = () => {
  const navigate = useNavigate();

  const banners = [
    {
      id: 1,
      image: image1,
      title: "Keep Your Smile Bright",
      prompt: "Shine brighter every morning with premium teeth care essentials.",
      icon: FaTooth,
      gradient: "from-yellow-100 via-yellow-50 to-white",
      accent: "text-yellow-500",
      link: "/category/6868c7c91f4f1ee21d3fdba2",
    },
    {
      id: 2,
      image: image2,
      title: "Clean Clothes, Happy Home",
      prompt: "Powerful on stains, gentle on fabrics. Feel the freshness.",
      icon: FaSoap,
      gradient: "from-blue-100 via-blue-50 to-white",
      accent: "text-blue-500",
      link: "/category/684b1611bf7dd733103b0c0f",
    },
  ];

  return (
    <section className="py-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {banners.map(
            ({ id, image, title, prompt, icon: Icon, gradient, accent, link }, index) => (
              <Slide key={id} direction={index % 2 === 0 ? "left" : "right"}>
                <div
                  onClick={() => navigate(link)}
                  className={`group relative cursor-pointer rounded-3xl overflow-hidden
                  bg-gradient-to-br ${gradient}
                  border border-white/60 backdrop-blur-xl
                  shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]
                  hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)]
                  transition-all duration-500`}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-green-400/10 via-transparent to-green-400/10" />

                  <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
                    
                    {/* IMAGE */}
                    <div className="w-36 h-36 sm:w-44 sm:h-44 flex-shrink-0">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-contain
                        transition-transform duration-500
                        group-hover:scale-110 group-hover:-rotate-2"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 text-center sm:text-left space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <Icon className={`text-3xl sm:text-4xl ${accent}`} />
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
                          {title}
                        </h3>
                      </div>

                      <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
                        {prompt}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(link);
                        }}
                        className="inline-flex items-center gap-2
                        bg-green-600 hover:bg-green-700
                        text-white font-semibold
                        px-6 py-3 rounded-full
                        shadow-lg hover:shadow-xl
                        transition-all duration-300"
                      >
                        Shop Now
                        <FaArrowRight className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </Slide>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
