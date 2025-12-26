import express from 'express';
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/course.controller.js';
import { canCreateCourse, onlyAdmin } from '../middlewares/authorizationMiddleware.js';
import {authenticate} from '../middlewares/authMiddleware.js';
const router = express.Router();
router.use(authenticate);

router.post('/', canCreateCourse, createCourse);
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.put('/:id', onlyAdmin, updateCourse);
router.delete('/:id', onlyAdmin, deleteCourse);

export default router;
