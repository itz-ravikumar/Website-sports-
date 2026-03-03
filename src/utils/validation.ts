export const ROLL_NUMBER_REGEX = /^\d{12}$/;
export const ROLL_NUMBER_EXAMPLE = '202401021002';
export const ROLL_NUMBER_ERROR_MESSAGE = `Invalid Roll Number! CITK Roll Numbers must be 12 digits (e.g., ${ROLL_NUMBER_EXAMPLE}).`;

export const sanitizeRollNumberInput = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 12);
};

export const isValidRollNumber = (rollNumber: string): boolean => {
  return ROLL_NUMBER_REGEX.test(rollNumber.trim());
};
