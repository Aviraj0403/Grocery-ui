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
    <section className="py-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {banners.map(
            ({ id, image, title, prompt, icon: Icon, gradient, accent, link }, index) => (
              <Slide key={id} direction={index % 2 === 0 ? "left" : "right"}>
                <div
                  onClick={() => navigate(link)}
                  className={`group relative cursor-pointer rounded-[2.5rem] overflow-hidden bg-gradient-to-br ${gradient} border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500`}
                >
                  <div className="relative flex flex-col sm:flex-row items-center gap-8 p-8 sm:p-12">
                    
                    {/* IMAGE */}
                    <div className="w-44 h-44 flex-shrink-0">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 text-center sm:text-left space-y-6">
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Icon className={`text-4xl ${accent}`} />
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                          {title}
                        </h3>
                      </div>

                      <p className="text-gray-600 text-lg leading-relaxed">
                        {prompt}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(link);
                        }}
                        className="inline-flex items-center gap-3 bg-gray-900 text-white font-bold px-8 py-3.5 rounded-full shadow-lg hover:bg-emerald-600 transition-all duration-300 transform active:scale-95"
                      >
                        Shop Now
                        <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </Slide>
            )
          )}
        </div>
    </section>
  );
};

export default BannerSection;
