// ========================================
// FIREBASE CONFIGURATION (SEGURO)
// ========================================

// Configuración para producción (usando variables de entorno)
const firebaseConfig = {
    apiKey: window.ENV?.FIREBASE_API_KEY || "AIzaSyAz3a1CupLRuk7nMzKYSL9PKhjvMDfM0SU",
    authDomain: window.ENV?.FIREBASE_AUTH_DOMAIN || "horarios-netlify.firebaseapp.com", 
    projectId: window.ENV?.FIREBASE_PROJECT_ID || "horarios-netlify",
    storageBucket: window.ENV?.FIREBASE_STORAGE_BUCKET || "horarios-netlify.firebasestorage.app",
    messagingSenderId: window.ENV?.FIREBASE_MESSAGING_SENDER_ID || "87586753693",
    appId: window.ENV?.FIREBASE_APP_ID || "1:87586753693:web:eaa78274062ed52da05874"
};

// Exportar configuración
window.FIREBASE_CONFIG = firebaseConfig;

console.log('🔧 Firebase config loaded:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey
});