import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import {
  getTutorials,
  createTutorial,
  updateTutorial,
  deleteTutorial,
} from '../controllers/tutorialController.js';

const router = express.Router();

router.route('/').get(getTutorials).post(protect, admin, createTutorial);
router.route('/:id').put(protect, admin, updateTutorial).delete(protect, admin, deleteTutorial);

export default router;
