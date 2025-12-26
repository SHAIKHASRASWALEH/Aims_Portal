import Student from '../models/student.model.js';
import Faculty from '../models/faculty.model.js';
import Enrollment from '../models/enrollment.model.js';

// Middleware to check if the user can view a student's profile
export const canViewStudentProfile = async (req, res, next) => {
  try {
    const { id, role } = req.user; // Extract user ID and role from token
    const studentID = req.params.id; // Extract the ID of the student profile being requested

    if (role === 'faculty' || role === 'admin') {
      // Faculty can view all student profiles
      return next();
    } else if (role === 'student' && id === parseInt(studentID)) {
      // Students can only view their own profile
      return next();
    }

    res.status(403).json({ message: 'Access forbidden: cannot view this profile' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware to check if the user can view a faculty profile
export const canViewFacultyProfile = async (req, res, next) => {
  try {
    const { id, role } = req.user; // Extract user ID and role from token
    const facultyId = req.params.id; // Extract the ID of the faculty profile being requested
    if (role === 'faculty' && id === parseInt(facultyId) || role === 'admin') {
      // Faculty can view their own profile
      return next();
    }

    res.status(403).json({ message: 'Access forbidden: cannot view this profile' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const onlyAdmin = async (req, res, next) => {
  try {
    const { role } = req.user; 
    
    if (role === 'admin') {
      return next();
    }

    res.status(403).json({ message: 'Access forbidden: only admins can do this' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const canEnrollStudent = async (req, res, next) => {
  try {
    const { id, role } = req.user; // Extract user ID and role from token
    const studentID = req.body.studentID; // Extract the ID of the student profile being requested
    console.log(req.body,id,role);
    if (role === 'faculty' || role === 'admin') {
      return next();
    } else if (role === 'student' && id == studentID) {
      return next();
    }

    res.status(403).json({ message: 'Access forbidden: cannot enroll other student'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const instructorApproval = async (req, res, next) => {
  try {
    const { id, role } = req.user; // Extract user ID and role from token
    
    if (role === 'faculty' || role === 'admin') {
      // Faculty can view all student profiles
      return next();
    }

    res.status(403).json({ message: 'Access forbidden: only faculty can enroll' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const advisorApproval = async (req, res, next) => {
  try {
    const { id, role } = req.user; // Extract user ID and role from token

    if (role === 'admin') {
      // Admins can proceed
      return next();
    } else if (role === 'faculty') {
      const faculty = await Faculty.findByPk(id);

      if (!faculty) {
        return res.status(404).json({ message: 'Faculty member not found' });
      }

      if (faculty.isAdvisor) {
        return next();
      }
    }

    res.status(403).json({ message: 'Access forbidden: only advisor can enroll ' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const canCreateCourse = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const facultyId = req.body.instructorId;

    if (role === 'faculty' && id === parseInt(facultyId) || role === 'admin') {
      return next();
    }

    res.status(403).json({ message: 'Access forbidden: cannot create course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};