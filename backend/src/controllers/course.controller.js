import Course from '../models/course.model.js';
import Faculty from '../models/faculty.model.js';

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({'message':'Course already exists'});
    }
    res.status(400).json({ error: error.message });
  }
};

// Get all courses
// Get all courses with instructor name
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{
        model: Faculty,
        attributes: ['firstName','lastName'],
        as: 'Faculty'
      }]
    });
    if(courses.length === 0) {
      return res.status(404).json({ message: 'No courses found' });
    }
    else res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a course by ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a course by ID
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Course.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedCourse = await Course.findByPk(id);
      res.status(200).json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a course by ID
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Course.destroy({
      where: { id }
    });
    if (deleted) {
      res.status(200).json({ message: 'Course deleted successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
