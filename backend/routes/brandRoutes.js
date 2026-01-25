import express from 'express';
import {
  createBrand,
  deleteBrand,
  getBrands,
  updateBrand,
} from '../controllers/brandController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getBrands).post(protect, admin, createBrand);
router
  .route('/:id')
  .put(protect, admin, updateBrand)
  .delete(protect, admin, deleteBrand);

export default router;
