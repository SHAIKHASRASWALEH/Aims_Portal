import { Sequelize, DataTypes } from 'sequelize';
import {sequelize} from '../db/index.js';

const Admin = sequelize.define('Admin', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  otp : {
    type: DataTypes.STRING,
  },
  otpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: false
});

export default Admin;
