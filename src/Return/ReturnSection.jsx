import React from "react";
import { Zoom } from "react-awesome-reveal";
import { Link } from "react-router-dom";
import {
  FaUndoAlt,
  FaBoxOpen,
  FaTags,
  FaClock,
} from "react-icons/fa";

const ReturnSection = () => {
  const features = [
    {
      icon: <FaUndoAlt className="text-green-600 text-4xl mx-auto mb-4 transition-transform duration-300" />,
      title: "Easy Returns",
      description: (
        <>
          Not satisfied with a product? Return it at the doorstep & get a refund
          within hours. No questions asked{" "}
          <Link to="#!" className="text-green-600 underline">
            policy
          </Link>
          .
        </>
      ),
    },
    {
      icon: <FaBoxOpen className="text-green-600 text-4xl mx-auto mb-4 transition-transform duration-300" />,
      title: "Wide Assortment",
      description:
        "Choose from 5000+ products across food, personal care, household, bakery, veg and non-veg & other categories.",
    },
    {
      icon: <FaTags className="text-green-600 text-4xl mx-auto mb-4 transition-transform duration-300" />,
      title: "Best Prices & Offers",
      description:
        "Cheaper prices than your local supermarket, great cashback offers to top it off. Get best prices & offers.",
    },
    {
      icon: <FaClock className="text-green-600 text-4xl mx-auto mb-4 transition-transform duration-300" />,
      title: "10 Minute Grocery Now",
      description:
        "Get your order delivered to your doorstep at the earliest from FreshCart pickup stores near you.",
    },
  ];

  return (
    <section className="my-8 lg:my-14">
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {features.map((item, index) => (
            <Zoom key={index}>
              <div
                className="shadow-effect h-full flex flex-col items-center justify-start p-6 bg-white border border-green-400 rounded-xl
                  mobile-hover
                  transition-transform duration-300 ease-in-out
                  hover:scale-105 hover:shadow-2xl
                  cursor-pointer"
              >
                <div className="w-20 h-20 mx-auto flex items-center justify-center
                  hover:animate-bounce"
                >
                  {item.icon}
                </div>
                <div className="icon-content">
                  <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </Zoom>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReturnSection;
