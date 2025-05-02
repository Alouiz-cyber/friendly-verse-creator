
export const exportToCSV = (data: any[], columns: { key: string, label: string }[], filename: string) => {
  if (!data || !data.length) return;
  
  // Create header row
  const header = columns.map(col => `"${col.label}"`).join(',');
  
  // Create data rows
  const rows = data.map(item => {
    return columns.map(col => {
      // Handle dates for better formatting
      if (col.key.includes('date') && item[col.key]) {
        const date = new Date(item[col.key]);
        return `"${date.toLocaleDateString()}"`;
      }
      // Handle null or undefined values
      if (item[col.key] === null || item[col.key] === undefined) {
        return `""`;
      }
      // Handle boolean values
      if (typeof item[col.key] === 'boolean') {
        return `"${item[col.key] ? 'Yes' : 'No'}"`;
      }
      // Handle number values
      if (typeof item[col.key] === 'number') {
        return `"${item[col.key]}"`;
      }
      // Handle string values (escape quotes)
      return `"${String(item[col.key] || '').replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  // Combine header and rows
  const csvContent = [header, ...rows].join('\r\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};
