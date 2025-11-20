import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// IMPORTANTE: REEMPLAZA ESTOS VALORES CON TUS CREDENCIALES REALES
const SUPABASE_URL = 'https://wuvziddaulkvngczgzki.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnppZGRhdWxrdm5nY3pnemtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTY2NzIsImV4cCI6MjA3OTA3MjY3Mn0.ydZO7oBZaDgc8LHVcessF06LJ8WD_Aw-fvPg0mfnJWI';
// NOTA: Usé tus credenciales anteriores para la referencia, pero por favor verifica que son las correctas.

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);




const currentPath = window.location.pathname;

/**
 * Lógica para la página de autenticación (index.html).
 */
function setupAuthPage() {
    console.log('Setup: Página de Autenticación');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const confirmBtn = document.getElementById('confirmBtn');
    const authMessage = document.getElementById('authMessage');

    async function handleAuth(event) {
        event.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            authMessage.textContent = 'Email y contraseña son obligatorios.';
            return;
        }
        authMessage.textContent = 'Procesando...';

        // Login
        let { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        // Si falla login, intentar registro
        if (error && error.message.includes('Invalid login credentials')) {
            authMessage.textContent = 'Intentando registrar...';
            ({ data, error } = await supabase.auth.signUp({ email, password }));
        }

        if (error) {
            authMessage.textContent = `Error: ${error.message}`;
        } else if (data.session) {
            authMessage.textContent = 'Éxito. Redireccionando...';
            setTimeout(() => window.location.href = 'home.html', 1000);
        } else if (data.user) {
            authMessage.textContent = 'Registro exitoso. Verifica tu email.';
        }
    }

    if (confirmBtn) confirmBtn.addEventListener('click', handleAuth);
    
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) window.location.href = 'home.html';
    });
}

/**
 * Lógica compartida para páginas privadas (home.html, diario.html).
 */
function setupPrivatePage() {
    console.log('Setup: Página Privada');
    const privateContent = document.getElementById('privateContent');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const loadingMessage = document.getElementById('loadingMessage');

    async function handleLogout() {
        await supabase.auth.signOut();
        window.location.href = 'index.html';
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
        if (loadingMessage) loadingMessage.classList.add('hidden');

        if (session) {
            if (userEmailDisplay) userEmailDisplay.textContent = session.user.email;
            if (privateContent) privateContent.classList.remove('hidden');
            if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
        } else {
            window.location.href = 'index.html';
        }
    });
}



// Router Simple
document.addEventListener('DOMContentLoaded', () => {
    const file = currentPath.split('/').pop().toLowerCase();
    
    if (file === 'home.html' || file === 'diario.html') {
        setupPrivatePage();
    } else {
        setupAuthPage();
    }
});


//CONTROL DE AUDIO
const audioPlayer = document.querySelector('audio');
audioPlayer.volume = 0.5; // Establece el volumen a 50%

