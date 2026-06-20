import { create } from 'zustand';
import type { Level, FoodItem, PlacedItem, ValidateResponse, FoodCategory } from '../types/game';
import { validateGiftBox as apiValidateGiftBox } from '../api/gameApi';

interface HistoryState {
  placedItems: PlacedItem[];
}

interface GameState {
  levels: Level[];
  currentLevel: Level | null;
  foods: FoodItem[];
  placedItems: PlacedItem[];
  history: HistoryState[];
  historyIndex: number;
  validationResult: ValidateResponse | null;
  unlockedRewards: Record<number, Level['reward']>;
  isLoading: boolean;
  error: string | null;
  showSuccessModal: boolean;

  setLevels: (levels: Level[]) => void;
  setFoods: (foods: FoodItem[]) => void;
  setCurrentLevel: (level: Level) => void;
  placeItem: (foodId: string, row: number, col: number) => void;
  removeItem: (row: number, col: number) => void;
  undo: () => void;
  redo: () => void;
  clearAll: () => void;
  validate: () => Promise<void>;
  clearValidation: () => void;
  setShowSuccessModal: (show: boolean) => void;
  loadUnlockedRewards: () => void;
}

function saveRewardsToStorage(rewards: Record<number, Level['reward']>) {
  try {
    localStorage.setItem('unlockedRewards', JSON.stringify(rewards));
  } catch (e) {
    console.error('保存奖励失败', e);
  }
}

function loadRewardsFromStorage(): Record<number, Level['reward']> {
  try {
    const raw = localStorage.getItem('unlockedRewards');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  levels: [],
  currentLevel: null,
  foods: [],
  placedItems: [],
  history: [{ placedItems: [] }],
  historyIndex: 0,
  validationResult: null,
  unlockedRewards: {},
  isLoading: false,
  error: null,
  showSuccessModal: false,

  setLevels: (levels) => set({ levels }),
  setFoods: (foods) => set({ foods }),
  setCurrentLevel: (level) =>
    set({
      currentLevel: level,
      placedItems: [],
      history: [{ placedItems: [] }],
      historyIndex: 0,
      validationResult: null,
    }),

  placeItem: (foodId, row, col) => {
    const { placedItems, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    const newPlaced = placedItems.filter((i) => !(i.row === row && i.col === col));
    const finalPlaced = [...newPlaced, { foodId, row, col }];
    set({
      placedItems: finalPlaced,
      history: [...newHistory, { placedItems: finalPlaced }],
      historyIndex: newHistory.length,
      validationResult: null,
    });
  },

  removeItem: (row, col) => {
    const { placedItems, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    const finalPlaced = placedItems.filter((i) => !(i.row === row && i.col === col));
    set({
      placedItems: finalPlaced,
      history: [...newHistory, { placedItems: finalPlaced }],
      historyIndex: newHistory.length,
      validationResult: null,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        placedItems: history[newIndex].placedItems,
        historyIndex: newIndex,
        validationResult: null,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        placedItems: history[newIndex].placedItems,
        historyIndex: newIndex,
        validationResult: null,
      });
    }
  },

  clearAll: () => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    set({
      placedItems: [],
      history: [...newHistory, { placedItems: [] }],
      historyIndex: newHistory.length,
      validationResult: null,
    });
  },

  validate: async () => {
    const { currentLevel, placedItems, unlockedRewards } = get();
    if (!currentLevel) return;

    set({ isLoading: true, error: null });

    try {
      const result = await apiValidateGiftBox(currentLevel.id, placedItems);

      if (result.passed && !unlockedRewards[currentLevel.id]) {
        const newRewards = {
          ...unlockedRewards,
          [currentLevel.id]: result.unlockedReward!,
        };
        set({ unlockedRewards: newRewards });
        saveRewardsToStorage(newRewards);
      }

      set({
        validationResult: result,
        isLoading: false,
        showSuccessModal: result.passed,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '校验失败',
        isLoading: false,
      });
    }
  },

  clearValidation: () => set({ validationResult: null }),
  setShowSuccessModal: (show) => set({ showSuccessModal: show }),

  loadUnlockedRewards: () => {
    const rewards = loadRewardsFromStorage();
    set({ unlockedRewards: rewards });
  },
}));

export function getFoodByIdFromStore(foodId: string): FoodItem | undefined {
  return useGameStore.getState().foods.find((f) => f.id === foodId);
}

export function getPlacedFoods(): Array<PlacedItem & FoodItem> {
  const { placedItems, foods } = useGameStore.getState();
  return placedItems
    .map((item) => {
      const food = foods.find((f) => f.id === item.foodId);
      return food ? { ...item, ...food } : null;
    })
    .filter((item): item is PlacedItem & FoodItem => item !== null);
}

export function getCategoryCount(category: FoodCategory): number {
  const placed = getPlacedFoods();
  return placed.filter((f) => f.category === category).length;
}

export function getTotalPrice(): number {
  const placed = getPlacedFoods();
  return placed.reduce((sum, f) => sum + f.price, 0);
}

export function getTotalWeight(): number {
  const placed = getPlacedFoods();
  return placed.reduce((sum, f) => sum + f.weight, 0);
}

export function getPlacedCounts(): { total: number; byCategory: Record<FoodCategory, number> } {
  const placed = getPlacedFoods();
  return {
    total: placed.length,
    byCategory: {
      fruit_vegetable: placed.filter((f) => f.category === 'fruit_vegetable').length,
      meat: placed.filter((f) => f.category === 'meat').length,
      dry_goods: placed.filter((f) => f.category === 'dry_goods').length,
    },
  };
}
