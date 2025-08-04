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
    console.log('🚀 Starting Simple Drag and Drop System...');
    
    // Save original state
    saveOriginalState();
    
    // Load saved configuration if exists
    loadSavedConfiguration();
    
    // Initialize all drag and drop
    initializeSimpleDragDrop();
    
    // Initialize buttons
    initializeButtons();
    
    // Add extra subjects to bank
    addExtraSubjects();
    
    // Initialize editable fields
    initializeEditableFields();
    
    // Initialize session schedule
    updateSessionSchedule();
    
    console.log('✅ Simple System Ready!');
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

