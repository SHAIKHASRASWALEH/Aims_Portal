import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db/index.js';
import Student from './student.model.js';
import Course from './course.model.js';

const Enrollment = sequelize.define('Enrollment', {
  enrollmentType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  studentID: {
    type: DataTypes.INTEGER,
    references: {
      model: Student,
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  courseID: {
    type: DataTypes.INTEGER,
    references: {
      model: Course,
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['studentID', 'courseID']
    }
  ]
});


Student.hasMany(Enrollment, { foreignKey: 'studentID' });
Course.hasMany(Enrollment, { foreignKey: 'courseID' });
Enrollment.belongsTo(Student, { foreignKey: 'studentID' });
Enrollment.belongsTo(Course, { foreignKey: 'courseID' });

export default Enrollment;
