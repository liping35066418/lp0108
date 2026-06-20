import type { FoodItem } from '../types';

export const foods: FoodItem[] = [
  {
    id: 'apple',
    name: '苹果',
    category: 'fruit_vegetable',
    price: 15,
    emoji: '🍎',
    description: '红富士苹果，脆甜多汁'
  },
  {
    id: 'orange',
    name: '橙子',
    category: 'fruit_vegetable',
    price: 12,
    emoji: '🍊',
    description: '赣南脐橙，维C丰富'
  },
  {
    id: 'grape',
    name: '葡萄',
    category: 'fruit_vegetable',
    price: 25,
    emoji: '🍇',
    description: '阳光玫瑰葡萄'
  },
  {
    id: 'strawberry',
    name: '草莓',
    category: 'fruit_vegetable',
    price: 35,
    emoji: '🍓',
    description: '丹东99草莓'
  },
  {
    id: 'tomato',
    name: '番茄',
    category: 'fruit_vegetable',
    price: 8,
    emoji: '🍅',
    description: '普罗旺斯番茄'
  },
  {
    id: 'cucumber',
    name: '黄瓜',
    category: 'fruit_vegetable',
    price: 6,
    emoji: '🥒',
    description: '水果小黄瓜'
  },
  {
    id: 'carrot',
    name: '胡萝卜',
    category: 'fruit_vegetable',
    price: 5,
    emoji: '🥕',
    description: '有机胡萝卜'
  },
  {
    id: 'corn',
    name: '玉米',
    category: 'fruit_vegetable',
    price: 7,
    emoji: '🌽',
    description: '东北甜玉米'
  },
  {
    id: 'beef',
    name: '牛肉',
    category: 'meat',
    price: 68,
    emoji: '🥩',
    description: '和牛雪花牛排'
  },
  {
    id: 'pork',
    name: '猪肉',
    category: 'meat',
    price: 35,
    emoji: '🥓',
    description: '散养黑猪五花'
  },
  {
    id: 'chicken',
    name: '鸡肉',
    category: 'meat',
    price: 28,
    emoji: '🍗',
    description: '农家散养土鸡'
  },
  {
    id: 'fish',
    name: '三文鱼',
    category: 'meat',
    price: 58,
    emoji: '🐟',
    description: '挪威进口三文鱼'
  },
  {
    id: 'shrimp',
    name: '鲜虾',
    category: 'meat',
    price: 45,
    emoji: '🦐',
    description: '厄瓜多尔白虾'
  },
  {
    id: 'sausage',
    name: '香肠',
    category: 'meat',
    price: 32,
    emoji: '🌭',
    description: '黑猪手工香肠'
  },
  {
    id: 'duck',
    name: '烤鸭',
    category: 'meat',
    price: 88,
    emoji: '🦆',
    description: '北京烤鸭'
  },
  {
    id: 'mushroom',
    name: '松茸',
    category: 'dry_goods',
    price: 120,
    emoji: '🍄',
    description: '云南野生松茸'
  },
  {
    id: 'fungus',
    name: '木耳',
    category: 'dry_goods',
    price: 45,
    emoji: '🫶',
    description: '东北黑木耳'
  },
  {
    id: 'noodle',
    name: '手工面',
    category: 'dry_goods',
    price: 18,
    emoji: '🍜',
    description: '手工拉面'
  },
  {
    id: 'rice',
    name: '五常大米',
    category: 'dry_goods',
    price: 25,
    emoji: '🍚',
    description: '东北五常大米'
  },
  {
    id: 'tea',
    name: '龙井茶',
    category: 'dry_goods',
    price: 88,
    emoji: '🍵',
    description: '西湖龙井明前茶'
  },
  {
    id: 'honey',
    name: '蜂蜜',
    category: 'dry_goods',
    price: 55,
    emoji: '🍯',
    description: '农家土蜂蜜'
  },
  {
    id: 'nuts',
    name: '坚果礼盒',
    category: 'dry_goods',
    price: 68,
    emoji: '🥜',
    description: '每日坚果混合装'
  },
  {
    id: 'dates',
    name: '红枣',
    category: 'dry_goods',
    price: 38,
    emoji: '🌰',
    description: '新疆和田大枣'
  }
];

export const categoryNames: Record<string, string> = {
  fruit_vegetable: '果蔬',
  meat: '鲜肉',
  dry_goods: '干货'
};

export function getFoodById(id: string): FoodItem | undefined {
  return foods.find(f => f.id === id);
}

export function getFoodsByCategory(category: string): FoodItem[] {
  return foods.filter(f => f.category === category);
}
