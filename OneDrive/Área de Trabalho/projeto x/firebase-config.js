// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtF8ZcGR_3uMNJHYPolKf2UPWu7-8Qv-s",
    authDomain: "gerenciamento-sre.firebaseapp.com",
    projectId: "gerenciamento-sre",
    storageBucket: "gerenciamento-sre.firebasestorage.app",
    messagingSenderId: "224798050936",
    appId: "1:224798050936:web:961992e6504aa334cebb8d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Referências para autenticação e banco de dados
export const auth = getAuth(app);
export const db = getFirestore(app);

// Verificar estado de autenticação
auth.onAuthStateChanged((user) => {
    if (user) {
        // Usuário logado
        console.log("Usuário logado:", user.email);
    } else {
        // Usuário deslogado
        console.log("Usuário deslogado");
        showLoginPage();
    }
});

// Função para mostrar página de login
function showLoginPage() {
    // Esta função será chamada quando necessário
    console.log("Mostrando página de login");
}
