import React from 'react';
import { useNavigate } from 'react-router-dom';
export const CATEGORIES_DATA = [
  {
    id: 1,
    name: "Sports Equipment",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    name: "Gym Equipment",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    name: "Fitness Nutrition",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    name: "Sportswear",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    name: "Sports Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    name: "Sports Accessories",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    name: "Yoga and Wellness",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 8,
    name: "Outdoor Sports",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 9,
    name: "Protective Gear",
    image: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=150&auto=format&fit=crop&q=80"
  }
];

export default function CategoryNav({ activeId, onSelect }) {
  const navigate = useNavigate();

  const handleCategoryClick = (catId) => {
    if (activeId === catId) {
      // If already active, toggle off and go home
      navigate('/');
      if (onSelect) onSelect(null);
    } else {
      // Navigate to dedicated category route
      navigate(`/category/${catId}`);
      if (onSelect) onSelect(catId);
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none py-1">
          {CATEGORIES_DATA.map((cat) => {
            const isSelected = Number(activeId) === Number(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="flex flex-col items-center min-w-[85px] sm:min-w-[105px] group focus:outline-none transition cursor-pointer"
              >
                {/* Rounded Icon Thumbnail Container */}
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center p-1.5 transition-all duration-200 ${
                    isSelected
                      ? 'ring-3 ring-blue-600 bg-blue-50 scale-105'
                      : 'hover:scale-105 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain drop-shadow-sm rounded-full"
                    loading="lazy"
                  />
                </div>

                {/* Category Label */}
                <span
                  className={`text-[11px] sm:text-xs text-center font-medium mt-1.5 line-clamp-2 leading-tight transition ${
                    isSelected
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-800 group-hover:text-black'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
