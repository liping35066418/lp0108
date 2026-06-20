export type FoodCategory = 'fruit_vegetable' | 'meat' | 'dry_goods';

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  price: number;
  weight: number;
  emoji: string;
  description: string;
}

export interface CategoryLimit {
  category: FoodCategory;
  min: number;
  max: number;
}

export interface PriceLimit {
  min: number;
  max: number;
}

export interface WeightLimit {
  min: number;
  max: number;
}

export interface GiftBoxSize {
  rows: number;
  cols: number;
}

export interface Level {
  id: number;
  name: string;
  scene: string;
  sceneDescription: string;
  categoryLimits: CategoryLimit[];
  requiredCategories: FoodCategory[];
  priceLimit?: PriceLimit;
  weightLimit?: WeightLimit;
  boxSize: GiftBoxSize;
  reward: {
    packageName: string;
    packageStyle: string;
    ribbonColor: string;
  };
}

export interface PlacedItem {
  foodId: string;
  row: number;
  col: number;
}

export interface ValidationError {
  type: 'category_count' | 'required_category' | 'price' | 'weight' | 'grid_full';
  message: string;
  details?: {
    category?: FoodCategory;
    current?: number;
    min?: number;
    max?: number;
    currentPrice?: number;
    minPrice?: number;
    maxPrice?: number;
    currentWeight?: number;
    minWeight?: number;
    maxWeight?: number;
  };
}

export interface ValidateResponse {
  success: boolean;
  passed: boolean;
  errors: ValidationError[];
  summary?: {
    totalPrice: number;
    totalWeight: number;
    categoryCounts: Record<FoodCategory, number>;
  };
  unlockedReward?: Level['reward'];
}

export const categoryNames: Record<FoodCategory, string> = {
  fruit_vegetable: '果蔬',
  meat: '鲜肉',
  dry_goods: '干货'
};

export const categoryColors: Record<FoodCategory, string> = {
  fruit_vegetable: 'from-green-400 to-emerald-500',
  meat: 'from-red-400 to-rose-500',
  dry_goods: 'from-amber-400 to-orange-500'
};

export const categoryBgColors: Record<FoodCategory, string> = {
  fruit_vegetable: 'bg-green-50 border-green-200',
  meat: 'bg-red-50 border-red-200',
  dry_goods: 'bg-amber-50 border-amber-200'
};

export const categoryTextColors: Record<FoodCategory, string> = {
  fruit_vegetable: 'text-green-700',
  meat: 'text-red-700',
  dry_goods: 'text-amber-700'
};
