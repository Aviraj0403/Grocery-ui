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
    <section className="relative text-center -mt-8 py-12 px-4 rounded-b-3xl">
      <div className="max-w-8xl mx-auto">
        <Slide direction="down">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col lg:flex-row items-center text-center lg:text-left space-y-6 lg:space-y-0 lg:space-x-10 w-full max-w-6xl mx-auto">
            
            {/* Image */}
            <div className="flex-shrink-0 ">
              <img
                src={aboutimg}
                alt="about-icon"
                className="w-32 h-32 object-contain mx-auto lg:mx-0"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center items-center lg:items-start space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-green-800 mb-2">
                  Welcome to <span className="text-yellow-500">Shanu-</span>Mart
                </h1>

                <p className="text-lg text-green-700 max-w-xl">
                  Order Delicious Biscuits from ShanuMart , & Get ₹50 Off
                  
                </p>
              </div>

              <button
                onClick={handleClick}
                className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md"
              >
                Grab Your First Order Here
              </button>

            </div>
          </div>
        </Slide>
      </div>
    </section>
  );
};

export default WelcomeSection;