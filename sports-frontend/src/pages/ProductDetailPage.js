import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useUser } from '../context/UserContext';
import { Check, Star, RefreshCw, Heart, Send, CheckCircle2 } from 'lucide-react';
import api from '../api/api';

// Fallback images according to subcategory if none are in database
const getFallbackImage = (subcategoryId) => {
  const map = {
    // Equipment
    4: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80", // Cricket Bat
    5: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600&q=80", // Football
    7: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80", // Paddle
    // Gym
    6: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80", // Dumbbells
    8: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80", // Bench / Barbell
    9: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&q=80", // Resistance Bands
    // Nutrition
    10: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&q=80", // Whey
    11: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80", // Creatine
    12: "https://images.unsplash.com/photo-1606149059549-6042addafc5a?w=600&q=80", // Energy Bar
    // Sportswear
    3: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80", // Jersey
    13: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80", // Shorts
    14: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80", // Compression
    // Footwear
    1: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", // Running Shoe
    2: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&q=80", // Football Studs
    15: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80", // Basketball Shoe
    // Accessories
    16: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80", // Bottle
    17: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", // Bag
    18: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80", // Sweatband
    // Yoga
    19: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80", // Yoga Mat
    20: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=600&q=80", // Foam Roller
    21: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80", // Yoga Prop
    // Outdoor
    22: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80", // Backpack
    23: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&q=80", // Helmet
    24: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&q=80", // Goggles
    // Protective
    25: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=600&q=80", // Knee Guards
    26: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80", // Helmet
    27: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80"  // Shin Guards
  };
  return map[subcategoryId] || "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80";
};

const COLOR_OPTIONS = [
  { name: 'Default', hex: '#1e293b' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Navy', hex: '#1e3a8a' },
  { name: 'Volt Lime', hex: '#bef264' }
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { customerId } = useUser();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [brandName, setBrandName] = useState('SPORTS');
  const [selectedImg, setSelectedImg] = useState('');
  const [galleryImages, setGalleryImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [sizeOptions, setSizeOptions] = useState(['Standard']);
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [price, setPrice] = useState(4999);
  const [originalPrice, setOriginalPrice] = useState(6299);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  
  // Inventory State
  const [stockInfo, setStockInfo] = useState({ available: 25, status: 'In Stock' });

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Fetch product, brand, variants, and product images concurrently
    Promise.all([
      api.get(`/products/${id}`),
      api.get('/brands').catch(() => ({ data: [] })),
      api.get(`/variants/product/${id}`).catch(() => ({ data: [] })),
      api.get(`/product-images/product/${id}`).catch(() => ({ data: [] }))
    ])
      .then(([prodRes, brandsRes, varsRes, imgsRes]) => {
        const prodData = prodRes.data;
        setProduct(prodData);

        // 1. Resolve Brand Name
        const allBrands = brandsRes.data || [];
        const foundBrand = allBrands.find((b) => b.brandId === prodData.brandId);
        const bName = foundBrand ? foundBrand.brandName.toUpperCase() : 'SPORTS';
        setBrandName(bName);

        // 2. Resolve Product Images
        const dbImages = imgsRes.data || [];
        let gallery = [];
        if (dbImages.length > 0) {
          gallery = dbImages.map((img) => img.imageUrl);
        } else {
          const baseImg = getFallbackImage(prodData.subcategoryId);
          gallery = [baseImg];
        }
        setGalleryImages(gallery);
        setSelectedImg(gallery[0]);

        // 3. Resolve Variants, Sizes & Pricing
        const vars = varsRes.data || [];
        setVariants(vars);

        if (vars.length > 0) {
          const distinctSizes = [...new Set(vars.map((v) => v.sizeLabel).filter(Boolean))];
          const finalSizes = distinctSizes.length > 0 ? distinctSizes : ['Standard'];
          setSizeOptions(finalSizes);
          setSelectedSize(finalSizes[0]);

          const initialVar = vars[0];
          const currPrice = Number(initialVar.price) || 4999;
          const origPrice = initialVar.discountPrice ? Number(initialVar.discountPrice) : Math.round(currPrice * 1.25);
          setPrice(currPrice);
          setOriginalPrice(origPrice);

          // Check inventory for initial variant
          if (initialVar.variantId) {
            api.get(`/inventory/variant/${initialVar.variantId}`)
              .then((invRes) => {
                if (invRes.data && invRes.data.quantityAvailable !== undefined) {
                  setStockInfo({
                    available: invRes.data.quantityAvailable,
                    status: invRes.data.quantityAvailable > 0 ? 'In Stock' : 'Out of Stock'
                  });
                }
              })
              .catch(() => {});
          }
        } else {
          setSizeOptions(['Standard']);
          setSelectedSize('Standard');
          setPrice(prodData.price || 4999);
          setOriginalPrice(Math.round((prodData.price || 4999) * 1.25));
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading product:", err);
        setLoading(false);
      });

    // Fetch Product Reviews from Backend API
    setReviewsLoading(true);
    api.get(`/reviews/product/${id}`)
      .then((res) => {
        setReviews(res.data || []);
      })
      .catch((e) => {
        console.error("Error fetching reviews:", e);
        setReviews([]);
      })
      .finally(() => setReviewsLoading(false));

    // Fetch Recommended Products
    api.get('/products')
      .then((res) => {
        if (res.data) {
          const others = res.data.filter((p) => p.productId !== Number(id)).slice(0, 12);
          const formatted = others.map((p, idx) => ({
            ...p,
            price: p.price || (idx % 2 === 0 ? 12999 : 23500),
            originalPrice: p.originalPrice || (idx % 2 === 0 ? 15999 : 26500),
            discountPercent: 20,
            image: getFallbackImage(p.subcategoryId)
          }));
          setRecommendedProducts(formatted);
        }
      })
      .catch(() => {});
  }, [id]);

  // When user switches size, update price & inventory
  const handleSizeChange = (newSize) => {
    setSelectedSize(newSize);
    const matchingVar = variants.find((v) => v.sizeLabel === newSize);
    if (matchingVar) {
      if (matchingVar.price) {
        const p = Number(matchingVar.price);
        setPrice(p);
        setOriginalPrice(matchingVar.discountPrice ? Number(matchingVar.discountPrice) : Math.round(p * 1.25));
      }
      if (matchingVar.variantId) {
        api.get(`/inventory/variant/${matchingVar.variantId}`)
          .then((invRes) => {
            if (invRes.data && invRes.data.quantityAvailable !== undefined) {
              setStockInfo({
                available: invRes.data.quantityAvailable,
                status: invRes.data.quantityAvailable > 0 ? 'In Stock' : 'Out of Stock'
              });
            }
          })
          .catch(() => {});
      }
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        ...product,
        brandName: brandName,
        price: price,
        originalPrice: originalPrice,
        image: selectedImg
      },
      {
        size: selectedSize,
        color: selectedColor.name
      }
    );
    alert(`Added "${product.productName}" (${selectedSize}) to your Cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(
      {
        ...product,
        brandName: brandName,
        price: price,
        originalPrice: originalPrice,
        image: selectedImg
      },
      {
        size: selectedSize,
        color: selectedColor.name
      }
    );
    navigate('/cart');
  };

  // Submit Review to Backend API
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    setSubmittingReview(true);
    try {
      const payload = {
        customerId: customerId || 1,
        productId: Number(id),
        rating: Number(newRating),
        reviewText: newReviewText.trim()
      };
      const res = await api.post('/reviews', payload);
      setReviews((prev) => [res.data, ...prev]);
      setNewReviewText('');
      alert('Thank you! Your review has been submitted.');
    } catch (err) {
      console.error('Error submitting review:', err);
      // Fallback local addition if network fails
      const fallbackRev = {
        reviewId: Date.now(),
        customerId: customerId || 1,
        productId: Number(id),
        rating: Number(newRating),
        reviewText: newReviewText.trim(),
        reviewDate: new Date().toISOString()
      };
      setReviews((prev) => [fallbackRev, ...prev]);
      setNewReviewText('');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Calculate Average Rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : '4.5';

  const isWishlisted = isInWishlist(Number(id));

  // Dynamic label based on product type
  const isNutrition = product && (product.subcategoryId === 10 || product.subcategoryId === 11 || product.subcategoryId === 12);
  const isApparel = product && (product.subcategoryId === 3 || product.subcategoryId === 13 || product.subcategoryId === 14);
  const isFootwear = product && (product.subcategoryId === 1 || product.subcategoryId === 2 || product.subcategoryId === 15);
  const sizeHeading = isNutrition ? 'Select Weight / Pack' : isApparel || isFootwear ? 'Select Size' : 'Select Option';

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
        <p className="text-slate-600 text-sm font-semibold">Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 1. Navbar */}
      <Navbar />

      {/* 2. Top Category Bar */}
      <CategoryNav />

      {/* 3. Main Product Details (Image 2) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column: Gallery Thumbnails + Big Preview (5 cols) */}
          <div className="md:col-span-5 flex gap-4">
            {/* Vertical Thumbnails */}
            <div className="flex flex-col gap-3">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(imgUrl)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 overflow-hidden p-1 transition ${
                    selectedImg === imgUrl ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Main Preview Inside Rounded Border Container */}
            <div className="flex-1 aspect-square rounded-2xl border-4 border-slate-300 p-6 flex items-center justify-center bg-white shadow-xs relative">
              <img
                src={selectedImg}
                alt={product.productName}
                className="max-h-full max-w-full object-contain drop-shadow-md transition-all duration-300"
              />
              {/* Wishlist Button on Preview */}
              <button
                onClick={() => toggleWishlist(Number(id))}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full border flex items-center justify-center transition shadow-xs ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-slate-300 text-slate-400 hover:text-rose-600 hover:border-rose-300'
                }`}
                title={isWishlisted ? "In Wishlist" : "Save to Wishlist"}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </div>

          {/* Right Column: Title, Details, Colors, Sizes & Buttons (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-start pl-0 md:pl-4">
            {/* Brand, Id & Warranty Header */}
            <div className="flex items-center gap-4 flex-wrap mb-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                {brandName}
              </h1>
              <span className="text-sm font-semibold text-slate-500">
                Id: SKU-{product.productId}092
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <Check size={14} className="stroke-[3]" />
                2 Years Warranty
              </span>
              {/* Live Inventory Stock Badge from Backend */}
              <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                <CheckCircle2 size={14} />
                {stockInfo.status} ({stockInfo.available} in stock)
              </span>
            </div>

            {/* Product Title */}
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-snug mb-3">
              {product.productName}
            </h2>

            {/* Star Rating & Review Count */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    fill={star <= Math.round(Number(avgRating)) ? "currentColor" : "none"}
                    className={star <= Math.round(Number(avgRating)) ? "text-amber-400" : "text-slate-300"}
                  />
                ))}
              </div>
              <span className="font-bold text-sm text-slate-800">{avgRating}</span>
              <a
                href="#reviews-section"
                className="text-sm text-slate-500 font-medium underline cursor-pointer hover:text-blue-600"
              >
                {reviews.length} reviews
              </a>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-2xl font-black text-slate-900">
                MRP ₹ {price.toLocaleString('en-IN')}
              </span>
              {originalPrice > price && (
                <span className="text-sm font-semibold text-slate-400 line-through">
                  ₹ {originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Color Swatches */}
            <div className="mb-5">
              <div className="text-sm font-bold text-slate-800 mb-2">
                Colour : <span className="font-normal text-slate-600">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full transition-transform shadow-xs ${
                      selectedColor.name === c.name ? 'ring-3 ring-offset-2 ring-slate-800 scale-110' : 'hover:scale-105'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic Size / Option Selector */}
            <div className="mb-7">
              <div className="flex items-center justify-between max-w-sm mb-2">
                <span className="text-sm font-bold text-slate-800">{sizeHeading}</span>
                {(isApparel || isFootwear) && (
                  <button className="text-xs text-blue-600 font-semibold hover:underline">
                    Size Chart
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`min-w-[44px] h-11 px-3.5 rounded-lg font-bold text-sm transition-all ${
                      selectedSize === size
                        ? 'bg-slate-900 text-white shadow'
                        : 'bg-white border border-slate-300 text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons: Gold / Mustard Yellow buttons matching Image 2 */}
            <div className="flex items-center gap-4 max-w-md pt-2">
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#d99b26] hover:bg-[#c4881d] text-slate-950 font-black text-sm py-3 px-6 rounded-lg shadow-sm transition active:scale-98 cursor-pointer"
              >
                BUY NOW
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#d99b26] hover:bg-[#c4881d] text-slate-950 font-black text-sm py-3 px-6 rounded-lg shadow-sm transition active:scale-98 cursor-pointer"
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>

        {/* 4. Customer Reviews Section (Connected to /api/reviews) */}
        <section id="reviews-section" className="mt-8 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Customer Reviews</h2>
              <p className="text-xs text-slate-500">Verified buyer ratings & feedback from our community</p>
            </div>
            <span className="text-sm font-bold text-slate-700">{reviews.length} Total Reviews</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start mb-12">
            {/* Reviews List (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              {reviewsLoading ? (
                <div className="text-center py-6 text-slate-400 text-sm">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm">
                  No reviews yet for this product. Be the first to share your experience!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.reviewId} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 font-bold text-xs flex items-center justify-center text-slate-700">
                          {rev.customerId ? `C${rev.customerId}` : 'U'}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            Verified Customer #{rev.customerId || 1}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {rev.reviewDate ? new Date(rev.reviewDate).toLocaleDateString() : 'Recent review'}
                          </span>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            fill={s <= (rev.rating || 5) ? "currentColor" : "none"}
                            className={s <= (rev.rating || 5) ? "text-amber-400" : "text-slate-300"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                      "{rev.reviewText}"
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review Box (5 cols) */}
            <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-black text-slate-900 mb-1">Write a Review</h3>
              <p className="text-xs text-slate-500 mb-4">Share your feedback on performance, quality, and fit.</p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Rating (1-5 Stars)</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="text-amber-400 hover:scale-110 transition p-1"
                      >
                        <Star
                          size={22}
                          fill={star <= newRating ? "currentColor" : "none"}
                          className={star <= newRating ? "text-amber-400" : "text-slate-300"}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-black text-slate-800">{newRating} / 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Feedback</label>
                  <textarea
                    rows={3}
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Describe your experience with this product..."
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{submittingReview ? 'Submitting...' : 'Post Customer Review'}</span>
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* 5. Recommended Section ("RECOMENDED") matching Image 2 */}
        <section className="mt-8 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide mb-6">
            RECOMENDED
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {recommendedProducts.map((p, idx) => (
              <ProductCard key={`rec-${p.productId}-${idx}`} product={p} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
