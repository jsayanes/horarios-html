// ========================================
// SCRIPT PARA PROBAR FUNCIONAMIENTO EN PRODUCCIÓN
// ========================================

console.log('🧪 Iniciando pruebas de producción...');

// Test 1: Verificar que Firebase esté configurado
function testFirebaseConfig() {
    console.log('\n📋 Test 1: Verificando configuración Firebase...');
    
    if (window.FIREBASE_CONFIG) {
        console.log('✅ Configuración Firebase encontrada');
        console.log('🔧 Proyecto:', window.FIREBASE_CONFIG.projectId);
        console.log('🌐 Auth Domain:', window.FIREBASE_CONFIG.authDomain);
        return true;
    } else {
        console.error('❌ Configuración Firebase NO encontrada');
        return false;
    }
}

// Test 2: Verificar módulos de Firebase
function testFirebaseModules() {
    console.log('\n📋 Test 2: Verificando módulos Firebase...');
    
    if (window.FirebaseModules) {
        console.log('✅ Módulos Firebase cargados');
        const modules = Object.keys(window.FirebaseModules);
        console.log('📦 Módulos disponibles:', modules);
        return true;
    } else {
        console.error('❌ Módulos Firebase NO cargados');
        return false;
    }
}

// Test 3: Verificar funcionalidad de Firestore
function testFirestoreConnection() {
    console.log('\n📋 Test 3: Probando conexión Firestore...');
    
    if (window.firestoreSync) {
        console.log('✅ FirestoreSync disponible');
        console.log('🔧 Métodos:', Object.keys(window.firestoreSync));
        return true;
    } else {
        console.error('❌ FirestoreSync NO disponible');
        return false;
    }
}

// Test 4: Verificar sincronización
function testSyncFunctionality() {
    console.log('\n📋 Test 4: Probando sincronización...');
    
    // Verificar si hay elementos draggables
    const subjects = document.querySelectorAll('.subject');
    const cells = document.querySelectorAll('.schedule-cell');
    
    console.log(`📚 Materias encontradas: ${subjects.length}`);
    console.log(`📋 Celdas de horario: ${cells.length}`);
    
    if (subjects.length > 0 && cells.length > 0) {
        console.log('✅ Elementos de interfaz correctos');
        return true;
    } else {
        console.error('❌ Elementos de interfaz faltantes');
        return false;
    }
}

// Test 5: Verificar LocalStorage
function testLocalStorage() {
    console.log('\n📋 Test 5: Verificando LocalStorage...');
    
    try {
        localStorage.setItem('test_horarios', 'test_value');
        const value = localStorage.getItem('test_horarios');
        localStorage.removeItem('test_horarios');
        
        if (value === 'test_value') {
            console.log('✅ LocalStorage funcionando');
            return true;
        } else {
            console.error('❌ LocalStorage no responde correctamente');
            return false;
        }
    } catch (error) {
        console.error('❌ Error en LocalStorage:', error);
        return false;
    }
}

// Ejecutar todas las pruebas
function runAllTests() {
    console.log('🚀 Ejecutando todas las pruebas...\n');
    
    const tests = [
        { name: 'Configuración Firebase', test: testFirebaseConfig },
        { name: 'Módulos Firebase', test: testFirebaseModules },
        { name: 'Conexión Firestore', test: testFirestoreConnection },
        { name: 'Funcionalidad Sync', test: testSyncFunctionality },
        { name: 'LocalStorage', test: testLocalStorage }
    ];
    
    let passed = 0;
    let failed = 0;
    
    tests.forEach((testCase, index) => {
        try {
            const result = testCase.test();
            if (result) {
                passed++;
            } else {
                failed++;
            }
        } catch (error) {
            console.error(`❌ Error en test "${testCase.name}":`, error);
            failed++;
        }
    });
    
    console.log('\n📊 RESULTADOS FINALES:');
    console.log(`✅ Pruebas exitosas: ${passed}`);
    console.log(`❌ Pruebas fallidas: ${failed}`);
    console.log(`📈 Porcentaje de éxito: ${Math.round((passed / tests.length) * 100)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON! El sistema está funcionando correctamente.');
        
        // Mostrar notificación si está disponible
        if (typeof showNotification === 'function') {
            showNotification('🎉 Todas las pruebas de producción exitosas', 'success');
        }
    } else {
        console.log('\n⚠️ Algunas pruebas fallaron. Revisar configuración.');
        
        if (typeof showNotification === 'function') {
            showNotification(`⚠️ ${failed} pruebas fallaron - revisar console`, 'warning');
        }
    }
    
    return { passed, failed, total: tests.length };
}

// Auto-ejecutar pruebas cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runAllTests, 3000); // Esperar 3 segundos para que todo esté cargado
    });
} else {
    setTimeout(runAllTests, 3000);
}

// Exportar función para uso manual
window.testProduction = runAllTests;