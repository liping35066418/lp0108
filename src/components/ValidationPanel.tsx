import { useGameStore, getTotalPrice, getTotalWeight, getCategoryCount } from '../stores/gameStore';
import {
  categoryNames,
  categoryColors,
  categoryTextColors,
  type FoodCategory,
} from '../types/game';
import {
  AlertCircle, CheckCircle2, XCircle, CircleCheck, CircleDashed
} from 'lucide-react';

type LimitStatus = 'ok' | 'warning' | 'error' | 'empty';

interface GetLimitStatusParams {
  limit: { min: number; max: number };
  current: number;
  required?: boolean;
}

function getLimitStatus({ limit, current, required }: GetLimitStatusParams): LimitStatus {
  if (required && current === 0) return 'empty';
  if (current < limit.min) return 'error';
  if (current > limit.max) return 'error';
  if (current >= limit.min && current <= limit.max) return 'ok';
  return 'warning';
}

const categories: FoodCategory[] = ['fruit_vegetable', 'meat', 'dry_goods'];

export default function ValidationPanel() {
  const {
    currentLevel,
    validationResult,
    isLoading,
    validate,
    clearValidation,
  } = useGameStore();

  const totalPrice = getTotalPrice();
  const totalWeight = getTotalWeight();

  if (!currentLevel) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-5">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">📋 规则校验</h3>
          {validationResult && (
            <button
              onClick={clearValidation}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              清除结果
            </button>
          )}
        </div>

        <div className="space-y-3">
          {currentLevel.categoryLimits.map((limit) => {
            const current = getCategoryCount(limit.category);
            const required = currentLevel.requiredCategories.includes(limit.category);
            const status = getLimitStatus({ limit, current, required });

            return (
              <div
                key={limit.category}
                className={`rounded-lg p-3 border transition-all ${
                  status === 'ok'
                    ? 'bg-green-50 border-green-200'
                    : status === 'error'
                    ? 'bg-red-50 border-red-200'
                    : status === 'empty'
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${categoryColors[limit.category]} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {categoryNames[limit.category][0]}
                    </div>
                    <span
                      className={`font-medium ${categoryTextColors[limit.category]}`}
                    >
                      {categoryNames[limit.category]}
                    </span>
                    {required && (
                      <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                        必填
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {status === 'ok' && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {status === 'error' && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    {status === 'empty' && (
                      <CircleDashed className="w-5 h-5 text-slate-400" />
                    )}
                    <span
                      className={`font-bold text-sm ${
                        status === 'ok'
                          ? 'text-green-600'
                          : status === 'error'
                          ? 'text-red-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {current} / {limit.min}-{limit.max}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${categoryColors[limit.category]} transition-all duration-300`}
                    style={{
                      width: `${Math.min((current / limit.max) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {currentLevel.priceLimit && (() => {
            const { min, max } = currentLevel.priceLimit;
            const ratio = (totalPrice - min) / (max - min);
            const clampedRatio = Math.max(0, Math.min(1, ratio)) * 100;

            let priceStatus: LimitStatus = 'warning';
            if (totalPrice >= min && totalPrice <= max) priceStatus = 'ok';
            else if (totalPrice === 0) priceStatus = 'empty';
            else priceStatus = 'error';

            return (
              <div
                className={`rounded-lg p-3 border transition-all ${
                  priceStatus === 'ok'
                    ? 'bg-green-50 border-green-200'
                    : priceStatus === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg">
                      💰
                    </div>
                    <span className="font-medium text-amber-700">礼盒总价</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {priceStatus === 'ok' && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {priceStatus === 'error' && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    {priceStatus === 'empty' && (
                      <CircleDashed className="w-5 h-5 text-slate-400" />
                    )}
                    <span
                      className={`font-bold text-sm ${
                        priceStatus === 'ok'
                          ? 'text-green-600'
                          : priceStatus === 'error'
                          ? 'text-red-600'
                          : 'text-slate-600'
                      }`}
                    >
                      ¥{totalPrice}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mb-2 text-right">
                  范围: ¥{min} - ¥{max}
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
                    style={{ width: `${clampedRatio}%` }}
                  />
                </div>
              </div>
            );
          })()}

          {currentLevel.weightLimit && (() => {
            const { min, max } = currentLevel.weightLimit;
            const ratio = (totalWeight - min) / (max - min);
            const clampedRatio = Math.max(0, Math.min(1, ratio)) * 100;

            let weightStatus: LimitStatus = 'warning';
            if (totalWeight >= min && totalWeight <= max) weightStatus = 'ok';
            else if (totalWeight === 0) weightStatus = 'empty';
            else weightStatus = 'error';

            return (
              <div
                className={`rounded-lg p-3 border transition-all ${
                  weightStatus === 'ok'
                    ? 'bg-green-50 border-green-200'
                    : weightStatus === 'error'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-lg">
                      ⚖️
                    </div>
                    <span className="font-medium text-blue-700">礼盒总重量</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {weightStatus === 'ok' && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {weightStatus === 'error' && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    {weightStatus === 'empty' && (
                      <CircleDashed className="w-5 h-5 text-slate-400" />
                    )}
                    <span
                      className={`font-bold text-sm ${
                        weightStatus === 'ok'
                          ? 'text-green-600'
                          : weightStatus === 'error'
                          ? 'text-red-600'
                          : 'text-slate-600'
                      }`}
                    >
                      {totalWeight}g
                    </span>
                  </div>
                </div>
                <div className="text-xs text-slate-500 mb-2 text-right">
                  范围: {min}g - {max}g
                  {totalWeight < min && (
                    <span className="ml-2 text-blue-600 font-medium">重量不足</span>
                  )}
                  {totalWeight > max && (
                    <span className="ml-2 text-red-600 font-medium">重量超标</span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-300"
                    style={{ width: `${clampedRatio}%` }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {validationResult && (
        <div
          className={`mt-4 p-4 rounded-xl border-2 ${
            validationResult.passed
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
              : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
          }`}
        >
          <div className="flex items-start gap-2 mb-2">
            {validationResult.passed ? (
              <CircleCheck className="w-6 h-6 text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            )}
            <div>
              <div
                className={`font-bold ${
                  validationResult.passed ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {validationResult.passed
                  ? '🎉 恭喜通关！礼盒搭配完美！'
                  : '❌ 搭配未通过，存在以下问题：'}
              </div>
              {validationResult.summary && (
                <div
                  className={`text-sm mt-1 ${
                    validationResult.passed
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  共 {validationResult.summary.categoryCounts.fruit_vegetable +
                    validationResult.summary.categoryCounts.meat +
                    validationResult.summary.categoryCounts.dry_goods} 件食材，总价 ¥{validationResult.summary.totalPrice}，总重量 {validationResult.summary.totalWeight}g
                </div>
              )}
            </div>
          </div>

          {validationResult.errors.length > 0 && (
            <ul className="space-y-1.5 ml-8">
              {validationResult.errors.map((err, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-red-700 bg-red-100/50 rounded-lg px-3 py-2"
                >
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{err.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        onClick={validate}
        disabled={isLoading || !currentLevel}
        className={`w-full mt-4 py-3 px-6 rounded-xl font-bold text-white text-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
          validationResult?.passed
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>校验中...</span>
          </span>
        ) : validationResult?.passed ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            再次校验
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5" />
            提交闯关校验
          </span>
        )}
      </button>
    </div>
  );
}
