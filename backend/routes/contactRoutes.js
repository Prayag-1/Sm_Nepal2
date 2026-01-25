import express from 'express';
import {
  getSettings,
  listQueries,
  markQueryRead,
  submitContact,
  updateSettings,
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/settings').get(getSettings).put(protect, admin, updateSettings);
router.route('/queries').get(protect, admin, listQueries);
router.route('/queries/:id/read').put(protect, admin, markQueryRead);
router.route('/').post(submitContact);

export default router;
