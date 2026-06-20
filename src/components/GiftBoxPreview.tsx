import { useGameStore, getPlacedFoods, getTotalPrice, getTotalWeight, getCategoryCount, getPlacedCounts
} from '../stores/gameStore';
import { Undo2, Redo2, Trash2, PackageOpen, RotateCcw
} from 'lucide-react';
import { categoryNames, categoryColors
} from '../types/game';

export default function GiftBoxPreview() {
  const {
    currentLevel,
    placedItems,
    foods,
    undo,
    redo,
    clearAll,
    history,
    historyIndex,
    validationResult,
    unlockedRewards,
  } = useGameStore();

  const placedFoods = getPlacedFoods();
  const totalPrice = getTotalPrice();
  const totalWeight = getTotalWeight();
  const placedCounts = getPlacedCounts();

  if (!currentLevel) return null;

  const { rows, cols } = currentLevel.boxSize;

  const getFoodAtPosition = (row: number, col: number) => {
    const item = placedItems.find((i) => i.row === row && i.col === col);
    if (!item) return null;
    const food = foods.find((f) => f.id === item.foodId);
    return food ? { ...item, ...food } : null;
  };

  const reward = validationResult?.passed
    ? validationResult.unlockedReward
    : unlockedRewards[currentLevel.id] || null;

  const defaultStyle = 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-300';
  const defaultRibbon = 'from-red-400 to-red-600';

  const packageStyle = reward?.packageStyle || defaultStyle;
  const ribbonColor = reward?.ribbonColor || defaultRibbon;
  const packageName = reward?.packageName || '精美礼盒';

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PackageOpen className="w-6 h-6 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-800">🎀 礼盒预览</h3>
        </div>
        {reward && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white">
            {reward.packageName}
          </span>
        )}
      </div>

      <div
        className={`relative rounded-2xl p-4 border-4 shadow-xl overflow-hidden mb-4 ${packageStyle}`}
        style={{ aspectRatio: `${cols} / ${rows}` }}
      >
        <div
          className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-6 bg-gradient-to-r ${ribbonColor} opacity-60 shadow-md pointer-events-none`}
        />
        <div
          className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-b ${ribbonColor} opacity-60 shadow-md pointer-events-none`}
        />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="relative">
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${ribbonColor} shadow-lg transform -rotate-12 opacity-90`}
            />
            <div
              className={`absolute top-0 w-8 h-8 rounded-full bg-gradient-to-br ${ribbonColor} shadow-lg transform rotate-12 opacity-80`}
            />
            <div
              className={`absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-4 rounded-full bg-gradient-to-b ${ribbonColor} shadow-inner`}
            />
          </div>
        </div>

        <div
          className="relative z-0 w-full h-full"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: '4px',
          }}
        >
          {Array.from({ length: rows }).map((_, row) =>
            Array.from({ length: cols }).map((_, col) => {
              const food = getFoodAtPosition(row, col);
              return (
                <div
                  key={`${row}-${col}`}
                  className={`rounded-lg border flex items-center justify-center transition-all duration-200 ${
                    food
                      ? 'bg-white/80 border-white/60 shadow-sm'
                      : 'bg-white/20 border-white/30 border-dashed'
                  }`}
                >
                  {food ? (
                    <span className="text-lg sm:text-xl drop-shadow-sm">
                      {food.emoji}
                    </span>
                  ) : (
                    <span className="text-white/40 text-xs">◇</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg z-20 border border-white pointer-events-none">
          <span className="text-sm font-bold text-slate-700">
            {packageName}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4 flex-shrink-0">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">🎁 礼盒总值</span>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              ¥{totalPrice}
            </span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">⚖️ 总重量</span>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
              {totalWeight}g
            </span>
          </div>
          {currentLevel.weightLimit && (
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>重量范围: {currentLevel.weightLimit.min}g - {currentLevel.weightLimit.max}g</span>
              <span className={totalWeight < currentLevel.weightLimit.min ? 'text-blue-500 font-medium' : totalWeight > currentLevel.weightLimit.max ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                {totalWeight < currentLevel.weightLimit.min ? '不足' : totalWeight > currentLevel.weightLimit.max ? '超标' : '达标'}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
            <span>{placedItems.length} 件食材</span>
            <span>{currentLevel.boxSize.rows * currentLevel.boxSize.cols - placedItems.length} 格空位</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['fruit_vegetable', 'meat', 'dry_goods'] as const).map((cat) => {
            const count = placedCounts.byCategory[cat];
            return (
              <div
                key={cat}
                className={`rounded-lg p-2 text-center bg-gradient-to-br ${categoryColors[cat]} bg-opacity-10 border border-slate-200`}
              >
                <div className="text-[10px] text-slate-500 mb-0.5">
                  {categoryNames[cat]}
                </div>
                <div className="text-lg font-bold text-slate-700">{count}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="text-xs text-slate-500 mb-2 font-medium">
          📝 食材清单 ({placedCounts.total})
        </div>
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {placedFoods.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm">
              礼盒空空如也，快放入食材吧～
            </div>
          ) : (
            placedFoods.map((food, idx) => (
              <div
                key={`${food.id}-${idx}`}
                className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span className="text-xl">{food.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-700 truncate">
                    {food.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {categoryNames[food.category]}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold text-amber-600">¥{food.price}</div>
                  <div className="text-[10px] text-blue-500">{food.weight}g</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-3">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200"
        >
          <Undo2 className="w-4 h-4" />
          <span className="text-sm">撤回</span>
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200"
        >
          <Redo2 className="w-4 h-4" />
          <span className="text-sm">重做</span>
        </button>
        <button
          onClick={clearAll}
          disabled={placedItems.length === 0}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed border border-red-200"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm">清空</span>
        </button>
      </div>

      <button
        onClick={clearAll}
        disabled={placedItems.length === 0}
        className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-40"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        重新搭配
      </button>
    </div>
  );
}
