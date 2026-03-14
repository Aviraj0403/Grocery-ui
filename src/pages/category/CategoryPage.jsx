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
    <div className="min-h-screen bg-gray-50 px-6 py-10 md:py-14">
      {/* Category Heading */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 capitalize relative inline-block pb-3">
          {categoryName || "Category"}
          <span className="block absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-green-500 rounded-full"></span>
        </h1>
        <p className="mt-3 text-gray-600 text-lg">
          Discover the best products under{" "}
          <strong className="text-green-600">{categoryName}</strong>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-8">
        {/* Sidebar - Subcategories */}
        <aside className="w-full lg:w-64">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Subcategories</h2>
            <div className="overflow-x-auto lg:overflow-visible">
              <div className="flex lg:flex-col gap-4 min-w-max lg:min-w-full">
                {/* All option */}
                <button
                  onClick={() => handleSubcategoryClick("All")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md border transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                    selectedSubcategoryId === "All"
                      ? "bg-green-100 border-green-500 shadow-md"
                      : "bg-white border-gray-200 hover:shadow hover:bg-gray-50"
                  }`}
                >
                  <img
                    src="https://via.placeholder.com/40?text=All"
                    alt="All"
                    className="w-10 h-10 object-cover rounded-full"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/40?text=All")}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">All</span>
                </button>

                {/* Subcategories */}
                {subcategories.map((sub) => (
                  <button
                    key={sub._id}
                    onClick={() => handleSubcategoryClick(sub._id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md border transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                      selectedSubcategoryId === sub._id
                        ? "bg-green-100 border-green-500 shadow-md"
                        : "bg-white border-gray-200 hover:shadow hover:bg-gray-50"
                    }`}
                  >
                    <img
                      src={sub.image?.[0] || "https://via.placeholder.com/40?text=IMG"}
                      alt={sub.name}
                      className="w-10 h-10 object-cover rounded-full"
                      onError={(e) => (e.target.src = "https://via.placeholder.com/40?text=IMG")}
                    />
                    <span className="text-sm font-medium whitespace-nowrap">{sub.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading
              ? Array(12)
                  .fill(0)
                  .map((_, i) => <Skeleton key={i} height={280} className="rounded-lg" />)
              : filteredProducts.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full mt-10">
                  No products found in this subcategory.
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="transform hover:scale-[1.03] transition-transform duration-300"
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
