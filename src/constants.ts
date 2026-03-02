export const STORAGE_KEYS = {
  SPORTS_RECORDS: 'citk_sports_records',
  SPORTS_INVENTORY: 'citk_sports_inventory',
  SPORTS_REQUESTS: 'citk_sports_requests',
  ADMIN_SESSION: 'citk_is_admin',
} as const;

export const TIME_ZONES = ['IST', 'UTC', 'EST', 'CST', 'PST'];

export const DEFAULT_RETURN_WINDOW = 7; // days

export const ROLL_NUMBER_REGEX = /^\d{12}$/;
export const ROLL_NUMBER_LENGTH = 12;