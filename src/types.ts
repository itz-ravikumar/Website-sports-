export type SportsRecordStatus = 'Active' | 'Overdue' | 'Returned';
export type InventoryCondition = 'Good' | 'Damaged' | 'Needs Replacement';
export type SportsRequestStatus = 'Pending' | 'Approved' | 'Rejected';
export type CurrentPage = 'home' | 'inventory';

export interface StudentProfile {
  studentName: string;
  rollNumber: string;
  branch: string;
  program: string;
  year: string;
}

export interface SportsRecord extends StudentProfile {
  id: string;
  itemName: string;
  category: string;
  issueDate: string;
  expectedReturnDate: string;
  status: SportsRecordStatus;
}

export interface InventoryItem {
  id: string;
  name: string;
  totalQuantity: number;
  availableQuantity: number;
  condition: InventoryCondition;
}

export interface SportsRequest extends StudentProfile {
  id: string;
  itemName: string;
  requestDate: string;
  status: SportsRequestStatus;
}

export interface IssueFormData extends StudentProfile {
  itemName: string;
  category: string;
  issueDate: string;
  expectedReturnDate: string;
}

export interface InventoryFormData {
  name: string;
  totalQuantity: number;
  condition: InventoryCondition;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RequestFormData extends StudentProfile {
  itemName: string;
}

export interface StudentStatusRecord extends SportsRecord {
  type: 'record';
}

export interface StudentStatusRequest extends SportsRequest {
  type: 'request';
}

export type StudentStatusItem = StudentStatusRecord | StudentStatusRequest;
