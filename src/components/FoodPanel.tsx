import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import {
  categoryNames,
  categoryColors,
  categoryBgColors,
  categoryTextColors,
  type FoodCategory,
  type FoodItem,
} from '../types/game';

const categories: FoodCategory[] = ['fruit_vegetable', 'meat', 'dry_goods'];

export default function FoodPanel() {
  const { foods } = useGameStore();
  const [activeCategory, setActiveCategory] = useState<FoodCategory | 'all'>('all');
  const [draggedFood, setDraggedFood] = useState<FoodItem | null>(null);

  const filteredFoods =
    activeCategory === 'all' ? foods : foods.filter((f) => f.category === activeCategory);

  const handleDragStart = (e: React.DragEvent, food: FoodItem) => {
    e.dataTransfer.setData('foodId', food.id);
    e.dataTransfer.effectAllowed = 'copy';
    setDraggedFood(food);
  };

  const handleDragEnd = () => {
    setDraggedFood(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <h3 className="text-lg font-bold text-slate-800 mb-3">🥗 食材素材区</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            全部 ({foods.length})
          </button>
          {categories.map((cat) => {
            const count = foods.filter((f) => f.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? `bg-gradient-to-r ${categoryColors[cat]} text-white shadow`
                    : `${categoryBgColors[cat]} ${categoryTextColors[cat]} hover:opacity-80`
                }`}
              >
                {categoryNames[cat]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredFoods.map((food) => (
            <div
              key={food.id}
              draggable
              onDragStart={(e) => handleDragStart(e, food)}
              onDragEnd={handleDragEnd}
              className={`group relative cursor-grab active:cursor-grabbing rounded-xl p-3 border-2 transition-all duration-200 hover:shadow-lg ${
                categoryBgColors[food.category]
              } ${draggedFood?.id === food.id ? 'opacity-50 scale-95' : 'hover:-translate-y-1'}`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-200">
                  {food.emoji}
                </div>
                <div className={`font-bold ${categoryTextColors[food.category]} text-sm`}>
                  {food.name}
                </div>
                <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {food.description}
                </div>
                <div className="mt-2 inline-block px-2 py-0.5 bg-white/80 rounded-full text-xs font-bold text-amber-600">
                  ¥{food.price}
                </div>
              </div>
              <div
                className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gradient-to-r ${categoryColors[food.category]} text-white opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                拖拽
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center">
        💡 提示：拖拽食材放入右侧礼盒网格中
      </div>
    </div>
  );
}
