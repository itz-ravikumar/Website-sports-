export interface SportsRecord {
  id: string;
  rollNumber: string;
  itemName: string;
  issuedDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: 'Active' | 'Returned' | 'Overdue';
}

export interface InventoryItem {
  id: string;
  itemName: string;
  totalStock: number;
  availableStock: number;
  condition: string;
  addedDate: string;
}

export interface SportsRequest {
  id: string;
  rollNumber: string;
  itemName: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  studentName?: string;
}