import type { Level } from '../types';

export const levels: Level[] = [
  {
    id: 1,
    name: '第一关：走亲访友',
    scene: '走亲访友',
    sceneDescription: '春节走亲访友，带上一份心意满满的礼盒，既要体面又要实在。果蔬要新鲜多样，荤素搭配合理，总价控制在亲民范围内。',
    categoryLimits: [
      { category: 'fruit_vegetable', min: 2, max: 4 },
      { category: 'meat', min: 1, max: 2 },
      { category: 'dry_goods', min: 1, max: 2 }
    ],
    requiredCategories: ['fruit_vegetable', 'meat', 'dry_goods'],
    priceLimit: { min: 100, max: 250 },
    weightLimit: { min: 1500, max: 3000 },
    boxSize: { rows: 3, cols: 3 },
    reward: {
      packageName: '新春祝福礼盒',
      packageStyle: 'bg-gradient-to-br from-red-500 to-red-700',
      ribbonColor: 'from-yellow-400 to-yellow-600'
    }
  },
  {
    id: 2,
    name: '第二关：商务送礼',
    scene: '商务送礼',
    sceneDescription: '商务往来馈赠佳品，讲究品质与档次。精选高端食材，品质卓越，彰显品味。',
    categoryLimits: [
      { category: 'fruit_vegetable', min: 1, max: 3 },
      { category: 'meat', min: 2, max: 4 },
      { category: 'dry_goods', min: 2, max: 4 }
    ],
    requiredCategories: ['fruit_vegetable', 'meat', 'dry_goods'],
    priceLimit: { min: 300, max: 600 },
    weightLimit: { min: 2000, max: 5000 },
    boxSize: { rows: 4, cols: 4 },
    reward: {
      packageName: '尊享商务礼盒',
      packageStyle: 'bg-gradient-to-br from-slate-700 to-slate-900',
      ribbonColor: 'from-amber-500 to-amber-700'
    }
  },
  {
    id: 3,
    name: '第三关：探望长辈',
    scene: '探望长辈',
    sceneDescription: '探望长辈要注重健康养生，食材要滋补养生为主，营养均衡易消化。',
    categoryLimits: [
      { category: 'fruit_vegetable', min: 3, max: 5 },
      { category: 'meat', min: 1, max: 2 },
      { category: 'dry_goods', min: 2, max: 4 }
    ],
    requiredCategories: ['fruit_vegetable', 'meat', 'dry_goods'],
    priceLimit: { min: 150, max: 350 },
    weightLimit: { min: 2000, max: 4000 },
    boxSize: { rows: 4, cols: 3 },
    reward: {
      packageName: '健康长寿礼盒',
      packageStyle: 'bg-gradient-to-br from-green-500 to-green-700',
      ribbonColor: 'from-emerald-400 to-emerald-600'
    }
  },
  {
    id: 4,
    name: '第四关：节日庆典',
    scene: '节日庆典',
    sceneDescription: '重要节日庆典，礼盒内容要丰富饱满，品类齐全，大气上档次。',
    categoryLimits: [
      { category: 'fruit_vegetable', min: 3, max: 5 },
      { category: 'meat', min: 3, max: 5 },
      { category: 'dry_goods', min: 3, max: 5 }
    ],
    requiredCategories: ['fruit_vegetable', 'meat', 'dry_goods'],
    priceLimit: { min: 400, max: 800 },
    weightLimit: { min: 3000, max: 6000 },
    boxSize: { rows: 4, cols: 4 },
    reward: {
      packageName: '臻选福运礼盒',
      packageStyle: 'bg-gradient-to-br from-purple-600 to-purple-900',
      ribbonColor: 'from-pink-400 to-pink-600'
    }
  }
];

export function getLevelById(id: number): Level | undefined {
  return levels.find(l => l.id === id);
}
