import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import ProductGrid from "../Product/ProductGrid.jsx";
import CategoriesSection from "../category/CategoriesSection.jsx";
import { Slide, Zoom } from "react-awesome-reveal";
// import abouticon from "../assets/about.svg";
// import aboutImage from "../../assets/about.svg";

import ChatWidget from "./ChatWidget"; // adjust path if needed

// import { Zoom } from "react-toastify";
import {
  FaEye,
  FaHeart,
  FaMoneyBillAlt,
  FaStar,
  FaTag,
  FaUndoAlt,
} from "react-icons/fa";
import Slider from "react-slick";
import coffe from "../../assets/cooffe.jpg";
import returnn from "../../assets/returns.svg";
import mobile from "../../assets/mobile.svg";
import price from "../../assets/price.svg";
import time from "../../assets/time.svg";
import mobileBanner from "../../assets/banner-mobile.jpg";
import desktopBanner from "../../assets/banner1.png";
import ReturnSection from "../../Return/ReturnSection.jsx";
import BannerSection from "../../Return/BannerSection.jsx";
import HeroBanner from "../../Return/HeroBanner.jsx";
import FeatureStrip from "../../Return/FeatureStrip.jsx";
import StayUpdated from "../../Return/StayUpdated.jsx";
import PromoBanners from "../../Return/PromoBanners.jsx";
import WelcomeSection from "../../Return/WelcomeSection.jsx";

// import logo from '..\assets\logo2.png'


const Home = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    setLoading(true);
    setTimeout(() => navigate("/arrivals"), 500);
  };
   
   useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");

    if (savedPosition) {
      window.scrollTo({
        top: parseInt(savedPosition),
        behavior: "smooth",
      });

      sessionStorage.removeItem("scrollPosition");
    }
  }, []);

   useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");

    if (savedPosition) {
      window.scrollTo({
        top: parseInt(savedPosition),
        behavior: "smooth",
      });

      sessionStorage.removeItem("scrollPosition");
    }
  }, []);


  return (
    <div className="bg-gray-50">
      {/* Hero Banner */}

      <HeroBanner />

      {/* return section */}

      <FeatureStrip />

      {/* grab first offer*/}
      {/* relative bg-green-100 text-center py-16 px-4 rounded-b-3xl */}
    <WelcomeSection/>


      {/* cashback and offer section */}
    
      {/* Categories Preview */}

      {/* <CategoriesSection /> */}

      {/* featured products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Featured Products
        </h2>

        <ProductGrid />
      </section>

 <PromoBanners/>
      {/* shop now */}

      <BannerSection />
      {/* return critaria */}

    

      {/* <h1>add here some banner attractive</h1> */}

      <Slide direction="right">
      <section className="w-full bg-gradient-to-r from-[#F3F7F5] via-white to-[#F3F7F5] py-10">
  <div className="max-w-7xl mx-auto px-4">

    <div className="relative rounded-2xl bg-white shadow-lg overflow-hidden">

      {/* Mobile Banner */}
      <img
        src={mobileBanner}
        alt="Mobile Banner"
        className="w-full h-auto sm:hidden"
      />

      {/* Desktop Banner */}
      <div className="hidden sm:grid grid-cols-2 items-center gap-10 
        h-[380px] md:h-[420px] px-12
        bg-gradient-to-r from-gray-100 via-white to-gray-100">

        {/* LEFT CONTENT */}
        <div className="space-y-5">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Get Fresh Groceries <br />
            <span className="text-emerald-600">At Your Doorstep</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-md">
            Daily essentials, farm-fresh vegetables, and quality products
            delivered fast & safely to your home.
          </p>

          <button className="inline-flex items-center gap-2 
            bg-emerald-600 text-white px-7 py-3 rounded-full 
            font-semibold shadow-md
            hover:bg-emerald-700 hover:shadow-lg transition-all">
            Subscribe Now
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center items-center h-full">
          <img
            src={desktopBanner}
            alt="Desktop Banner"
            className="max-h-full max-w-full object-contain"
          />
        </div>

      </div>

    </div>
  </div>
</section>

      </Slide>

 <ReturnSection />
      {/* <div className="scroll-to-top bg-green-500">
    <button className="scroll-to-top-button show">↑</button>
  </div> 

      {/* Call to Action */}
      <StayUpdated/>
      <ChatWidget />
    </div>
  );
};

export default Home;
