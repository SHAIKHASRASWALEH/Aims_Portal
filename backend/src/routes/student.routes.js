import express from 'express';
import { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent } from '../controllers/student.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { canViewStudentProfile, onlyAdmin } from '../middlewares/authorizationMiddleware.js';

const router = express.Router();
router.use(authenticate);

router.post('/', onlyAdmin, createStudent);
router.get('/', canViewStudentProfile, getAllStudents);
router.get('/:id', canViewStudentProfile, getStudentById);
router.put('/:id', onlyAdmin, updateStudent);
router.delete('/:id', onlyAdmin, deleteStudent);

export default router;

