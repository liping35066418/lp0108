import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getLevels, getFoods } from '../api/gameApi';
import LevelSelector from '../components/LevelSelector';
import FoodPanel from '../components/FoodPanel';
import GiftBoxGrid from '../components/GiftBoxGrid';
import GiftBoxPreview from '../components/GiftBoxPreview';
import ValidationPanel from '../components/ValidationPanel';
import SuccessModal from '../components/SuccessModal';
import { Gift, ChefHat, Sparkles } from 'lucide-react';

export default function Home() {
  const {
    setLevels,
    setFoods,
    setCurrentLevel,
    loadUnlockedRewards,
    levels,
    foods,
    error,
  } = useGameStore();

  useEffect(() => {
    loadUnlockedRewards();

    Promise.all([getLevels(), getFoods()])
      .then(([levelsRes, foodsRes]) => {
        setLevels(levelsRes.data);
        setFoods(foodsRes.data);
        if (levelsRes.data.length > 0) {
          setCurrentLevel(levelsRes.data[0]);
        }
      })
      .catch((err) => {
        console.error('加载数据失败:', err);
      });
  }, [setLevels, setFoods, setCurrentLevel, loadUnlockedRewards]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-50">
      {/* 顶部装饰背景 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* 顶部标题栏 */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <Gift className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md animate-pulse">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    礼盒食材搭配大师
                  </h1>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ChefHat className="w-3.5 h-3.5" />
                    拖拽食材 · 组装礼盒 · 挑战关卡 · 解锁奖励
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-center">
                    <div className="text-xs text-slate-400">关卡总数</div>
                    <div className="text-lg font-bold text-indigo-600">{levels.length}</div>
                  </div>
                  <div className="w-px h-8 bg-slate-200" />
                  <div className="text-center">
                    <div className="text-xs text-slate-400">食材种类</div>
                    <div className="text-lg font-bold text-amber-600">{foods.length}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                  </span>
                  <span className="text-xs font-medium text-green-700">系统运行正常</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 主体内容 */}
        <main className="max-w-[1600px] mx-auto px-6 py-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* 关卡选择区域 */}
          <div className="mb-6">
            <LevelSelector />
          </div>

          {/* 三栏主布局 */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* 左侧：食材素材区 */}
            <div className="xl:col-span-3 h-[calc(100vh-320px)] min-h-[550px]">
              <FoodPanel />
            </div>

            {/* 中间：礼盒组装区 + 校验面板 */}
            <div className="xl:col-span-6 space-y-6">
              <GiftBoxGrid />
              <ValidationPanel />
            </div>

            {/* 右侧：礼盒预览 */}
            <div className="xl:col-span-3 h-[calc(100vh-320px)] min-h-[550px]">
              <GiftBoxPreview />
            </div>
          </div>

          {/* 底部使用说明 */}
          <div className="mt-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
              <span className="text-lg">📖</span> 游戏玩法说明
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: '1', title: '选择场景', desc: '根据关卡的走亲访友、商务送礼、探望长辈等场景明确搭配目标', icon: '🎯' },
                { step: '2', title: '拖拽食材', desc: '从左侧食材区选择果蔬、鲜肉、干货，拖入中间礼盒网格', icon: '✋' },
                { step: '3', title: '数量价格', desc: '注意每类食材的最低最高数量区间，以及礼盒总价浮动范围', icon: '📊' },
                { step: '4', title: '提交校验', desc: '点击校验按钮，不满足条件会标出问题，全部符合即可通关解锁', icon: '✅' },
              ].map((item) => (
                <div key={item.step} className="relative p-4 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200">
                  <div className="absolute -top-3 -left-2 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shadow-md">
                    {item.step}
                  </div>
                  <div className="pl-2">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="font-bold text-slate-800 mb-1 text-sm">{item.title}</div>
                    <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400 flex flex-wrap gap-x-6 gap-y-2">
              <span>💡 提示：可以尝试缺类、数量超标等组合快速验证校验逻辑</span>
              <span>⌨️ 支持：单步撤回操作</span>
              <span>🎁 通关：解锁全新礼盒包装素材</span>
            </div>
          </div>
        </main>
      </div>

      <SuccessModal />
    </div>
  );
}
