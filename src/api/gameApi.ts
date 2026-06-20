import type { Level, FoodItem, ValidateResponse, PlacedItem } from '../types/game';

const API_BASE = '/api/game';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || '请求失败');
  }
  return data as T;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export function getLevels(): Promise<ApiResponse<Level[]>> {
  return request<ApiResponse<Level[]>>('/levels');
}

export function getLevel(id: number): Promise<ApiResponse<Level>> {
  return request<ApiResponse<Level>>(`/levels/${id}`);
}

export function getFoods(): Promise<ApiResponse<FoodItem[]>> {
  return request<ApiResponse<FoodItem[]>>('/foods');
}

export function getFoodsByCategory(category: string): Promise<ApiResponse<FoodItem[]>> {
  return request<ApiResponse<FoodItem[]>>(`/foods?category=${category}`);
}

export function validateGiftBox(
  levelId: number,
  placedItems: PlacedItem[]
): Promise<ValidateResponse> {
  return fetch(`${API_BASE}/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ levelId, placedItems }),
  }).then((res) => res.json());
}

export function getCategories(): Promise<ApiResponse<Record<string, string>>> {
  return request<ApiResponse<Record<string, string>>>('/categories');
}
