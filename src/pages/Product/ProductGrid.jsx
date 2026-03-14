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
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Categories */}
      <section className="mb-4">
        <div className="flex flex-wrap gap-4 justify-center">

          <div onClick={() => handleCategoryClick('All')}>
            <CategoryCard
              name="All"
              img="/path/to/default-all-icon.png"
              isSelected={selectedCat === 'All'}
            />
          </div>

          {categories.map((cat) => (
            <div key={cat._id} onClick={() => handleCategoryClick(cat._id)}>
              <CategoryCard
                name={cat.name}
                img={cat.image[0]}
                isSelected={selectedCat === cat._id}
              />
            </div>
          ))}

        </div>
      </section>

      {/* Filter + Search */}
      <div ref={filterSearchRef} className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm">

        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Filter By</option>
          <option value="priceLow">Price: Low → High</option>
          <option value="priceHigh">Price: High → Low</option>
          <option value="rating">Rating</option>
        </select>

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