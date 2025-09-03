@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

:root {
    --primary-color: #007bff;
    --secondary-color: #6c757d;
    --card-bg: #ffffff;
    --body-bg: #f4f7f9;
    --text-color: #333;
    --light-text: #6c757d;
    --border-color: #dee2e6;
    --passed-bg: #e7f5ec;
    --passed-text: #0f5132;
    --failed-bg: #fbebee;
    --failed-text: #b02a37;
    --danger-color: #dc3545;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: 'Poppins', sans-serif;
    background-color: var(--body-bg);
    color: var(--text-color);
    padding: 10px;
}

.calculator-container {
    background-color: var(--card-bg);
    border-radius: 12px;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 900px;
    margin: 20px auto;
}

.tabs { display: flex; background-color: #f8f9fa; }

.tab-btn {
    flex-grow: 1; padding: 15px 10px; font-size: 14px;
    font-weight: 600; cursor: pointer; border: none;
    background-color: transparent; color: var(--secondary-color);
    border-bottom: 3px solid transparent; transition: all 0.2s;
}

.tab-btn.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }

.calculator-content { padding: 24px; }

.input-section { margin-bottom: 24px; }

.input-section label {
    display: block; font-weight: 600;
    margin-bottom: 8px; font-size: 14px;
}

select, input {
    width: 100%; padding: 10px; border: 1px solid var(--border-color);
    border-radius: 8px; font-size: 14px; font-family: 'Poppins', sans-serif;
    background-color: #fff;
}

.table-wrapper { overflow-x: auto; }

.courses-table {
    width: 100%; border-collapse: collapse; margin-bottom: 20px;
}

.courses-table th, .courses-table td {
    text-align: center; padding: 12px 8px;
    border-bottom: 1px solid var(--border-color);
    white-space: nowrap;
}

.courses-table th {
    font-size: 12px; color: var(--light-text);
    text-transform: uppercase; font-weight: 600;
}

.courses-table td { vertical-align: middle; }

.courses-table input { min-width: 70px; text-align: center; }

.result-cell { font-weight: 600; }

.status-passed { color: var(--passed-text); background-color: var(--passed-bg); }
.status-failed { color: var(--failed-text); background-color: var(--failed-bg); }

.delete-row-btn {
    background-color: var(--failed-bg); color: var(--danger-color); border: none;
    width: 30px; height: 30px; border-radius: 50%;
    cursor: pointer; font-weight: bold; transition: background-color 0.2s;
}
.delete-row-btn:hover{ background-color: #f1c1c5; }

button {
    width: 100%; padding: 14px; border: none; border-radius: 8px;
    font-size: 16px; font-weight: 700; cursor: pointer;
    transition: background-color 0.2s; margin-top: 10px;
}

.primary-btn { background-color: var(--primary-color); color: white; }
.primary-btn:hover { background-color: #0056b3; }

.secondary-btn {
    background-color: #e9ecef; color: var(--secondary-color);
    border: none;
}
.secondary-btn:hover { background-color: #dee2e6; }

.result-area {
    margin-top: 24px; padding: 20px; border-radius: 8px;
    text-align: center; font-size: 20px; font-weight: 700;
    display: none; /* JS ile gösterilecek */
}
