import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CategoryNav, { CATEGORIES_DATA } from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import { useProducts, CATEGORY_MAP } from '../context/ProductContext';
import { Tag, ArrowLeft, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const { categoryId } = useParams();
  const currentCatId = categoryId ? parseInt(categoryId, 10) : null;
  const { products, loading } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategoryObj = CATEGORIES_DATA.find((c) => c.id === currentCatId);

  // Filter products by category and search query instantly from memory
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!currentCatId) {
      return matchesSearch;
    }

    // Check if product belongs to this category or matching subcategories
    const matchingSubs = CATEGORY_MAP[currentCatId] || [];
    const matchesCategory =
      p.categoryId === currentCatId ||
      matchingSubs.includes(p.subcategoryId);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 1. Top Navbar */}
      <Navbar onSearch={setSearchQuery} />

      {/* 2. Category Nav (9 Icons across top) */}
      <CategoryNav activeId={currentCatId} />

      {/* 3. Category Banner Header (when a category is clicked) */}
      {activeCategoryObj && (
        <div className="bg-slate-100 border-b border-slate-200 py-3.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category:</span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">{activeCategoryObj.name}</h2>
              <span className="text-xs bg-white border border-slate-200 px-2.5 py-0.5 rounded-full font-bold text-slate-700 ml-1">
                {filteredProducts.length} Products
              </span>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >
              <ArrowLeft size={14} />
              <span>All Products</span>
            </Link>
          </div>
        </div>
      )}

      {/* 4. Product Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {loading && products.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="animate-spin text-blue-600" size={32} />
            <p className="text-slate-600 text-sm font-semibold">Loading live products from database...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-slate-50 rounded-2xl border border-slate-200 p-8 my-4">
            <Tag className="mx-auto text-slate-400 mb-3" size={36} />
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              No products found in "{activeCategoryObj ? activeCategoryObj.name : 'this category'}"
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              New inventory is arriving soon.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.productId} product={prod} />
            ))}
          </div>
        )}
      </main>

      {/* 5. Bottom Gray Container matching Image 1 wireframe */}
      <div className="bg-[#cbd5e1] h-64 sm:h-80 w-full mt-6"></div>
    </div>
  );
}
