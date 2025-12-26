import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db/index.js';

const Faculty = sequelize.define('Faculty', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  otpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isAdvisor: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: true 
});

export default Faculty;


