import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { Trophy, Sparkles, Star, Gift, X } from 'lucide-react';

export default function SuccessModal() {
  const {
    showSuccessModal,
    setShowSuccessModal,
    currentLevel,
    validationResult,
    levels,
    setCurrentLevel,
  } = useGameStore();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSuccessModal) {
        setShowSuccessModal(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showSuccessModal, setShowSuccessModal]);

  if (!showSuccessModal || !currentLevel || !validationResult?.passed) return null;

  const reward = validationResult.unlockedReward;
  const currentIdx = levels.findIndex((l) => l.id === currentLevel.id);
  const nextLevel = currentIdx < levels.length - 1 ? levels[currentIdx + 1] : null;

  const handleNext = () => {
    if (nextLevel) {
      setCurrentLevel(nextLevel);
      setShowSuccessModal(false);
    } else {
      setShowSuccessModal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
        <button
          onClick={() => setShowSuccessModal(false)}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-white transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 顶部装饰 */}
        <div className={`relative h-48 ${reward?.packageStyle || 'bg-gradient-to-br from-indigo-500 to-purple-600'} overflow-hidden`}>
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => (
              <Sparkles
                key={i}
                className="absolute text-yellow-300 animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${12 + Math.random() * 16}px`,
                  height: `${12 + Math.random() * 16}px`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: 0.6 + Math.random() * 0.4,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping">
                <Trophy className="w-28 h-28 text-yellow-300 opacity-30" />
              </div>
              <Trophy className="w-28 h-28 text-yellow-400 drop-shadow-2xl relative z-10" />
              <div className="absolute -top-2 -right-2 animate-bounce">
                <Star className="w-10 h-10 text-yellow-300 fill-yellow-400 drop-shadow-lg" />
              </div>
              <div className="absolute -bottom-1 -left-3 animate-bounce" style={{ animationDelay: '0.3s' }}>
                <Star className="w-8 h-8 text-yellow-300 fill-yellow-400 drop-shadow-lg" />
              </div>
            </div>
          </div>

          {/* 底部渐变遮罩 */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* 内容区 */}
        <div className="p-6 -mt-4 relative z-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              🎉 恭喜通关！
            </h2>
            <p className="text-slate-600 mb-6">
              你已成功完成「{currentLevel.scene}」场景的礼盒搭配！
            </p>

            {/* 解锁奖励卡片 */}
            {reward && (
              <div className="mb-6 p-4 rounded-2xl border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Gift className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold text-amber-700">🎊 解锁全新包装素材</span>
                </div>
                <div className={`inline-block px-6 py-3 rounded-xl shadow-lg ${reward.packageStyle}`}>
                  <div className="flex items-center gap-2 text-white">
                    <div className="text-2xl">🎁</div>
                    <div className="text-left">
                      <div className="font-bold text-lg">{reward.packageName}</div>
                      <div className="text-xs opacity-80">专属礼盒包装</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 统计信息 */}
            {validationResult.summary && (
              <div className="mb-6 grid grid-cols-4 gap-2">
                {[
                  { label: '果蔬', value: validationResult.summary.categoryCounts.fruit_vegetable, emoji: '🥬' },
                  { label: '鲜肉', value: validationResult.summary.categoryCounts.meat, emoji: '🥩' },
                  { label: '干货', value: validationResult.summary.categoryCounts.dry_goods, emoji: '🍄' },
                  { label: '总价', value: `¥${validationResult.summary.totalPrice}`, emoji: '💰' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-slate-50 rounded-xl p-2.5 text-center"
                  >
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-[10px] text-slate-400 mb-0.5">{item.label}</div>
                    <div className="font-bold text-slate-700 text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* 按钮区 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="py-3 px-4 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200"
              >
                继续当前关卡
              </button>
              {nextLevel ? (
                <button
                  onClick={handleNext}
                  className="py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                  挑战下一关 →
                </button>
              ) : (
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg"
                >
                  🏆 已全部通关
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-twinkle { animation: twinkle 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
