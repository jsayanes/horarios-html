// ===============================
// GOOGLE SHEETS CONFIGURATION
// ===============================

// TODO: Configurar estas variables con tus datos
const GOOGLE_SHEETS_CONFIG = {
    API_KEY: 'TU_API_KEY_AQUI', // Será configurado después
    SHEET_ID: 'TU_SHEET_ID_AQUI', // Será configurado después
    RANGE: 'Horario!A1:H20' // Rango de celdas
};

let isGoogleSheetsReady = false;
let gapi = null;

// ===============================
// SIMPLE DRAG AND DROP SYSTEM
// ===============================

let draggedElement = null;
let draggedFromCell = null;
let originalSchedule = {}; // The permanent default schedule
let temporarySchedule = {}; // Temporary saved schedule
let sessionSchedule = {}; // Current session changes

// ===============================
// INITIALIZATION
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Starting TRUE Binary Schedule System (No Server Required)...');
    
    try {
        // Save original state
        saveOriginalState();
        
        // Initialize all drag and drop FIRST
        initializeSimpleDragDrop();
        
        // Initialize buttons
        initializeButtons();
        
        // Add extra subjects to bank
        addExtraSubjects();
        
        // Initialize editable fields
        initializeEditableFields();
        
        // Initialize session schedule
        updateSessionSchedule();
        
        // Enable offline mode (after everything is set up)
        enableOfflineMode();
        
        // Initialize Google Sheets (optional, will fallback to offline)
        initializeGoogleSheets();
        
        // Auto-save backup every 30 seconds (after everything is ready)
        setTimeout(() => {
            setInterval(saveOfflineBackup, 30000);
        }, 5000);
        
        console.log('✅ TRUE Binary System Ready - Full Offline Mode!');
        
    } catch (error) {
        console.error('❌ Error during initialization:', error);
        
        // Fallback: try to initialize basic drag and drop
        setTimeout(() => {
            try {
                initializeSimpleDragDrop();
                console.log('🔄 Fallback drag and drop initialized');
            } catch (fallbackError) {
                console.error('❌ Fallback failed:', fallbackError);
            }
        }, 1000);
    }
});

// ===============================
// SAVE ORIGINAL STATE
// ===============================
function saveOriginalState() {
    const cells = document.querySelectorAll('.schedule-cell');
    cells.forEach(cell => {
        const day = cell.dataset.day;
        const period = cell.dataset.period;
        const subject = cell.querySelector('.subject');
        
        if (!originalSchedule[day]) {
            originalSchedule[day] = {};
        }
        
        if (subject) {
            originalSchedule[day][period] = {
                text: subject.textContent,
                colorClass: Array.from(subject.classList).find(cls => cls.startsWith('subject-')),
                dataSubject: subject.dataset.subject
            };
        }
    });
    console.log('💾 Original schedule saved');
}

// ===============================
// LOAD SAVED CONFIGURATION
// ===============================
function loadSavedConfiguration() {
    try {
        // First, load permanent default if exists
        const permanent = localStorage.getItem('horario_permanente');
        if (permanent) {
            const permanentSchedule = JSON.parse(permanent);
            console.log('📂 Loading permanent default configuration...');
            
            // Update original schedule to use permanent as default
            originalSchedule = JSON.parse(JSON.stringify(permanentSchedule));
        }
        
        // Then, check for temporary schedule and prioritize it
        const temporary = localStorage.getItem('horario_temporal');
        if (temporary) {
            const temporaryData = JSON.parse(temporary);
            console.log('📂 Loading temporary configuration...');
            
            // Apply temporary configuration to the DOM
            applyScheduleConfiguration(temporaryData);
            
            // Update temporary schedule variable
            temporarySchedule = JSON.parse(JSON.stringify(temporaryData));
            
            console.log('✅ Temporary configuration loaded');
        } else if (permanent) {
            // If no temporary, use permanent
            const permanentSchedule = JSON.parse(permanent);
            applyScheduleConfiguration(permanentSchedule);
            console.log('✅ Permanent configuration loaded');
        } else {
            console.log('📝 No saved configuration found, using built-in default');
        }
    } catch (error) {
        console.error('❌ Error loading saved configuration:', error);
    }
}

function applyScheduleConfiguration(scheduleData) {
    // Clear current schedule
    const cells = document.querySelectorAll('.schedule-cell');
    cells.forEach(cell => {
        const subject = cell.querySelector('.subject');
        if (subject) {
            subject.remove();
        }
    });
    
    // Apply schedule configuration
    Object.keys(scheduleData).forEach(day => {
        Object.keys(scheduleData[day]).forEach(period => {
            const subjectData = scheduleData[day][period];
            if (subjectData) {
                const cell = document.querySelector(`[data-day="${day}"][data-period="${period}"]`);
                if (cell) {
                    const subject = document.createElement('div');
                    subject.className = `subject ${subjectData.colorClass}`;
                    subject.textContent = subjectData.text;
                    subject.dataset.subject = subjectData.dataSubject;
                    subject.draggable = true;
                    subject.dataset.dragSetup = 'false'; // Ensure it can be configured
                    subject.style.opacity = '1';
                    subject.style.transform = '';
                    
                    cell.appendChild(subject);
                    setupSingleSubject(subject);
                }
            }
        });
    });
}

// ===============================
// SAVE/LOAD FUNCTIONS
// ===============================
function getCurrentScheduleState() {
    const currentState = {};
    const cells = document.querySelectorAll('.schedule-cell');
    
    cells.forEach(cell => {
        const day = cell.dataset.day;
        const period = cell.dataset.period;
        const subject = cell.querySelector('.subject');
        
        if (!currentState[day]) {
            currentState[day] = {};
        }
        
        if (subject) {
            currentState[day][period] = {
                text: subject.textContent,
                colorClass: Array.from(subject.classList).find(cls => cls.startsWith('subject-')),
                dataSubject: subject.dataset.subject
            };
        } else {
            currentState[day][period] = null;
        }
    });
    
    return currentState;
}





// ===============================
// INITIALIZE DRAG AND DROP
// ===============================
function initializeSimpleDragDrop() {
    console.log('🎯 Setting up drag and drop...');
    
    // Setup existing subjects
    setupAllSubjects();
    
    // Setup drop zones (cells)
    setupAllCells();
    
    // Setup subject bank
    setupSubjectBank();
    
    console.log('✅ Drag and drop setup complete');
}

function setupAllSubjects() {
    const subjects = document.querySelectorAll('.subject');
    console.log(`📚 Found ${subjects.length} subjects`);
    
    subjects.forEach((subject, index) => {
        setupSingleSubject(subject);
        console.log(`✅ Subject ${index + 1} setup: ${subject.textContent}`);
    });
}

function setupAllCells() {
    const cells = document.querySelectorAll('.schedule-cell');
    console.log(`📋 Setting up ${cells.length} cells`);
    
    cells.forEach(cell => {
        // Allow drop
        cell.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '#e3f2fd';
        });
        
        // Visual feedback
        cell.addEventListener('dragleave', function(e) {
            this.style.backgroundColor = '';
        });
        
        // Handle drop
        cell.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
            
            console.log('📦 Drop in cell:', this.dataset.day, this.dataset.period);
            
            // Check if cell is empty
            if (this.querySelector('.subject')) {
                console.log('❌ Cell occupied');
                return;
            }
            
            // Move subject here
            if (draggedElement) {
                // Clone first (before removing)
                const newSubject = draggedElement.cloneNode(true);
                newSubject.draggable = true;
                
                // IMPORTANT: Clear drag setup to allow re-configuration
                newSubject.dataset.dragSetup = 'false';
                
                // Fix opacity - ensure it's fully visible
                newSubject.style.opacity = '1';
                newSubject.style.transform = '';
                
                // Check if element came from bank
                const fromBank = draggedFromCell && draggedFromCell.classList.contains('subject-bank');
                
                // If from bank, always keep original (duplicate)
                // If from schedule, remove original (move)
                if (!fromBank) {
                    draggedElement.remove();
                }
                
                // Add to new location
                this.appendChild(newSubject);
                
                // Setup drag listeners for new subject
                setupSingleSubject(newSubject);
                
                // Update session schedule automatically
                updateSessionSchedule();
                
                if (fromBank) {
                    console.log('✅ Subject duplicated from bank to schedule:', newSubject.textContent);
                } else {
                    console.log('✅ Subject moved within schedule:', newSubject.textContent);
                }
            }
        });
    });
}

function setupSubjectBank() {
    const bank = document.getElementById('subjectBank');
    if (!bank) {
        console.error('❌ Subject bank not found');
        return;
    }
    
    console.log('🏦 Setting up subject bank');
    
    // Allow drop in bank
    bank.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '#f0f0f0';
    });
    
    bank.addEventListener('dragleave', function(e) {
        this.style.backgroundColor = '';
    });
    
    bank.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '';
        
        console.log('📦 Subject returned to bank');
        
        if (draggedElement) {
            // Clone first (before removing)
            const newSubject = draggedElement.cloneNode(true);
            newSubject.draggable = true;
            
            // IMPORTANT: Clear drag setup to allow re-configuration
            newSubject.dataset.dragSetup = 'false';
            
            // Fix opacity - ensure it's fully visible
            newSubject.style.opacity = '1';
            newSubject.style.transform = '';
            
            // Check if element came from bank or schedule
            const fromBank = draggedFromCell && draggedFromCell.classList.contains('subject-bank');
            
            // If from schedule, remove original (move back to bank)
            // If from bank, keep original (organizing within bank)
            if (!fromBank) {
                draggedElement.remove();
            }
            
            // Add to bank
            const bankContainer = this.querySelector('.d-flex');
            bankContainer.appendChild(newSubject);
            
            // Setup drag listeners
            setupSingleSubject(newSubject);
            
            // Update session schedule automatically
            updateSessionSchedule();
            
            if (fromBank) {
                console.log('✅ Subject reorganized within bank:', newSubject.textContent);
            } else {
                console.log('✅ Subject moved from schedule to bank:', newSubject.textContent);
            }
        }
    });
}

function setupSingleSubject(subject) {
    // Check if already set up to avoid duplicates
    if (subject.dataset.dragSetup === 'true') {
        return;
    }
    
    subject.draggable = true;
    subject.dataset.dragSetup = 'true';
    
    // Ensure full opacity from the start
    subject.style.opacity = '1';
    subject.style.transform = '';
    
    // Create named functions to avoid duplicates
    const dragStartHandler = function(e) {
        console.log('📤 Dragging:', this.textContent);
        draggedElement = this;
        draggedFromCell = this.closest('.schedule-cell') || this.closest('.subject-bank');
        this.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
    };
    
    const dragEndHandler = function(e) {
        console.log('📥 Drag ended:', this.textContent);
        this.style.opacity = '1';
        draggedElement = null;
        draggedFromCell = null;
    };
    
    const contextMenuHandler = function(e) {
        e.preventDefault();
        showColorChangeMenu(this, e);
    };
    
    // Add event listeners
    subject.addEventListener('dragstart', dragStartHandler);
    subject.addEventListener('dragend', dragEndHandler);
    subject.addEventListener('contextmenu', contextMenuHandler);
    
    // If it's a customizable subject, add the text customization functionality
    if (subject.dataset.subject === 'custom' || subject.dataset.subject.startsWith('custom-')) {
        subject.title = 'Doble clic para personalizar texto - Clic derecho para cambiar color';
        subject.style.cursor = 'pointer';
        
        const dblClickHandler = function(e) {
            e.preventDefault();
            customizeButtonText(this);
        };
        
        subject.addEventListener('dblclick', dblClickHandler);
    } else {
        subject.title = 'Clic derecho para cambiar color';
    }
}



// ===============================
// BUTTONS
// ===============================
function initializeButtons() {
    // Temporary save button - saves temporarily without affecting default
    const saveTemporaryBtn = document.getElementById('saveTemporary');
    if (saveTemporaryBtn) {
        saveTemporaryBtn.addEventListener('click', function() {
            saveTemporary();
        });
    }
    
    // Reset button - goes back to permanent default
    const resetBtn = document.getElementById('resetSchedule');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (confirm('¿Resetear al horario por defecto permanente?')) {
                resetToDefault();
            }
        });
    }
    
    // Save button - makes current changes permanent
    const saveBtn = document.getElementById('saveSchedule');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            if (confirm('¿Hacer PERMANENTE la configuración actual? Esto reemplazará el horario por defecto.')) {
                makePermanent();
            }
        });
        console.log('💾 Save button configured');
    }
}

// ===============================
// SESSION MANAGEMENT
// ===============================
function updateSessionSchedule() {
    sessionSchedule = getCurrentScheduleState();
    console.log('🔄 Session updated automatically');
    
    // Auto-save to Google Sheets
    autoSaveToGoogleSheets();
}

function resetToDefault() {
    console.log('🔄 Resetting to permanent default...');
    
    // Clear all cells
    const cells = document.querySelectorAll('.schedule-cell');
    cells.forEach(cell => {
        const subject = cell.querySelector('.subject');
        if (subject) {
            subject.remove();
        }
    });
    
    // Restore original subjects (permanent default)
    Object.keys(originalSchedule).forEach(day => {
        Object.keys(originalSchedule[day]).forEach(period => {
            const subjectData = originalSchedule[day][period];
            if (subjectData) {
                const cell = document.querySelector(`[data-day="${day}"][data-period="${period}"]`);
                if (cell) {
                    const subject = document.createElement('div');
                    subject.className = `subject ${subjectData.colorClass}`;
                    subject.textContent = subjectData.text;
                    subject.dataset.subject = subjectData.dataSubject;
                    subject.draggable = true;
                    subject.dataset.dragSetup = 'false'; // Ensure it can be configured
                    
                    // Ensure full opacity
                    subject.style.opacity = '1';
                    subject.style.transform = '';
                    
                    cell.appendChild(subject);
                    setupSingleSubject(subject);
                }
            }
        });
    });
    
    // Clear bank and re-add extras
    const bankContainer = document.querySelector('#subjectBank .d-flex');
    if (bankContainer) {
        bankContainer.innerHTML = '';
    }
    addExtraSubjects();
    
    // Update session to match default
    updateSessionSchedule();
    
    console.log('✅ Reset to default complete');
    showNotification('Horario restablecido al por defecto', 'success');
}

function saveTemporary() {
    console.log('📝 Saving current schedule temporarily...');
    
    const currentState = getCurrentScheduleState();
    
    try {
        // Save to localStorage as temporary
        localStorage.setItem('horario_temporal', JSON.stringify(currentState));
        
        // Update temporary schedule
        temporarySchedule = JSON.parse(JSON.stringify(currentState));
        
        console.log('✅ Schedule saved temporarily');
        showNotification('Horario guardado TEMPORALMENTE', 'info');
        
    } catch (error) {
        console.error('❌ Error saving temporarily:', error);
        showNotification('Error al guardar temporalmente', 'danger');
    }
}

function makePermanent() {
    console.log('💾 Making current schedule permanent...');
    
    const currentState = getCurrentScheduleState();
    
    try {
        // Save to localStorage as permanent default
        localStorage.setItem('horario_permanente', JSON.stringify(currentState));
        
        // Update original schedule to be the new default
        originalSchedule = JSON.parse(JSON.stringify(currentState));
        
        console.log('✅ Schedule made permanent');
        showNotification('Horario guardado como PERMANENTE', 'success');
        
    } catch (error) {
        console.error('❌ Error making permanent:', error);
        showNotification('Error al guardar permanentemente', 'danger');
    }
}

// ===============================
// EXTRA SUBJECTS
// ===============================
function addExtraSubjects() {
    const bankContainer = document.querySelector('#subjectBank .d-flex');
    if (!bankContainer) {
        console.error('❌ Bank container not found!');
        return;
    }
    
    console.log('✅ Bank container found:', bankContainer);
    
    // Original subjects that should be available in bank
    const originalSubjects = [
        { text: '9°1', colorClass: 'subject-pink', dataSubject: '9-1' },
        { text: '9°2', colorClass: 'subject-blue', dataSubject: '9-2' },
        { text: '9°3', colorClass: 'subject-orange', dataSubject: '9-3' },
        { text: '9°4', colorClass: 'subject-red', dataSubject: '9-4' },
        { text: '8°1', colorClass: 'subject-violet', dataSubject: '8-1' },
        { text: '8°2', colorClass: 'subject-purple', dataSubject: '8-2' },
        { text: '8°3', colorClass: 'subject-green', dataSubject: '8-3' }
    ];
    
    // Extra subjects
    const extraSubjects = [
        { text: '7°1', colorClass: 'subject-teal', dataSubject: '7-1' },
        { text: '7°2', colorClass: 'subject-indigo', dataSubject: '7-2' },
        { text: '7°3', colorClass: 'subject-lime', dataSubject: '7-3' },
        { text: '7°4', colorClass: 'subject-coral', dataSubject: '7-4' },
        { text: '8°4', colorClass: 'subject-lavender', dataSubject: '8-4' }
    ];
    
    // Combine all subjects
    const allSubjects = [...originalSubjects, ...extraSubjects];
    
    allSubjects.forEach(data => {
        const subject = document.createElement('div');
        subject.className = `subject ${data.colorClass}`;
        subject.textContent = data.text;
        subject.dataset.subject = data.dataSubject;
        subject.draggable = true;
        subject.dataset.dragSetup = 'false'; // Ensure it can be configured
        
        // Ensure full opacity
        subject.style.opacity = '1';
        subject.style.transform = '';
        
        bankContainer.appendChild(subject);
        setupSingleSubject(subject);
        
        console.log('✅ Added subject to bank:', data.text);
    });
    
    // Add customizable button
    addCustomizableButton(bankContainer);
    
    console.log('📚 All subjects added to bank - Total:', allSubjects.length + 1);
}

// ===============================
// CUSTOMIZABLE BUTTON
// ===============================
function addCustomizableButton(container) {
    const customButton = document.createElement('div');
    customButton.className = 'subject subject-cyan';
    customButton.textContent = '✏️ Personalizar';
    customButton.dataset.subject = 'custom';
    customButton.draggable = true;
    customButton.dataset.dragSetup = 'false'; // Ensure it can be configured
    customButton.style.opacity = '1';
    customButton.style.transform = '';
    customButton.style.cursor = 'pointer';
    
    container.appendChild(customButton);
    setupSingleSubject(customButton);
    
    console.log('🎨 Customizable button added');
}

function customizeButtonText(button) {
    const currentText = button.textContent.replace('✏️ ', '');
    const newText = prompt('Ingresa el texto para esta materia:', currentText === 'Personalizar' ? '' : currentText);
    
    if (newText !== null && newText.trim() !== '') {
        button.textContent = newText.trim();
        button.dataset.subject = 'custom-' + newText.trim().toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        // Show notification
        showNotification(`Materia personalizada: "${newText.trim()}"`, 'success');
        
        // Update session schedule automatically
        updateSessionSchedule();
        
        console.log('✏️ Custom subject created:', newText.trim());
    }
}

// ===============================
// COLOR CHANGE FUNCTIONALITY
// ===============================
let currentSubjectForColorChange = null;

// Editable fields data
let editableFieldsData = {
    profesor: '',
    liceo: '', 
    turno: '',
    ciudad: ''
};

function showColorChangeMenu(subject, event) {
    currentSubjectForColorChange = subject;
    
    // Populate color grid
    populateColorGrid();
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('colorPickerModal'));
    modal.show();
}

function populateColorGrid() {
    const availableColors = [
        { name: 'Naranja', class: 'subject-orange', color: '#fd7e14' },
        { name: 'Rojo', class: 'subject-red', color: '#dc3545' },
        { name: 'Verde Fluor', class: 'subject-green', color: '#00b347' },
        { name: 'Morado', class: 'subject-purple', color: '#6f42c1' },
        { name: 'Azul', class: 'subject-blue', color: '#0d6efd' },
        { name: 'Amarillo', class: 'subject-yellow', color: '#ffc107' },
        { name: 'Cian', class: 'subject-cyan', color: '#20c997' },
        { name: 'Rosa Fluor', class: 'subject-pink', color: '#ff69b4' },
        { name: 'Violeta', class: 'subject-violet', color: '#9c27b0' },
        { name: 'Teal', class: 'subject-teal', color: '#17a2b8' },
        { name: 'Índigo', class: 'subject-indigo', color: '#6610f2' },
        { name: 'Lima', class: 'subject-lime', color: '#cddc39' },
        { name: 'Coral', class: 'subject-coral', color: '#ff7043' },
        { name: 'Lavanda', class: 'subject-lavender', color: '#9575cd' }
    ];
    
    const colorGrid = document.getElementById('colorGrid');
    colorGrid.innerHTML = '';
    
    availableColors.forEach(colorData => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.onclick = () => selectColor(colorData);
        
        const colorSample = document.createElement('div');
        colorSample.className = 'color-sample';
        colorSample.style.backgroundColor = colorData.color;
        colorSample.textContent = '9°1';
        
        // Special text color for light backgrounds
        if (colorData.class === 'subject-yellow' || colorData.class === 'subject-lime') {
            colorSample.style.color = '#000';
            colorSample.style.textShadow = '1px 1px 2px rgba(255, 255, 255, 0.5)';
        }
        
        const colorName = document.createElement('div');
        colorName.className = 'color-name';
        colorName.textContent = colorData.name;
        
        colorOption.appendChild(colorSample);
        colorOption.appendChild(colorName);
        colorGrid.appendChild(colorOption);
    });
}

function selectColor(colorData) {
    if (currentSubjectForColorChange) {
        changeSubjectColor(currentSubjectForColorChange, colorData);
        
        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('colorPickerModal'));
        modal.hide();
        
        currentSubjectForColorChange = null;
    }
}

function changeSubjectColor(subject, colorData) {
    // Remove all color classes
    const colorClasses = [
        'subject-orange', 'subject-red', 'subject-green', 'subject-purple',
        'subject-blue', 'subject-yellow', 'subject-cyan', 'subject-pink',
        'subject-violet', 'subject-teal', 'subject-indigo', 'subject-lime',
        'subject-coral', 'subject-lavender'
    ];
    
    colorClasses.forEach(cls => subject.classList.remove(cls));
    
    // Add new color class
    subject.classList.add(colorData.class);
    
    // Show notification
    showNotification(`Color cambiado a ${colorData.name}`, 'success');
    
    // Update session schedule automatically
    updateSessionSchedule();
    
    console.log('🎨 Color changed to:', colorData.name, 'for subject:', subject.textContent);
}

// ===============================
// TEST FUNCTION
// ===============================
function testSystem() {
    console.log('🧪 Testing system...');
    
    const subjects = document.querySelectorAll('.subject');
    const cells = document.querySelectorAll('.schedule-cell');
    
    console.log(`Found ${subjects.length} subjects`);
    console.log(`Found ${cells.length} cells`);
    
    subjects.forEach((subject, i) => {
        console.log(`Subject ${i+1}: ${subject.textContent} - Draggable: ${subject.draggable}`);
    });
    
    console.log('✅ Test complete');
}

// Run test after 1 second
setTimeout(testSystem, 1000);

// ===============================
// NOTIFICATION SYSTEM
// ===============================
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
    
    console.log(`📢 Notification: ${message}`);
}

// ===============================
// GOOGLE SHEETS INTEGRATION
// ===============================

function initializeGoogleSheets() {
    console.log('🔄 Initializing Google Sheets API...');
    
    // Cargar Google API
    if (typeof gapi !== 'undefined') {
        gapi.load('client', initializeGoogleSheetsClient);
    } else {
        console.log('⏳ Waiting for Google API to load...');
        setTimeout(initializeGoogleSheets, 1000);
    }
}

function initializeGoogleSheetsClient() {
    console.log('🔧 Initializing Google Sheets client...');
    
    gapi.client.init({
        apiKey: GOOGLE_SHEETS_CONFIG.API_KEY,
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
    }).then(function() {
        console.log('✅ Google Sheets API initialized');
        isGoogleSheetsReady = true;
        
        // Cargar datos desde Google Sheets
        loadFromGoogleSheets();
        
    }).catch(function(error) {
        console.error('❌ Error initializing Google Sheets:', error);
        showNotification('Error conectando con Google Sheets. Usando modo local.', 'warning');
        
        // Fallback a localStorage si falla Google Sheets
        loadSavedConfiguration();
    });
}

function loadFromGoogleSheets() {
    if (!isGoogleSheetsReady) {
        console.log('⚠️ Google Sheets not ready, using local storage');
        loadSavedConfiguration();
        return;
    }
    
    console.log('📥 Loading schedule from Google Sheets...');
    
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.SHEET_ID,
        range: GOOGLE_SHEETS_CONFIG.RANGE
    }).then(function(response) {
        const values = response.result.values;
        
        if (values && values.length > 0) {
            console.log('✅ Data loaded from Google Sheets');
            parseGoogleSheetsData(values);
            showNotification('Horario cargado desde Google Sheets', 'success');
        } else {
            console.log('📄 No data in Google Sheets, using default');
            showNotification('Google Sheets vacío, usando horario por defecto', 'info');
        }
        
    }).catch(function(error) {
        console.error('❌ Error loading from Google Sheets:', error);
        showNotification('Error cargando desde Google Sheets. Usando modo local.', 'warning');
        
        // Fallback a localStorage
        loadSavedConfiguration();
    });
}

function saveToGoogleSheets() {
    if (!isGoogleSheetsReady) {
        console.log('⚠️ Google Sheets not ready, saving to localStorage');
        saveEditableFieldsToStorage();
        return;
    }
    
    console.log('💾 Saving to Google Sheets...');
    
    const scheduleData = getCurrentScheduleState();
    const values = convertScheduleToSheetsFormat(scheduleData);
    
    gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: GOOGLE_SHEETS_CONFIG.SHEET_ID,
        range: GOOGLE_SHEETS_CONFIG.RANGE,
        valueInputOption: 'RAW',
        resource: {
            values: values
        }
    }).then(function(response) {
        console.log('✅ Data saved to Google Sheets');
        showNotification('Horario guardado en Google Sheets', 'success');
        
    }).catch(function(error) {
        console.error('❌ Error saving to Google Sheets:', error);
        showNotification('Error guardando en Google Sheets', 'danger');
    });
}

function parseGoogleSheetsData(values) {
    // TODO: Convertir datos de Google Sheets al formato del horario
    console.log('🔄 Parsing Google Sheets data:', values);
    
    // Por ahora, usar el formato existente
    // Implementar conversión específica según la estructura del Sheet
}

function convertScheduleToSheetsFormat(scheduleData) {
    // TODO: Convertir horario actual al formato de Google Sheets
    console.log('🔄 Converting schedule to Sheets format');
    
    const values = [
        ['Hora', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'], // Header
        // Convertir datos del horario
    ];
    
    // Implementar conversión específica
    return values;
}

// Auto-save to Google Sheets when changes are made
function autoSaveToGoogleSheets() {
    if (isGoogleSheetsReady) {
        // Debounce - solo guardar después de 2 segundos sin cambios
        clearTimeout(window.autoSaveTimeout);
        window.autoSaveTimeout = setTimeout(saveToGoogleSheets, 2000);
    }
}

// ===============================
// TRUE BINARY FILE PERSISTENCE - NO SERVER REQUIRED
// ===============================

// Definir constantes para el formato binario personalizado
const BINARY_FORMAT = {
    MAGIC_NUMBER: 0x484F5241, // 'HORA' en hexadecimal
    VERSION: 1,
    MAX_STRING_LENGTH: 255,
    MAX_PERIODS: 9,
    MAX_DAYS: 5,
    COLOR_CLASSES: {
        'subject-orange': 0,
        'subject-red': 1,
        'subject-green': 2,
        'subject-purple': 3,
        'subject-blue': 4,
        'subject-yellow': 5,
        'subject-cyan': 6,
        'subject-pink': 7,
        'subject-violet': 8,
        'subject-teal': 9,
        'subject-indigo': 10,
        'subject-lime': 11,
        'subject-coral': 12,
        'subject-lavender': 13
    }
};

// Invertir el mapeo de colores para la deserialización
const COLOR_CLASSES_REVERSE = Object.fromEntries(
    Object.entries(BINARY_FORMAT.COLOR_CLASSES).map(([k, v]) => [v, k])
);

function saveToBinaryFile() {
    console.log('💾 Saving schedule to TRUE binary file (no server)...');
    
    try {
        // Crear buffer binario personalizado
        const binaryData = serializeScheduleToBinary();
        
        // Crear archivo binario descargable
        const blob = new Blob([binaryData], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `horario_${new Date().toISOString().slice(0, 10)}.hbin`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Schedule saved to TRUE binary file');
        showNotification('Horario guardado en formato binario real', 'success');
        
    } catch (error) {
        console.error('❌ Error saving to binary file:', error);
        showNotification('Error al guardar archivo binario', 'danger');
    }
}

function serializeScheduleToBinary() {
    console.log('🔄 Serializing to custom binary format...');
    
    // Calcular el tamaño necesario del buffer
    const bufferSize = calculateBufferSize();
    const buffer = new ArrayBuffer(bufferSize);
    const view = new DataView(buffer);
    let offset = 0;
    
    // 1. HEADER: Magic number y versión
    view.setUint32(offset, BINARY_FORMAT.MAGIC_NUMBER, false); // Big endian
    offset += 4;
    view.setUint16(offset, BINARY_FORMAT.VERSION, false);
    offset += 2;
    
    // 2. TIMESTAMP (8 bytes)
    const timestamp = BigInt(Date.now());
    view.setBigUint64(offset, timestamp, false);
    offset += 8;
    
    // 3. METADATA (campos editables)
    offset = writeStringToBuffer(view, offset, editableFieldsData.profesor || '');
    offset = writeStringToBuffer(view, offset, editableFieldsData.liceo || '');
    offset = writeStringToBuffer(view, offset, editableFieldsData.turno || '');
    offset = writeStringToBuffer(view, offset, editableFieldsData.ciudad || '');
    
    // 4. HORARIO ACTUAL
    offset = writeScheduleToBuffer(view, offset, getCurrentScheduleState());
    
    // 5. HORARIO ORIGINAL
    offset = writeScheduleToBuffer(view, offset, originalSchedule);
    
    // 6. HORARIO TEMPORAL
    offset = writeScheduleToBuffer(view, offset, temporarySchedule);
    
    console.log(`✅ Binary serialization complete. Size: ${offset} bytes`);
    return buffer.slice(0, offset); // Recortar al tamaño real usado
}

function calculateBufferSize() {
    // Estimación conservadora del tamaño necesario
    const headerSize = 4 + 2 + 8; // magic + version + timestamp
    const metadataSize = 4 * (1 + BINARY_FORMAT.MAX_STRING_LENGTH); // 4 strings
    const scheduleSize = 3 * (2 + (BINARY_FORMAT.MAX_DAYS * BINARY_FORMAT.MAX_PERIODS * 
                            (1 + 1 + BINARY_FORMAT.MAX_STRING_LENGTH + BINARY_FORMAT.MAX_STRING_LENGTH))); // 3 horarios
    
    return headerSize + metadataSize + scheduleSize;
}

function writeStringToBuffer(view, offset, str) {
    const truncatedStr = str.substring(0, BINARY_FORMAT.MAX_STRING_LENGTH);
    const encoder = new TextEncoder();
    const encoded = encoder.encode(truncatedStr);
    
    // Escribir longitud (1 byte)
    view.setUint8(offset, encoded.length);
    offset += 1;
    
    // Escribir datos de string
    for (let i = 0; i < encoded.length; i++) {
        view.setUint8(offset + i, encoded[i]);
    }
    offset += encoded.length;
    
    return offset;
}

function writeScheduleToBuffer(view, offset, schedule) {
    const startOffset = offset;
    
    // Reservar espacio para el tamaño del horario
    offset += 2;
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    for (const day of days) {
        const daySchedule = schedule[day] || {};
        
        for (let period = 0; period < BINARY_FORMAT.MAX_PERIODS; period++) {
            const subject = daySchedule[period.toString()];
            
            if (subject) {
                // Marcar que hay subject (1 byte)
                view.setUint8(offset, 1);
                offset += 1;
                
                // Escribir color class (1 byte)
                const colorIndex = BINARY_FORMAT.COLOR_CLASSES[subject.colorClass] || 0;
                view.setUint8(offset, colorIndex);
                offset += 1;
                
                // Escribir texto del subject
                offset = writeStringToBuffer(view, offset, subject.text || '');
                
                // Escribir dataSubject
                offset = writeStringToBuffer(view, offset, subject.dataSubject || '');
            } else {
                // Marcar que NO hay subject (1 byte)
                view.setUint8(offset, 0);
                offset += 1;
            }
        }
    }
    
    // Escribir el tamaño real del horario al principio
    const scheduleSize = offset - startOffset - 2;
    view.setUint16(startOffset, scheduleSize, false);
    
    return offset;
}

function saveToTextFile() {
    console.log('📄 Saving schedule to text file...');
    
    // Recopilar todos los datos del horario
    const scheduleData = {
        version: '1.0',
        schedule: getCurrentScheduleState(),
        metadata: editableFieldsData,
        timestamp: Date.now(),
        originalSchedule: originalSchedule,
        temporarySchedule: temporarySchedule,
        // Agregar información legible para humanos
        humanReadable: {
            saveDate: new Date().toLocaleString(),
            profesor: editableFieldsData.profesor || 'Sin especificar',
            liceo: editableFieldsData.liceo || 'Sin especificar',
            turno: editableFieldsData.turno || 'Sin especificar',
            ciudad: editableFieldsData.ciudad || 'Sin especificar'
        }
    };
    
    try {
        // Convertir a JSON con formato legible (indentado)
        const jsonString = JSON.stringify(scheduleData, null, 2);
        
        // Crear archivo de texto descargable
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `horario_escolar_${new Date().toISOString().slice(0, 10)}.json`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Schedule saved to text file');
        showNotification('Horario guardado en archivo JSON', 'success');
        
    } catch (error) {
        console.error('❌ Error saving to text file:', error);
        showNotification('Error al guardar archivo JSON', 'danger');
    }
}

function loadFromBinaryFile(file) {
    console.log('📥 Loading schedule from TRUE binary file (no server)...');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const buffer = e.target.result;
            console.log(`📂 Reading binary file: ${file.name}, Size: ${buffer.byteLength} bytes`);
            
            // Deserializar desde formato binario personalizado
            const data = deserializeScheduleFromBinary(buffer);
            
            console.log('✅ Binary deserialization complete');
            
            // Aplicar configuración del horario
            if (data.currentSchedule) {
                applyScheduleConfiguration(data.currentSchedule);
                console.log('✅ Current schedule applied');
            }
            
            // Aplicar metadatos (campos editables)
            if (data.metadata) {
                editableFieldsData = { ...editableFieldsData, ...data.metadata };
                applyEditableFieldsData();
                console.log('✅ Metadata applied');
            }
            
            // Restaurar horarios originales y temporales
            if (data.originalSchedule) {
                originalSchedule = data.originalSchedule;
                console.log('✅ Original schedule restored');
            }
            
            if (data.temporarySchedule) {
                temporarySchedule = data.temporarySchedule;
                console.log('✅ Temporary schedule restored');
            }
            
            // Actualizar el estado de la sesión
            updateSessionSchedule();
            
            // Mostrar información del archivo cargado
            const saveDate = new Date(Number(data.timestamp));
            console.log('✅ Schedule loaded from TRUE binary file successfully');
            showNotification(`Horario binario cargado (guardado: ${saveDate.toLocaleString()})`, 'success');
            
        } catch (error) {
            console.error('❌ Error loading from binary file:', error);
            showNotification(`Error al cargar archivo binario: ${error.message}`, 'danger');
        }
    };
    
    reader.onerror = function() {
        console.error('❌ Error reading binary file');
        showNotification('Error al leer el archivo binario', 'danger');
    };
    
    reader.readAsArrayBuffer(file);
}

function deserializeScheduleFromBinary(buffer) {
    console.log('🔄 Deserializing from custom binary format...');
    
    const view = new DataView(buffer);
    let offset = 0;
    
    // 1. VALIDAR HEADER
    const magicNumber = view.getUint32(offset, false);
    offset += 4;
    
    if (magicNumber !== BINARY_FORMAT.MAGIC_NUMBER) {
        throw new Error(`Archivo binario inválido. Magic number: 0x${magicNumber.toString(16)}`);
    }
    
    const version = view.getUint16(offset, false);
    offset += 2;
    
    if (version !== BINARY_FORMAT.VERSION) {
        throw new Error(`Versión no soportada: ${version}. Esperada: ${BINARY_FORMAT.VERSION}`);
    }
    
    console.log(`📋 Binary file validated - Magic: 0x${magicNumber.toString(16)}, Version: ${version}`);
    
    // 2. LEER TIMESTAMP
    const timestamp = view.getBigUint64(offset, false);
    offset += 8;
    
    // 3. LEER METADATA
    const metadata = {};
    const result = readStringFromBuffer(view, offset);
    metadata.profesor = result.str;
    offset = result.newOffset;
    
    const result2 = readStringFromBuffer(view, offset);
    metadata.liceo = result2.str;
    offset = result2.newOffset;
    
    const result3 = readStringFromBuffer(view, offset);
    metadata.turno = result3.str;
    offset = result3.newOffset;
    
    const result4 = readStringFromBuffer(view, offset);
    metadata.ciudad = result4.str;
    offset = result4.newOffset;
    
    // 4. LEER HORARIOS
    const currentScheduleResult = readScheduleFromBuffer(view, offset);
    const currentSchedule = currentScheduleResult.schedule;
    offset = currentScheduleResult.newOffset;
    
    const originalScheduleResult = readScheduleFromBuffer(view, offset);
    const originalSchedule = originalScheduleResult.schedule;
    offset = originalScheduleResult.newOffset;
    
    const temporaryScheduleResult = readScheduleFromBuffer(view, offset);
    const temporarySchedule = temporaryScheduleResult.schedule;
    offset = temporaryScheduleResult.newOffset;
    
    console.log(`✅ Deserialization complete. Processed ${offset} bytes.`);
    
    return {
        timestamp,
        metadata,
        currentSchedule,
        originalSchedule,
        temporarySchedule
    };
}

function readStringFromBuffer(view, offset) {
    // Leer longitud del string
    const length = view.getUint8(offset);
    offset += 1;
    
    // Leer bytes del string
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bytes[i] = view.getUint8(offset + i);
    }
    offset += length;
    
    // Decodificar a string
    const decoder = new TextDecoder();
    const str = decoder.decode(bytes);
    
    return { str, newOffset: offset };
}

function readScheduleFromBuffer(view, offset) {
    // Leer tamaño del horario
    const scheduleSize = view.getUint16(offset, false);
    offset += 2;
    const scheduleEndOffset = offset + scheduleSize;
    
    const schedule = {};
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    for (const day of days) {
        schedule[day] = {};
        
        for (let period = 0; period < BINARY_FORMAT.MAX_PERIODS; period++) {
            if (offset >= scheduleEndOffset) break;
            
            // Leer si hay subject
            const hasSubject = view.getUint8(offset);
            offset += 1;
            
            if (hasSubject) {
                // Leer color class
                const colorIndex = view.getUint8(offset);
                offset += 1;
                const colorClass = COLOR_CLASSES_REVERSE[colorIndex] || 'subject-orange';
                
                // Leer texto del subject
                const textResult = readStringFromBuffer(view, offset);
                offset = textResult.newOffset;
                
                // Leer dataSubject
                const dataSubjectResult = readStringFromBuffer(view, offset);
                offset = dataSubjectResult.newOffset;
                
                schedule[day][period.toString()] = {
                    text: textResult.str,
                    colorClass: colorClass,
                    dataSubject: dataSubjectResult.str
                };
            }
        }
    }
    
    return { schedule, newOffset: scheduleEndOffset };
}

function loadFromTextFile(file) {
    console.log('📥 Loading schedule from text file...');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validar estructura básica
            if (!data.schedule && !data.metadata) {
                throw new Error('Archivo JSON no válido: estructura incorrecta');
            }
            
            console.log('📂 Text file loaded');
            
            // Aplicar configuración del horario
            if (data.schedule) {
                applyScheduleConfiguration(data.schedule);
                console.log('✅ Schedule configuration applied');
            }
            
            // Aplicar metadatos
            if (data.metadata) {
                editableFieldsData = { ...editableFieldsData, ...data.metadata };
                applyEditableFieldsData();
                console.log('✅ Metadata applied');
            }
            
            // Restaurar horarios si existen
            if (data.originalSchedule) {
                originalSchedule = data.originalSchedule;
            }
            
            if (data.temporarySchedule) {
                temporarySchedule = data.temporarySchedule;
            }
            
            // Actualizar el estado de la sesión
            updateSessionSchedule();
            
            console.log('✅ Schedule loaded from text file successfully');
            showNotification('Horario cargado desde archivo JSON', 'success');
            
        } catch (error) {
            console.error('❌ Error loading from text file:', error);
            showNotification(`Error al cargar archivo JSON: ${error.message}`, 'danger');
        }
    };
    
    reader.onerror = function() {
        console.error('❌ Error reading text file');
        showNotification('Error al leer el archivo JSON', 'danger');
    };
    
    reader.readAsText(file);
}

function handleFileLoad(input) {
    const file = input.files[0];
    if (!file) {
        console.log('❌ No file selected');
        return;
    }
    
    console.log('📁 File selected:', file.name, 'Size:', file.size, 'bytes');
    
    const fileName = file.name.toLowerCase();
    
    // Detectar tipo de archivo por extensión
    if (fileName.endsWith('.json')) {
        console.log('🔍 Detected JSON file');
        loadFromTextFile(file);
    } else if (fileName.endsWith('.hbin') || fileName.endsWith('.bin')) {
        console.log('🔍 Detected binary file');
        loadFromBinaryFile(file);
    } else {
        console.log('❌ Unsupported file format');
        showNotification('Formato de archivo no soportado. Use .json o .hbin', 'warning');
    }
    
    // Limpiar el input para permitir cargar el mismo archivo otra vez
    input.value = '';
}

function applyEditableFieldsData() {
    // Aplicar los datos de campos editables al DOM
    Object.keys(editableFieldsData).forEach(fieldName => {
        const field = document.querySelector(`[data-field="${fieldName}"]`);
        if (field) {
            field.textContent = editableFieldsData[fieldName] || '';
        }
    });
}

function compareBinaryVsText() {
    console.log('📊 Comparing TRUE binary vs JSON formats...');
    
    try {
        // Datos completos para comparación justa
        const fullScheduleData = {
            version: '1.0',
            schedule: getCurrentScheduleState(),
            metadata: editableFieldsData,
            timestamp: Date.now(),
            originalSchedule: originalSchedule,
            temporarySchedule: temporarySchedule,
            humanReadable: {
                saveDate: new Date().toLocaleString(),
                profesor: editableFieldsData.profesor || 'Sin especificar',
                liceo: editableFieldsData.liceo || 'Sin especificar',
                turno: editableFieldsData.turno || 'Sin especificar',
                ciudad: editableFieldsData.ciudad || 'Sin especificar'
            }
        };
        
        // Tamaño como JSON (formato texto)
        const jsonString = JSON.stringify(fullScheduleData, null, 2);
        const jsonSize = new Blob([jsonString]).size;
        
        // Tamaño como binario REAL (formato personalizado)
        const binaryData = serializeScheduleToBinary();
        const binarySize = binaryData.byteLength;
        
        // Calcular estadísticas
        const difference = jsonSize - binarySize;
        const compressionRatio = ((difference / jsonSize) * 100).toFixed(1);
        const sizeFactor = (jsonSize / binarySize).toFixed(1);
        
        console.log('📊 COMPARISON RESULTS:');
        console.log(`📄 JSON File: ${jsonSize} bytes`);
        console.log(`🗃️ TRUE Binary File: ${binarySize} bytes`);
        console.log(`💾 Space Saved: ${difference} bytes (${compressionRatio}%)`);
        console.log(`⚡ Size Factor: ${sizeFactor}x smaller`);
        
        // Mostrar en interfaz con más detalles
        showNotification(
            `📊 JSON: ${jsonSize}b | Binario: ${binarySize}b | ` +
            `Ahorro: ${difference}b (${compressionRatio}%) | ` +
            `${sizeFactor}x más pequeño`, 
            'info'
        );
        
        // Log adicional sobre eficiencia
        if (binarySize > 0) {
            const efficiencyScore = Math.round((1 - binarySize/jsonSize) * 100);
            console.log(`🏆 Binary Efficiency Score: ${efficiencyScore}%`);
        }
        
    } catch (error) {
        console.error('❌ Error during comparison:', error);
        showNotification('Error al comparar formatos', 'danger');
    }
}

// Función para trabajar completamente offline - LocalStorage como backup
function enableOfflineMode() {
    console.log('📱 Enabling full offline mode...');
    
    try {
        // Verificar capacidades del navegador
        const capabilities = {
            localStorage: typeof(Storage) !== 'undefined',
            fileApi: window.File && window.FileReader && window.FileList && window.Blob,
            dataView: typeof DataView !== 'undefined',
            bigInt: typeof BigInt !== 'undefined'
        };
        
        console.log('🔍 Browser capabilities check:', capabilities);
        
        const allCapable = Object.values(capabilities).every(cap => cap);
        
        if (allCapable) {
            console.log('✅ All required capabilities available - Full offline mode enabled');
            
            // Verificar si showNotification existe antes de usarla
            if (typeof showNotification === 'function') {
                showNotification('Modo offline completo habilitado', 'success');
            }
            
            // Auto-guardar en localStorage como backup
            saveOfflineBackup();
            
            return true;
        } else {
            console.warn('⚠️ Some capabilities missing:', capabilities);
            
            // Verificar si showNotification existe antes de usarla
            if (typeof showNotification === 'function') {
                showNotification('Algunas funciones offline limitadas', 'warning');
            }
            return false;
        }
    } catch (error) {
        console.error('❌ Error in enableOfflineMode:', error);
        return false;
    }
}

function saveOfflineBackup() {
    try {
        // Guardar una copia en localStorage como backup
        const backupData = {
            timestamp: Date.now(),
            schedule: getCurrentScheduleState(),
            metadata: editableFieldsData,
            version: 'offline-backup'
        };
        
        localStorage.setItem('horario_offline_backup', JSON.stringify(backupData));
        console.log('💾 Offline backup saved to localStorage');
        
    } catch (error) {
        console.error('❌ Error saving offline backup:', error);
    }
}

function loadOfflineBackup() {
    try {
        const backup = localStorage.getItem('horario_offline_backup');
        if (backup) {
            const data = JSON.parse(backup);
            console.log('📂 Loading offline backup from localStorage...');
            
            if (data.schedule) {
                applyScheduleConfiguration(data.schedule);
            }
            
            if (data.metadata) {
                editableFieldsData = { ...editableFieldsData, ...data.metadata };
                applyEditableFieldsData();
            }
            
            updateSessionSchedule();
            
            const backupDate = new Date(data.timestamp);
            showNotification(`Backup offline cargado (${backupDate.toLocaleString()})`, 'info');
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Error loading offline backup:', error);
        return false;
    }
}

// Función para mostrar información técnica del archivo binario
function analyzeBinaryFile() {
    try {
        const binaryData = serializeScheduleToBinary();
        const view = new DataView(binaryData);
        
        console.log('🔬 BINARY FILE ANALYSIS:');
        console.log(`📏 Total size: ${binaryData.byteLength} bytes`);
        console.log(`🔢 Magic number: 0x${view.getUint32(0, false).toString(16).toUpperCase()}`);
        console.log(`📋 Version: ${view.getUint16(4, false)}`);
        console.log(`⏰ Timestamp: ${new Date(Number(view.getBigUint64(6, false))).toLocaleString()}`);
        
        // Analizar distribución de datos
        const headerSize = 4 + 2 + 8; // magic + version + timestamp
        const metadataStart = headerSize;
        
        console.log(`📊 Header: ${headerSize} bytes`);
        console.log(`📝 Data starts at byte: ${metadataStart}`);
        
        showNotification(`Análisis: ${binaryData.byteLength} bytes total`, 'info');
        
    } catch (error) {
        console.error('❌ Error analyzing binary file:', error);
    }
}

// ===============================
// EDITABLE FIELDS FUNCTIONALITY
// ===============================
function initializeEditableFields() {
    loadEditableFieldsData();
    setupEditableFieldsListeners();
    console.log('✏️ Editable fields initialized');
}

function setupEditableFieldsListeners() {
    const editableFields = document.querySelectorAll('.editable-field');
    
    editableFields.forEach(field => {
        // Save data when field loses focus
        field.addEventListener('blur', function() {
            saveEditableFieldData(this);
        });
        
        // Save data when Enter is pressed
        field.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.blur(); // This will trigger the blur event
            }
        });
        
        // Prevent drag behavior on editable fields
        field.addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
    });
}

function saveEditableFieldData(field) {
    const fieldName = field.dataset.field;
    const value = field.textContent.trim();
    
    if (fieldName) {
        editableFieldsData[fieldName] = value;
        saveEditableFieldsToStorage();
        console.log(`✅ Field "${fieldName}" saved:`, value || '(vacío)');
    }
}

function saveEditableFieldsToStorage() {
    try {
        localStorage.setItem('horario_campos_editables', JSON.stringify(editableFieldsData));
    } catch (error) {
        console.error('❌ Error saving editable fields:', error);
    }
}

function loadEditableFieldsData() {
    try {
        const saved = localStorage.getItem('horario_campos_editables');
        if (saved) {
            const savedData = JSON.parse(saved);
            editableFieldsData = { ...editableFieldsData, ...savedData };
            
            // Apply to DOM
            Object.keys(editableFieldsData).forEach(fieldName => {
                const field = document.querySelector(`[data-field="${fieldName}"]`);
                if (field) {
                    field.textContent = editableFieldsData[fieldName] || '';
                }
            });
            
            console.log('✅ Editable fields data loaded');
        }
    } catch (error) {
        console.error('❌ Error loading editable fields:', error);
    }
}

function resetEditableFields() {
    // Reset to default values
    editableFieldsData = {
        profesor: '',
        liceo: '', 
        turno: '',
        ciudad: ''
    };
    
    // Apply to DOM
    Object.keys(editableFieldsData).forEach(fieldName => {
        const field = document.querySelector(`[data-field="${fieldName}"]`);
        if (field) {
            field.textContent = editableFieldsData[fieldName] || '';
        }
    });
    
    saveEditableFieldsToStorage();
    console.log('🔄 Editable fields reset to default');
}

