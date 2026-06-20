import type { FoodCategory, Level, PlacedItem, ValidationError, ValidateResponse } from '../types';
import { getFoodById, categoryNames } from '../data/foods';

interface CategoryCount {
  fruit_vegetable: number;
  meat: number;
  dry_goods: number;
}

function calculateCategoryCounts(placedItems: PlacedItem[]): CategoryCount {
  const counts: CategoryCount = {
    fruit_vegetable: 0,
    meat: 0,
    dry_goods: 0
  };

  for (const item of placedItems) {
    const food = getFoodById(item.foodId);
    if (food) {
      counts[food.category]++;
    }
  }

  return counts;
}

function calculateTotalPrice(placedItems: PlacedItem[]): number {
  return placedItems.reduce((total, item) => {
    const food = getFoodById(item.foodId);
    return total + (food?.price || 0);
  }, 0);
}

function calculateTotalWeight(placedItems: PlacedItem[]): number {
  return placedItems.reduce((total, item) => {
    const food = getFoodById(item.foodId);
    return total + (food?.weight || 0);
  }, 0);
}

export function validateGiftBox(level: Level, placedItems: PlacedItem[]): ValidateResponse {
  const errors: ValidationError[] = [];
  const categoryCounts = calculateCategoryCounts(placedItems);
  const totalPrice = calculateTotalPrice(placedItems);
  const totalWeight = calculateTotalWeight(placedItems);

  for (const limit of level.categoryLimits) {
    const count = categoryCounts[limit.category];
    if (count < limit.min) {
      errors.push({
        type: 'category_count',
        message: `${categoryNames[limit.category]}数量不足：当前${count}件，至少需要${limit.min}件`,
        details: {
          category: limit.category,
          current: count,
          min: limit.min,
          max: limit.max
        }
      });
    }
    if (count > limit.max) {
      errors.push({
        type: 'category_count',
        message: `${categoryNames[limit.category]}数量超标：当前${count}件，最多允许${limit.max}件`,
        details: {
          category: limit.category,
          current: count,
          min: limit.min,
          max: limit.max
        }
      });
    }
  }

  for (const requiredCategory of level.requiredCategories) {
    if (categoryCounts[requiredCategory] === 0) {
      errors.push({
        type: 'required_category',
        message: `缺少必备品类：${categoryNames[requiredCategory]}`,
        details: {
          category: requiredCategory,
          current: 0
        }
      });
    }
  }

  if (level.priceLimit) {
    const { min, max } = level.priceLimit;
    if (totalPrice < min) {
      errors.push({
        type: 'price',
        message: `礼盒总价不足：当前¥${totalPrice}，最低要求¥${min}`,
        details: {
          currentPrice: totalPrice,
          minPrice: min,
          maxPrice: max
        }
      });
    }
    if (totalPrice > max) {
      errors.push({
        type: 'price',
        message: `礼盒总价超标：当前¥${totalPrice}，最高限额¥${max}`,
        details: {
          currentPrice: totalPrice,
          minPrice: min,
          maxPrice: max
        }
      });
    }
  }

  if (level.weightLimit) {
    const { min, max } = level.weightLimit;
    if (totalWeight < min) {
      errors.push({
        type: 'weight',
        message: `礼盒总重量不足：当前${totalWeight}g，最低要求${min}g`,
        details: {
          currentWeight: totalWeight,
          minWeight: min,
          maxWeight: max
        }
      });
    }
    if (totalWeight > max) {
      errors.push({
        type: 'weight',
        message: `礼盒总重量超标：当前${totalWeight}g，最高限额${max}g`,
        details: {
          currentWeight: totalWeight,
          minWeight: min,
          maxWeight: max
        }
      });
    }
  }

  const passed = errors.length === 0;

  return {
    success: true,
    passed,
    errors,
    summary: {
      totalPrice,
      totalWeight,
      categoryCounts
    },
    unlockedReward: passed ? level.reward : undefined
  };
}
