// ===== DOM ELEMENTS =====
const form1 = document.getElementById('form1');                // Main form for adding full entry
const addEmployeeForm = document.getElementById('addEmployeeForm'); // Form for adding employee names
const addPartForm = document.getElementById('addPartForm');         // Form for adding part numbers
const tableBody = document.querySelector('#dataTable tbody');       // Table body for displaying entries
const employeeSelect = document.getElementById('employeeName1');    // Dropdown for employee names
const partSelect = document.getElementById('partNumber1');          // Dropdown for part numbers

// ===== DATA STORAGE =====
let employeeNames = JSON.parse(localStorage.getItem('employeeNames')) || []; // Load employee names from localStorage
let partNumbers = JSON.parse(localStorage.getItem('partNumbers')) || [];     // Load part numbers from localStorage

// ===== INITIAL LOAD =====
// When page loads, populate table and dropdowns from saved data
window.addEventListener('load', () => {
  const savedData = JSON.parse(localStorage.getItem('partsData')) || [];
  
  // Add saved rows to table
  savedData.forEach(data => addRowToTable(data));
  
  // Populate dropdowns
  employeeNames.forEach(name => addOption(employeeSelect, name));
  partNumbers.forEach(part => addOption(partSelect, part));
});

// ===== FORM 1: ADD FULL ENTRY =====
form1.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Collect form data into an object
  const formData = new FormData(form1);
  const data = Object.fromEntries(formData.entries());
  
  // Save entry to localStorage
  const savedData = JSON.parse(localStorage.getItem('partsData')) || [];
  savedData.push(data);
  localStorage.setItem('partsData', JSON.stringify(savedData));
  
  // Update dropdowns if new employee or part
  updateDropdowns(data.employeeName, data.partNumber);
  
  // Add row to table
  addRowToTable(data);
  
  // Reset form
  form1.reset();
});

// ===== ADD EMPLOYEE NAME =====
addEmployeeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('employeeName2').value.trim();
  
  if (name && !employeeNames.includes(name)) {
    employeeNames.push(name);
    localStorage.setItem('employeeNames', JSON.stringify(employeeNames));
    addOption(employeeSelect, name);
  }
  
  addEmployeeForm.reset();
});

// ===== ADD PART NUMBER =====
addPartForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const part = document.getElementById('partNumber2').value.trim();
  
  if (part && !partNumbers.includes(part)) {
    partNumbers.push(part);
    localStorage.setItem('partNumbers', JSON.stringify(partNumbers));
    addOption(partSelect, part);
  }
  
  addPartForm.reset();
});

// ===== HELPER FUNCTIONS =====

// Add a row to the table
function addRowToTable(data) {
  const newRow = tableBody.insertRow();
  newRow.insertCell(0).textContent = data.employeeName;
  newRow.insertCell(1).textContent = data.jobNumber;
  newRow.insertCell(2).textContent = data.partNumber;
  newRow.insertCell(3).textContent = data.quantity;
  newRow.insertCell(4).textContent = data.datePulled;
}

// Add an option to a dropdown
function addOption(select, value) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = value;
  select.appendChild(option);
}

// Update dropdowns dynamically when new data is added
function updateDropdowns(employeeName, partNumber) {
  if (employeeName && !employeeNames.includes(employeeName)) {
    employeeNames.push(employeeName);
    localStorage.setItem('employeeNames', JSON.stringify(employeeNames));
    addOption(employeeSelect, employeeName);
  }
  
  if (partNumber && !partNumbers.includes(partNumber)) {
    partNumbers.push(partNumber);
    localStorage.setItem('partNumbers', JSON.stringify(partNumbers));
    addOption(partSelect, partNumber);
  }
}

// ===== TODAY BUTTON =====
// Fills date field with today's date
document.getElementById('todayDateBtn').addEventListener('click', (e) => {
  e.preventDefault();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('datePulled1').value = today;
});

// ===== EXPORT TO CSV =====
document.getElementById('exportBtn').addEventListener('click', () => {
  let csv = 'Employee Name,Job Number,Part Number,Quantity,Date Pulled\n';
  
  // Get all rows from table
  const rows = tableBody.querySelectorAll('tr');
  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
    const rowData = Array.from(cells).map(cell => `"${cell.textContent}"`).join(',');
    csv += rowData + '\n';
  });
  
  // Download as CSV file
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'parts_tracker.csv';
  a.click();
  URL.revokeObjectURL(url);
});

// ===== EXPORT TO TXT =====
document.getElementById('exportTxtBtn').addEventListener('click', () => {
  const savedData = JSON.parse(localStorage.getItem('partsData')) || [];
  let txt = '';
  
  savedData.forEach(entry => {
    txt += `Employee Name: ${entry.employeeName}\n`;
    txt += `Job Number: ${entry.jobNumber}\n`;
    txt += `Part Number: ${entry.partNumber}\n`;
    txt += `Quantity: ${entry.quantity}\n`;
    txt += `Date Pulled: ${entry.datePulled}\n`;
    txt += '----------\n';
  });
  
  // Download as TXT file
  const blob = new Blob([txt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'parts_tracker.txt';
  a.click();
  URL.revokeObjectURL(url);
});
