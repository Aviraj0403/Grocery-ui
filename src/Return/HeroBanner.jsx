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
    <section className="relative text-center py-24 px-6 bg-gradient-to-br from-green-100 via-green-200 to-green-100 overflow-hidden rounded-b-3xl">

      {/* Grand Opening Badge */}
      {/* <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-green-900 font-bold px-6 py-2 rounded-full shadow-lg animate-bounce z-20">
        Grand Opening – 11 March 
      </div> */}

      {/* Flower Rain */}
      {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="flower flower1">🌸</div>
        <div className="flower flower2">🌼</div>
        <div className="flower flower3">🌺</div>
        <div className="flower flower4">🌹</div>
      </div> */}

      <div className="relative max-w-4xl mx-auto z-10">

        <h1 className="whitespace-nowrap overflow-hidden text-ellipsis text-[clamp(1.75rem,6vw,3.5rem)] font-extrabold text-green-900 mb-6 tracking-tight leading-tight drop-shadow-xl">
          <Slide direction="right">
            <span>
              Welcome to <span className="text-yellow-500">Shanu-</span>Mart 
            </span>
          </Slide>
        </h1>

        <p className="text-xl sm:text-2xl text-green-800 mb-10">
          {heroData.subtitle}
        </p>

        <Link to={heroData.buttonLink}>
          <button
            onClick={() => navigate(heroData.buttonLink)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-md transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_25px_rgba(34,197,94,0.5)]"
          >
            {heroData.buttonText} 🛒
          </button>
        </Link>
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