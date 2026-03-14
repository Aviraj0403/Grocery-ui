import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/Axios";
import ProductCard from "../Product/ProductCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/getCategoryDetails/${categoryId}`);
        setSubcategories(res.data.subcategories);
        setAllProducts(res.data.products);
        setFilteredProducts(res.data.products);
        setCategoryName(res.data.categoryName || "Category");
      } catch (error) {
        console.error("Error fetching category details", error);
      }
      setLoading(false);
    };

    fetchCategoryData();
  }, [categoryId]);

  const handleSubcategoryClick = (subId) => {
    setSelectedSubcategoryId(subId);
    if (subId === "All") {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(
        (product) => product.subCategory === subId
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Premium Category Header */}
      <div className="relative py-20 px-6 bg-gradient-to-br from-emerald-600 to-emerald-800 overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl -ml-24 -mb-24"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white capitalize mb-4 tracking-tight">
            {categoryName || "Our Collection"}
          </h1>
          <div className="w-24 h-1.5 bg-yellow-400 mx-auto rounded-full mb-6"></div>
          <p className="text-emerald-50 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Exploring the finest selection of <span className="text-yellow-400 font-bold">{categoryName}</span> curated just for you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-10">
        
        {/* Subcategories Sidebar / Mobile Scroller */}
        <aside className="w-full lg:w-72 lg:shrink-0">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 sticky top-4">
            <h2 className="text-xl font-bold mb-6 text-gray-900 border-b border-gray-100 pb-3">Subcategories</h2>
            
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
              {/* All option */}
              <button
                onClick={() => handleSubcategoryClick("All")}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl border transition-all duration-300 min-w-max lg:w-full group ${
                  selectedSubcategoryId === "All"
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-gray-50 border-transparent text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${
                  selectedSubcategoryId === "All" ? "bg-white/20 text-white" : "bg-white text-emerald-600"
                }`}>
                  A
                </div>
                <span className="font-bold">All Products</span>
              </button>

              {/* Subcategories list */}
              {subcategories.map((sub) => (
                <button
                  key={sub._id}
                  onClick={() => handleSubcategoryClick(sub._id)}
                  className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl border transition-all duration-300 min-w-max lg:w-full group ${
                    selectedSubcategoryId === sub._id
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200"
                      : "bg-gray-50 border-transparent text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-white p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={sub.image?.[0] || "https://via.placeholder.com/40"}
                      alt={sub.name}
                      className="w-full h-full object-contain"
                      onError={(e) => (e.target.src = "https://cdn-icons-png.flaticon.com/512/3013/3013941.png")}
                    />
                  </div>
                  <span className="font-bold">{sub.name}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-gray-900">
              Showing <span className="text-emerald-600">{filteredProducts.length}</span> Results
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
              Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100">
                  <Skeleton height={200} className="rounded-2xl" />
                  <Skeleton count={2} className="mt-4" />
                </div>
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-300">
                <div className="text-5xl mb-4">📦</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">No products found</h4>
                <p className="text-gray-500">Try selecting a different subcategory or check back later.</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product._id} className="transition-all duration-300 hover:-translate-y-2">
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>
    </div>
  );
};

export default CategoryPage;
