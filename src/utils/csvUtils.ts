
// Function to export data to CSV
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

// Function to import data from CSV
export const importFromCSV = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target || !event.target.result) {
          reject("Error reading file");
          return;
        }
        
        const csvContent = event.target.result.toString();
        const lines = csvContent.split('\r\n');
        
        if (lines.length === 1) {
          // Try another line break format
          const newLines = csvContent.split('\n');
          if (newLines.length > 1) {
            lines.splice(0, 1, ...newLines);
          }
        }
        
        if (!lines || lines.length < 2) {
          reject("Invalid CSV format: file has insufficient data");
          return;
        }
        
        // Parse header row
        const headers = parseCSVLine(lines[0]).map(header => {
          // Remove quotes if present
          return header.replace(/^"(.+)"$/g, '$1');
        });
        
        // Parse data rows
        const data = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue; // Skip empty lines
          
          const rowValues = parseCSVLine(line);
          if (rowValues.length !== headers.length) {
            console.warn(`Line ${i + 1} has ${rowValues.length} values but header has ${headers.length} columns`);
            continue; // Skip malformed lines
          }
          
          const rowObject: Record<string, any> = {};
          headers.forEach((header, index) => {
            // Clean up value - remove quotes and trim
            let value = rowValues[index].replace(/^"(.+)"$/g, '$1').trim();
            
            // Try to parse specific data types
            if (header.toLowerCase().includes('date')) {
              const dateObj = new Date(value);
              if (!isNaN(dateObj.getTime())) {
                rowObject[header] = dateObj.toISOString().split('T')[0]; // Format as YYYY-MM-DD
              } else {
                rowObject[header] = value;
              }
            } else if (value === 'true' || value === 'yes' || value === '1') {
              rowObject[header] = true;
            } else if (value === 'false' || value === 'no' || value === '0') {
              rowObject[header] = false;
            } else if (!isNaN(Number(value)) && value !== '') {
              rowObject[header] = Number(value);
            } else {
              rowObject[header] = value;
            }
          });
          
          data.push(rowObject);
        }
        
        resolve(data);
      } catch (error) {
        console.error("Error parsing CSV:", error);
        reject("Error parsing CSV file: " + error);
      }
    };
    
    reader.onerror = () => {
      reject("Error reading file");
    };
    
    reader.readAsText(file);
  });
};

// Helper function to parse CSV line and handle quoted values correctly
const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      // If we see a quote followed by another quote while in quotes, it's an escaped quote
      if (inQuotes && line[i + 1] === '"') {
        currentValue += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of value
      values.push(currentValue);
      currentValue = '';
    } else {
      // Add character to current value
      currentValue += char;
    }
  }
  
  // Add the last value
  values.push(currentValue);
  
  return values;
};
