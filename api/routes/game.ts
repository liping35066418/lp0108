import { Router, type Request, type Response } from 'express';
import { levels, getLevelById } from '../data/levels.js';
import { foods, getFoodById, categoryNames, getFoodsByCategory } from '../data/foods.js';
import { validateGiftBox } from '../services/validator.js';
import type { ValidateRequest } from '../types.js';

const router = Router();

router.get('/levels', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: levels
  });
});

router.get('/levels/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const level = getLevelById(id);

  if (!level) {
    res.status(404).json({
      success: false,
      error: '关卡不存在'
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: level
  });
});

router.get('/foods', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;

  if (category) {
    const filtered = getFoodsByCategory(category);
    res.status(200).json({
      success: true,
      data: filtered
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: foods,
    categoryNames
  });
});

router.get('/foods/:id', (req: Request, res: Response) => {
  const food = getFoodById(req.params.id);

  if (!food) {
    res.status(404).json({
      success: false,
      error: '食材不存在'
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: food
  });
});

router.post('/validate', (req: Request, res: Response) => {
  const body = req.body as ValidateRequest;
  const { levelId, placedItems } = body;

  if (!levelId || !placedItems) {
    res.status(400).json({
      success: false,
      error: '参数不完整：需要 levelId 和 placedItems'
    });
    return;
  }

  const level = getLevelById(levelId);
  if (!level) {
    res.status(404).json({
      success: false,
      error: '关卡不存在'
    });
    return;
  }

  const totalCells = level.boxSize.rows * level.boxSize.cols;
  if (placedItems.length > totalCells) {
    res.status(400).json({
      success: false,
      error: `放置的食材数量超过礼盒容量（最多${totalCells}格）`
    });
    return;
  }

  const result = validateGiftBox(level, placedItems);
  res.status(200).json(result);
});

router.get('/categories', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: categoryNames
  });
});

export default router;
