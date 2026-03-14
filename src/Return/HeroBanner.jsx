import React, { useEffect } from "react";
import { Slide } from "react-awesome-reveal";
import { Link, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const heroData = {
  title: "Welcome to Shanu-Mart",
  subtitle:
    " Grand Opening Today! Discover fresh groceries, daily deals, and quick delivery — all at your doorstep!",
  buttonText: "Start Shopping",
  buttonLink: "",
};

const HeroBanner = () => {
  const navigate = useNavigate();

  // Confetti effect
  useEffect(() => {
    const duration = 4000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 8,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative text-center pt-8 pb-16 px-6 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 overflow-hidden border-b border-emerald-100">
      
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl -ml-20 -mt-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-100/40 rounded-full blur-3xl -mr-32 -mb-32"></div>

      <div className="relative z-10">
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold tracking-wide uppercase">
            🚀 Grand Opening deals
          </span>
        </div>

        <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-black text-gray-900 mb-8 tracking-tighter leading-[1.1]">
          <Slide direction="up">
            <div>
              Smart Way to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-yellow-500">
                Shop Groceries
              </span>
            </div>
          </Slide>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          {heroData.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={heroData.buttonLink}>
            <button
              className="group relative bg-emerald-600 text-white px-10 py-4 text-lg font-bold rounded-full shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              Explore Products
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </Link>
          <button className="px-8 py-4 text-lg font-semibold text-gray-600 hover:text-emerald-600 transition-colors">
            View Offers
          </button>
        </div>
      </div>

      {/* CSS inside component */}
      <style>
        {`
        .flower {
          position: absolute;
          top: -10vh;
          font-size: 30px;
          animation: fall linear infinite;
        }

        .flower1 {
          left: 10%;
          animation-duration: 6s;
        }

        .flower2 {
          left: 30%;
          animation-duration: 8s;
        }

        .flower3 {
          left: 60%;
          animation-duration: 7s;
        }

        .flower4 {
          left: 85%;
          animation-duration: 9s;
        }

        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }
        `}
      </style>

    </section>
  );
};

export default HeroBanner;