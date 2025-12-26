import express from 'express';
import { createFaculty, getAllFaculty, getFacultyById, updateFaculty, deleteFaculty } from '../controllers/faculty.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { canViewFacultyProfile, onlyAdmin } from '../middlewares/authorizationMiddleware.js';

const router = express.Router();
router.use(authenticate);

router.post('/', onlyAdmin, createFaculty);
router.get('/', canViewFacultyProfile, getAllFaculty);
router.get('/:id', canViewFacultyProfile, getFacultyById);
router.put('/:id', onlyAdmin, updateFaculty);
router.delete('/:id', onlyAdmin, deleteFaculty);

export default router;
