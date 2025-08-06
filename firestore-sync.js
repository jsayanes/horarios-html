// ========================================
// FIRESTORE REAL-TIME SYNCHRONIZATION
// ========================================

// Configuración de Firebase (REEMPLAZAR con tus credenciales)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAz3a1CupLRuk7nMzKYSL9PKhjvMDfM0SU",
  authDomain: "horarios-netlify.firebaseapp.com",
  projectId: "horarios-netlify",
  storageBucket: "horarios-netlify.firebasestorage.app",
  messagingSenderId: "87586753693",
  appId: "1:87586753693:web:eaa78274062ed52da05874"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
  
  // Variables globales
  let db = null;
  let horarioDoc = null;
  let unsubscribe = null;
  let isLocalUpdate = false;
  let lastUpdateTime = 0;
  
  // Inicializar Firestore
  async function initializeFirestore() {
      console.log('🔥 Initializing Firestore...');
      
      try {
          // Esperar a que los módulos estén disponibles
          if (!window.FirebaseModules) {
              console.log('⏳ Waiting for Firebase modules...');
              setTimeout(initializeFirestore, 500);
              return;
          }
          
          const { initializeApp, getFirestore, doc, onSnapshot, setDoc, getDoc } = window.FirebaseModules;
          
          // Inicializar Firebase
          const app = initializeApp(FIRESTORE_CONFIG);
          db = getFirestore(app);
          
          // Referencia al documento principal
          horarioDoc = doc(db, 'horarios', 'principal');
          
          // Escuchar cambios en tiempo real
          unsubscribe = onSnapshot(horarioDoc, (docSnapshot) => {
              if (docSnapshot.exists() && !isLocalUpdate) {
                  const data = docSnapshot.data();
                  
                  // Evitar loops infinitos
                  if (data.timestamp && data.timestamp > lastUpdateTime) {
                      console.log('📥 Received update from Firestore');
                      applyRemoteChanges(data);
                      lastUpdateTime = data.timestamp;
                  }
              }
          }, (error) => {
              console.error('❌ Firestore listener error:', error);
              showNotification('Error en sincronización', 'danger');
          });
          
          // Cargar datos iniciales
          await loadFromFirestore();
          
          // Crear indicador de estado
          createStatusIndicator();
          
          console.log('✅ Firestore initialized successfully');
          showNotification('🔄 Sincronización en tiempo real activada', 'success');
          
      } catch (error) {
          console.error('❌ Firestore initialization error:', error);
          showNotification('Error al conectar con Firestore', 'danger');
      }
  }
  
  // Guardar en Firestore
  async function saveToFirestore() {
      if (!db || !horarioDoc) {
          console.log('⚠️ Firestore not ready');
          return;
      }
      
      const { setDoc } = window.FirebaseModules;
      
      try {
          isLocalUpdate = true;
          const timestamp = Date.now();
          
          const dataToSave = {
              timestamp: timestamp,
              schedule: getCurrentScheduleState(),
              metadata: editableFieldsData,
              lastDevice: navigator.userAgent.substring(0, 100),
              lastUpdate: new Date().toISOString(),
              version: '2.0'
          };
          
          await setDoc(horarioDoc, dataToSave);
          lastUpdateTime = timestamp;
          
          console.log('✅ Saved to Firestore');
          updateStatusIndicator('saved');
          
          setTimeout(() => { isLocalUpdate = false; }, 1000);
          
      } catch (error) {
          console.error('❌ Firestore save error:', error);
          showNotification('Error al guardar en la nube', 'danger');
          isLocalUpdate = false;
      }
  }
  
  // Cargar desde Firestore
  async function loadFromFirestore() {
      if (!db || !horarioDoc) return;
      
      const { getDoc } = window.FirebaseModules;
      
      console.log('📥 Loading from Firestore...');
      
      try {
          const docSnapshot = await getDoc(horarioDoc);
          
          if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              applyRemoteChanges(data);
              lastUpdateTime = data.timestamp || 0;
              console.log('✅ Loaded from Firestore');
          } else {
              console.log('📄 No data in Firestore, saving current state...');
              await saveToFirestore();
          }
      } catch (error) {
          console.error('❌ Firestore load error:', error);
          showNotification('Error al cargar desde la nube', 'warning');
      }
  }
  
  // Aplicar cambios remotos
  function applyRemoteChanges(data) {
      console.log('🔄 Applying remote changes...');
      
      // Aplicar horario
      if (data.schedule) {
          applyScheduleConfiguration(data.schedule);
      }
      
      // Aplicar metadata
      if (data.metadata) {
          editableFieldsData = { ...editableFieldsData, ...data.metadata };
          applyEditableFieldsData();
      }
      
      // Actualizar sesión local
      updateSessionSchedule();
      
      // Mostrar notificación
      const updateTime = new Date(data.timestamp);
      showNotification(
          `📱 Sincronizado (${updateTime.toLocaleTimeString()})`,
          'info'
      );
      
      updateStatusIndicator('synced');
  }
  
  // Indicador de estado visual
  function createStatusIndicator() {
      const indicator = document.createElement('div');
      indicator.id = 'sync-status';
      indicator.innerHTML = `
          <span id="sync-icon">🔄</span>
          <span id="sync-text">Conectando...</span>
      `;
      indicator.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: white;
          padding: 10px 15px;
          border-radius: 25px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          z-index: 9999;
          transition: all 0.3s ease;
      `;
      
      document.body.appendChild(indicator);
      
      // Actualizar estado inicial
      setTimeout(() => updateStatusIndicator('connected'), 1000);
  }
  
  function updateStatusIndicator(status) {
      const icon = document.getElementById('sync-icon');
      const text = document.getElementById('sync-text');
      const indicator = document.getElementById('sync-status');
      
      if (!icon || !text || !indicator) return;
      
      switch(status) {
          case 'connected':
              icon.textContent = '☁️';
              text.textContent = 'Sincronizado';
              indicator.style.background = '#d4edda';
              break;
          case 'saving':
              icon.textContent = '📤';
              text.textContent = 'Guardando...';
              indicator.style.background = '#fff3cd';
              break;
          case 'saved':
              icon.textContent = '✅';
              text.textContent = 'Guardado';
              indicator.style.background = '#d4edda';
              setTimeout(() => updateStatusIndicator('connected'), 2000);
              break;
          case 'synced':
              icon.textContent = '📥';
              text.textContent = 'Actualizado';
              indicator.style.background = '#cce5ff';
              setTimeout(() => updateStatusIndicator('connected'), 2000);
              break;
          case 'error':
              icon.textContent = '❌';
              text.textContent = 'Sin conexión';
              indicator.style.background = '#f8d7da';
              break;
      }
  }
  
  // Auto-guardar con debounce
  let saveTimeout = null;
  
  function autoSaveToFirestore() {
      updateStatusIndicator('saving');
      
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
          saveToFirestore();
      }, 1000); // Esperar 1 segundo después del último cambio
  }
  
  // Exportar funciones globales
  window.firestoreSync = {
      initialize: initializeFirestore,
      save: saveToFirestore,
      autoSave: autoSaveToFirestore
  };
  
  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
          setTimeout(initializeFirestore, 1500);
      });
  } else {
      setTimeout(initializeFirestore, 1500);
  }