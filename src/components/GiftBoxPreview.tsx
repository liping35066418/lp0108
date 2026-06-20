import { useGameStore, getPlacedFoods, getTotalPrice, getCategoryCount
} from '../stores/gameStore';
import { Undo2, Trash2, PackageOpen, RotateCcw
} from 'lucide-react';
import { categoryNames, categoryColors
} from '../types/game';

export default function GiftBoxPreview() {
  const {
    currentLevel,
    placedItems,
    undo,
    clearAll,
    historyIndex,
    validationResult,
    unlockedRewards,
  } = useGameStore();

  const placedFoods = getPlacedFoods();
  const totalPrice = getTotalPrice();

  if (!currentLevel) return null;

  const reward = validationResult?.passed
    ? validationResult.unlockedReward
    : unlockedRewards[currentLevel.id] || null;

  const defaultStyle = 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-300';
  const defaultRibbon = 'from-red-400 to-red-600';

  const packageStyle = reward?.packageStyle || defaultStyle;
  const ribbonColor = reward?.ribbonColor || defaultRibbon;
  const packageName = reward?.packageName || '精美礼盒';

  const canUndo = historyIndex > 0;

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

      {/* 礼盒包装预览 */}
      <div
        className={`relative aspect-square rounded-2xl p-4 border-4 shadow-xl overflow-hidden mb-4 ${packageStyle}`}
      >
        {/* 丝带装饰 */}
        <div
          className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-6 bg-gradient-to-r ${ribbonColor} opacity-80 shadow-md`}
        />
        <div
          className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 bg-gradient-to-b ${ribbonColor} opacity-80 shadow-md`}
        />

        {/* 蝴蝶结 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <div
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${ribbonColor} shadow-lg transform -rotate-12`}
            />
            <div
              className={`absolute top-0 w-8 h-8 rounded-full bg-gradient-to-br ${ribbonColor} shadow-lg transform rotate-12 opacity-90`}
            />
            <div
              className={`absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-4 rounded-full bg-gradient-to-b ${ribbonColor} shadow-inner`}
            />
          </div>
        </div>

        {/* 食材预览缩略图 */}
        <div className="absolute inset-0 p-6 grid grid-cols-4 grid-rows-4 gap-1 z-0 opacity-70">
          {Array.from({ length: 16 }).map((_, idx) => {
            const food = placedFoods[idx];
            return (
              <div
                key={idx}
                className="flex items-center justify-center"
              >
                {food && (
                  <span className="text-xl drop-shadow-sm filter grayscale-0 opacity-90">
                    {(food as any).emoji}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* 礼盒铭牌 */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg z-20 border border-white">
          <span className="text-sm font-bold text-slate-700">
            {packageName}
          </span>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="space-y-3 mb-4 flex-shrink-0">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">🎁 礼盒总值</span>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              ¥{totalPrice}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{placedItems.length} 件食材</span>
            <span>{currentLevel.boxSize.rows * currentLevel.boxSize.cols - placedItems.length} 格空位</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(['fruit_vegetable', 'meat', 'dry_goods'] as const).map((cat) => {
            const count = getCategoryCount(cat);
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

      {/* 食材清单 */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="text-xs text-slate-500 mb-2 font-medium">
          📝 食材清单 ({placedFoods.length})
        </div>
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {placedFoods.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm">
              礼盒空空如也，快放入食材吧～
            </div>
          ) : (
            placedFoods.map((food, idx) => (
              <div
                key={`${(food as any).id}-${idx}`}
                className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span className="text-xl">{(food as any).emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-700 truncate">
                    {(food as any).name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {categoryNames[(food as any).category]}
                  </div>
                </div>
                <span className="text-sm font-bold text-amber-600">¥{(food as any).price}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200"
        >
          <Undo2 className="w-4 h-4" />
          <span className="text-sm">撤回</span>
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
