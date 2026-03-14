import React from "react";
import { Slide } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";
import aboutimg from "../assets/about.svg"
const WelcomeSection = ({ aboutImage }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Save scroll position
    sessionStorage.setItem("scrollPosition", window.scrollY);

    navigate("/category/696512d898494c2decd6fdec");
  };

  return (
    <section className="relative px-4">
      <div className="max-w-7xl mx-auto">
        <Slide direction="up">
          <div className="bg-emerald-600 rounded-[2rem] shadow-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-10 overflow-hidden relative group">
            
            {/* Background Decorative Rings */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-700 rounded-full -ml-10 -mb-10 opacity-50"></div>

            {/* Image container with glass effect */}
            <div className="flex-shrink-0 z-10 p-6 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
              <img
                src={aboutimg}
                alt="Welcome to ShanuMart"
                className="w-40 h-40 object-contain drop-shadow-2xl"
              />
            </div>

            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left z-10">
              <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 leading-tight">
                New to <span className="text-yellow-400 underline decoration-yellow-400/30 underline-offset-8">Shanu-</span>Mart?
              </h2>

              <p className="text-xl text-emerald-50 mb-8 max-w-xl font-medium leading-relaxed">
                Experience the freshest reach! Order premium groceries today and get <span className="text-yellow-400 font-extrabold">₹50 OFF</span> on your first order.
              </p>

              <button
                onClick={handleClick}
                className="bg-white text-emerald-700 text-lg font-bold px-10 py-4 rounded-full shadow-lg hover:bg-yellow-400 hover:text-emerald-900 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 mx-auto lg:mx-0"
              >
                Claim First Order Discount 🎁
              </button>
            </div>
          </div>
        </Slide>
      </div>
    </section>
  );
};

export default WelcomeSection;