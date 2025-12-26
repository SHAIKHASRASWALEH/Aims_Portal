import Faculty from '../models/faculty.model.js';

// Create a new faculty member
export const createFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all faculty members
export const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findAll();
    res.status(200).json(faculty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single faculty member by ID
export const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.params.id);
    if (faculty) {
      res.status(200).json(faculty);
    } else {
      res.status(404).json({ error: 'Faculty not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a faculty member by ID
export const updateFaculty = async (req, res) => {
  try {
    const [updated] = await Faculty.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedFaculty = await Faculty.findByPk(req.params.id);
      res.status(200).json(updatedFaculty);
    } else {
      res.status(404).json({ error: 'Faculty not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a faculty member by ID
export const deleteFaculty = async (req, res) => {
  try {
    const deleted = await Faculty.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Faculty deleted successfully' });
    } else {
      res.status(404).json({ error: 'Faculty not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
