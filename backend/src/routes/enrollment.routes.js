import express from 'express';
import { createEnrollment, getAllEnrollments, getEnrollmentById, getEnrollmentsByCourseId, getPendingInstAppEnrollmentsByFacultyId, getPendingAdvAppEnrollments, getEnrollmentsByStudentId, updateEnrollment, deleteEnrollment, instructorApproveEnrollment, advisorApproveEnrollment, rejectEnrollment } from '../controllers/enrollment.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { advisorApproval, canEnrollStudent, canViewFacultyProfile, instructorApproval, onlyAdmin } from '../middlewares/authorizationMiddleware.js';

const router = express.Router();
router.use(authenticate);

router.post('/', canEnrollStudent, createEnrollment);
router.get('/', onlyAdmin, getAllEnrollments);
router.get('/pendingInstructorApproval/:id', canViewFacultyProfile, getPendingInstAppEnrollmentsByFacultyId);
router.get('/pendingAdvisorApproval', advisorApproval, getPendingAdvAppEnrollments);
router.get('/:id', getEnrollmentById);
router.get('/course/:courseID', getEnrollmentsByCourseId);
router.get('/student/:studentID', getEnrollmentsByStudentId);
router.put('/:id', onlyAdmin, updateEnrollment);
router.delete('/:id', onlyAdmin, deleteEnrollment);
router.patch('/:id/instructor-approve', instructorApproval, instructorApproveEnrollment);
router.patch('/:id/advisor-approve', advisorApproval, advisorApproveEnrollment);
router.patch('/:id/reject', onlyAdmin, rejectEnrollment);

export default router;
