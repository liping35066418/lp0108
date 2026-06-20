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

export interface ValidateRequest {
  levelId: number;
  placedItems: PlacedItem[];
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
