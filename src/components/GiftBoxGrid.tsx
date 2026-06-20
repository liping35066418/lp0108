import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { categoryBgColors } from '../types/game';
import { X, Package, Sparkles } from 'lucide-react';
import type { FoodItem } from '../types/game';

export default function GiftBoxGrid() {
  const {
    currentLevel,
    placedItems,
    placeItem,
    removeItem,
    foods,
  } = useGameStore();

  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);
  const [isDragOverCell, setIsDragOverCell] = useState<{ row: number; col: number } | null>(null);

  if (!currentLevel) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
        <div className="text-slate-400">请先选择一个关卡</div>
      </div>
    );
  }

  const { rows, cols } = currentLevel.boxSize;

  const getPlacedItem = (row: number, col: number) => {
    const item = placedItems.find((i) => i.row === row && i.col === col);
    if (!item) return null;
    const food = foods.find((f) => f.id === item.foodId);
    return food ? { ...item, ...food } : null;
  };

  const handleDragOver = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOverCell({ row, col });
  };

  const handleDragLeave = () => {
    setIsDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    const foodId = e.dataTransfer.getData('foodId');
    if (foodId) {
      placeItem(foodId, row, col);
    }
    setIsDragOverCell(null);
  };

  const totalCells = rows * cols;
  const filledCells = placedItems.length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-indigo-500" />
          <h3 className="text-lg font-bold text-slate-800">🎁 礼盒组装区</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200">
            {filledCells} / {totalCells} 格
          </div>
          <div className="w-24 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${(filledCells / totalCells) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border-2 border-dashed border-slate-300 relative">
          <div className="absolute -top-3 -left-3 text-2xl animate-pulse">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div className="absolute -top-3 -right-3 text-2xl animate-pulse">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>

          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: rows }).map((_, row) =>
              Array.from({ length: cols }).map((_, col) => {
                const placed = getPlacedItem(row, col);
                const isDragOver =
                  isDragOverCell?.row === row && isDragOverCell?.col === col;
                const isHovered =
                  hoveredCell?.row === row && hoveredCell?.col === col;

                return (
                  <div
                    key={`${row}-${col}`}
                    onDragOver={(e) => handleDragOver(e, row, col)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, row, col)}
                    onMouseEnter={() => setHoveredCell({ row, col })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${
                      isDragOver
                        ? 'bg-indigo-100 border-indigo-400 border-dashed scale-105 shadow-lg'
                        : placed
                        ? `${categoryBgColors[(placed as FoodItem).category]} border-solid hover:shadow-md cursor-pointer hover:-translate-y-0.5`
                        : 'bg-white border-slate-200 border-dashed hover:border-slate-300 hover:bg-slate-50'
                    } ${isHovered && !placed ? 'border-indigo-200 bg-indigo-50/50' : ''}`}
                  >
                    {placed ? (
                      <div className="relative w-full h-full p-1 text-center group">
                        <button
                          onClick={() => removeItem(row, col)}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-xs"
                          title="移除此食材"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <div className="text-3xl sm:text-4xl mb-0.5 drop-shadow-sm">
                            {(placed as FoodItem).emoji}
                          </div>
                          <div className="text-[10px] sm:text-xs font-medium text-slate-600 truncate w-full px-1">
                            {(placed as FoodItem).name}
                          </div>
                          <div className="text-[9px] text-amber-600 font-bold">
                            ¥{(placed as FoodItem).price}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        {isDragOver ? (
                          <div className="text-2xl text-indigo-400 animate-bounce">
                            ＋
                          </div>
                        ) : (
                          <div className="text-slate-300 text-xs">
                            <div className="text-2xl mb-0.5 opacity-40">◇</div>
                            <div>空位</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 text-center border border-slate-100">
        💡 将食材拖入网格 · 点击食材右上角的 × 移除食材
      </div>
    </div>
  );
}
