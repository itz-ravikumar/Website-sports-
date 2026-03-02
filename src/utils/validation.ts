import { ROLL_NUMBER_REGEX } from '../constants';

export const validateRollNumber = (rollNumber: string): boolean => {
  return ROLL_NUMBER_REGEX.test(rollNumber);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateItemName = (name: string): boolean => {
  return name.trim().length > 0 && name.trim().length <= 100;
};

export const validateDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};

export const validateStock = (stock: number): boolean => {
  return Number.isInteger(stock) && stock >= 0;
};