/**
 * Export data as CSV and trigger download
 * @param headers - Array of column headers
 * @param data - 2D array of data rows
 * @param filename - Name of the CSV file (without extension)
 */
export const downloadCSV = (
  headers: string[],
  data: any[][],
  filename: string
): void => {
  try {
    const csv = [headers, ...data]
      .map((row) =>
        row
          .map((cell) => {
            const cellStr = String(cell ?? '');
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('CSV export failed:', error);
    throw new Error('Failed to export CSV file');
  }
};

/**
 * Convert sports records to CSV format
 */
export const recordsToCSV = (records: any[]): [string[], any[][]] => {
  const headers = ['ID', 'Roll Number', 'Item Name', 'Issued Date', 'Expected Return', 'Actual Return', 'Status'];
  const data = records.map((record) => [
    record.id,
    record.rollNumber,
    record.itemName,
    record.issuedDate,
    record.expectedReturnDate,
    record.actualReturnDate || '-',
    record.status,
  ]);
  return [headers, data];
};

/**
 * Convert inventory items to CSV format
 */
export const inventoryToCSV = (inventory: any[]): [string[], any[][]] => {
  const headers = ['ID', 'Item Name', 'Total Stock', 'Available Stock', 'Condition', 'Added Date'];
  const data = inventory.map((item) => [
    item.id,
    item.itemName,
    item.totalStock,
    item.availableStock,
    item.condition,
    item.addedDate,
  ]);
  return [headers, data];
};
