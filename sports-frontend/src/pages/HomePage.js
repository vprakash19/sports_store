import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CategoryNav, { CATEGORIES_DATA } from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import api from '../api/api';
import { Tag, ArrowLeft, RefreshCw } from 'lucide-react';

// Maps Category IDs to their database Subcategory IDs
const CATEGORY_MAP = {
  1: [4, 5, 7],      // Sports Equipment
  2: [6, 8, 9],      // Gym Equipment
  3: [10, 11, 12],   // Fitness Nutrition
  4: [3, 13, 14],    // Sportswear
  5: [1, 2, 15],     // Sports Footwear
  6: [16, 17, 18],   // Sports Accessories
  7: [19, 20, 21],   // Yoga and Wellness
  8: [22, 23, 24],   // Outdoor Sports
  9: [25, 26, 27]    // Protective Gear
};

// Realistic product images based on subcategory / category
const getProductImage = (subcategoryId, index) => {
  const imagesBySub = {
    // 1: Sports Equipment
    4: "https://images.unsplash.com/photo-1531415074868-036b1c5d53ec?w=400&q=80", // Cricket Bat
    5: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=400&q=80", // Football
    7: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80", // Paddle / Racket
    // 2: Gym Equipment
    6: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80", // Dumbbells
    8: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80", // Bench / Barbell
    9: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&q=80", // Resistance Bands
    // 3: Fitness Nutrition
    10: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&q=80", // Whey Protein
    11: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80", // Creatine
    12: "https://images.unsplash.com/photo-1622484216835-15d2a93902f5?w=400&q=80", // Energy Bar
    // 4: Sportswear
    3: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80", // Jersey
    13: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&q=80", // Shorts / Pants
    14: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80", // Compression Tights
    // 5: Sports Footwear
    1: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", // Running Shoes
    2: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&q=80", // Football Boots
    15: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&q=80", // Basketball Shoes
    // 6: Sports Accessories
    16: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80", // Water Bottle
    17: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", // Gym Bag
    18: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80", // Sweatband
    // 7: Yoga and Wellness
    19: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&q=80", // Yoga Mat
    20: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=400&q=80", // Foam Roller
    21: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80", // Yoga Block
    // 8: Outdoor Sports
    22: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80", // Trekking Bag
    23: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=400&q=80", // Cycling Helmet
    24: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=80", // Swim Goggles
    // 9: Protective Gear
    25: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=400&q=80", // Knee Guards
    26: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80", // Helmet
    27: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&q=80"  // Shin Guards
  };

  return imagesBySub[subcategoryId] || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400&q=80";
};

export default function HomePage() {
  const { categoryId } = useParams();
  const currentCatId = categoryId ? parseInt(categoryId, 10) : null;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategoryObj = CATEGORIES_DATA.find((c) => c.id === currentCatId);

  useEffect(() => {
    setLoading(true);
    // Fetch live products and variants from Render backend
    Promise.all([
      api.get('/products'),
      api.get('/variants').catch(() => ({ data: [] }))
    ])
      .then(([prodRes, varRes]) => {
        const variantsList = varRes.data || [];

        if (prodRes.data && prodRes.data.length > 0) {
          const formatted = prodRes.data.map((p, idx) => {
            // Find variant price if available
            const matchingVariant = variantsList.find((v) => v.productId === p.productId);
            const currentPrice = matchingVariant ? matchingVariant.price : (p.price || 4999);
            const originalPrice = matchingVariant && matchingVariant.discountPrice 
              ? matchingVariant.discountPrice 
              : Math.round(currentPrice * 1.25);

            return {
              ...p,
              price: currentPrice,
              originalPrice: originalPrice,
              discountPercent: 20,
              image: getProductImage(p.subcategoryId, idx)
            };
          });
          setProducts(formatted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // Filter products by category and search query
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
        {loading ? (
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
