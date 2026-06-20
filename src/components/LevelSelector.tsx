import { useGameStore } from '../stores/gameStore';
import { categoryNames } from '../types/game';
import { ChevronLeft, ChevronRight, Trophy, Star } from 'lucide-react';

export default function LevelSelector() {
  const {
    levels,
    currentLevel,
    setCurrentLevel,
    unlockedRewards,
  } = useGameStore();

  const currentIndex = currentLevel
    ? levels.findIndex((l) => l.id === currentLevel.id)
    : -1;

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentLevel(levels[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < levels.length - 1) {
      setCurrentLevel(levels[currentIndex + 1]);
    }
  };

  if (levels.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
        <div className="text-slate-500 text-center">加载关卡中...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrev}
          disabled={currentIndex <= 0}
          className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>

        <div className="flex gap-2">
          {levels.map((level, idx) => {
            const unlocked = unlockedRewards[level.id];
            return (
              <button
                key={level.id}
                onClick={() => setCurrentLevel(level)}
                className={`w-10 h-10 rounded-lg font-bold transition-all duration-200 flex items-center justify-center ${
                  currentLevel?.id === level.id
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg scale-110'
                    : unlocked
                    ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 border-2 border-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
                title={level.name}
              >
                {unlocked ? <Star className="w-5 h-5 fill-current" /> : idx + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex >= levels.length - 1}
          className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {currentLevel && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-medium">
              {currentLevel.scene}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{currentLevel.name}</h2>
            {unlockedRewards[currentLevel.id] && (
              <div className="flex items-center gap-1 text-amber-500">
                <Trophy className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium">已通关</span>
              </div>
            )}
          </div>
          <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
            {currentLevel.sceneDescription}
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {currentLevel.categoryLimits.map((limit) => (
              <div
                key={limit.category}
                className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200"
              >
                <div className="text-xs text-slate-500 mb-1">{categoryNames[limit.category]}</div>
                <div className="text-lg font-bold text-slate-700">
                  {limit.min} - {limit.max} 件
                </div>
              </div>
            ))}
          </div>

          {currentLevel.priceLimit && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-200 flex items-center justify-between">
              <span className="text-sm text-amber-700 font-medium">💰 总价限制</span>
              <span className="text-lg font-bold text-amber-800">
                ¥{currentLevel.priceLimit.min} - ¥{currentLevel.priceLimit.max}
              </span>
            </div>
          )}

          {currentLevel.weightLimit && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200 flex items-center justify-between">
              <span className="text-sm text-blue-700 font-medium">⚖️ 重量限制</span>
              <span className="text-lg font-bold text-blue-800">
                {currentLevel.weightLimit.min}g - {currentLevel.weightLimit.max}g
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-slate-500 pt-1">
            <span>🎁 礼盒容量：{currentLevel.boxSize.rows} × {currentLevel.boxSize.cols} = {currentLevel.boxSize.rows * currentLevel.boxSize.cols}格</span>
            <span>必备品类：{currentLevel.requiredCategories.map(c => categoryNames[c]).join('、')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
