import { DataTypes } from 'sequelize';
import {sequelize} from '../db/index.js';
import Faculty from './faculty.model.js';

const Course = sequelize.define('Course', {
  courseCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  courseTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  academicSession: {
    type: DataTypes.STRING,
    allowNull: false
  },
  instructorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Faculty,
      key: 'id'
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  },
  offeringDepartment: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  credits: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['academicSession', 'courseCode']
    }
  ]
});

Course.belongsTo(Faculty, { foreignKey: 'instructorId', as: 'Faculty' });

export default Course;
