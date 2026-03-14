import React, { useEffect, useState, useRef } from 'react';
import { getAllProducts } from '../../services/productApi';
import { getMainCategories } from '../../services/categoryApi';
import ProductCard from './ProductCard';
import CategoryCard from '../category/CategoryCard';
import Skeleton from 'react-loading-skeleton';
import { useSearch } from '../../context/SearchContext';
import 'react-loading-skeleton/dist/skeleton.css';

const perPage = 20;

const ProductGrid = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // ✅ restore category from sessionStorage
  const [selectedCat, setSelectedCat] = useState(
    sessionStorage.getItem("selectedCategory") || "All"
  );

  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const filterSearchRef = useRef(null);

  // ✅ Restore scroll position
  useEffect(() => {
    const savedPosition = sessionStorage.getItem("productScroll");

    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedPosition),
          behavior: "smooth"
        });
      }, 200);

      sessionStorage.removeItem("productScroll");
    }
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {

      const { products: prodData, pagination } = await getAllProducts({
        page,
        limit: perPage,
        search: searchQuery,
        category: selectedCat !== 'All' ? selectedCat : '',
      });

      let sorted = [...prodData];

      if (sortBy === 'priceLow') {
        sorted.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
      } 
      else if (sortBy === 'priceHigh') {
        sorted.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
      } 
      else if (sortBy === 'rating') {
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }

      setProducts(sorted);
      setTotalPages(pagination.totalPages || 1);

    } catch (err) {
      console.error('Error fetching products:', err);
    }

    setLoading(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const catData = await getMainCategories();
      setCategories(catData.filter((c) => c.isActive));
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCat, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCat, sortBy, searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // ✅ updated function
  const handleCategoryClick = (catId) => {

    setSelectedCat(catId);

    // category save karo
    sessionStorage.setItem("selectedCategory", catId);

    setPage(1);

    if (filterSearchRef.current) {
      filterSearchRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">

      {/* Categories Scroller */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Browse <span className="text-emerald-600">Categories</span></h3>
        </div>
        
        <div className="flex flex-nowrap overflow-x-auto gap-6 sm:gap-8 pb-4 scrollbar-hide px-2">
          <div onClick={() => handleCategoryClick('All')} className="flex-shrink-0">
            <CategoryCard
              name="All"
              img="https://cdn-icons-png.flaticon.com/512/2352/2352165.png" // Updated to a cleaner grid/all icon
              isSelected={selectedCat === 'All'}
            />
          </div>

          {categories.map((cat) => (
            <div key={cat._id} onClick={() => handleCategoryClick(cat._id)} className="flex-shrink-0">
              <CategoryCard
                name={cat.name}
                img={cat.image[0]}
                isSelected={selectedCat === cat._id}
              />
            </div>
          ))}
        </div>

        {/* CSS for hiding scrollbar but keeping scroll functionality */}
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}
        </style>
      </section>

      {/* Filter + Search */}
      <div ref={filterSearchRef} className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">

        <div className="relative w-full lg:w-1/2">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner"
            placeholder="Search thousands of products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex w-full lg:w-auto gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 lg:w-48 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-gray-700"
          >
            <option value="">Sort By: Default</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">

        {loading
          ? Array(perPage).fill(0).map((_, i) =>
              <Skeleton key={i} height={250} className="rounded-lg" />
            )
          : products.map((product) =>
              <ProductCard key={product._id} product={product} />
            )
        }

      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">

          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            ◀ Previous
          </button>

          <span className="text-gray-600 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >
            Next ▶
          </button>

        </div>
      )}

    </div>
  );
};

export default ProductGrid;