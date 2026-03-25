import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('passwordInput');
    const confirmBtn = document.getElementById('confirmBtn');
    const resetBtn = document.getElementById('resetBtn');
    const authMessage = document.getElementById('authMessage');

    async function handleAuth(event) {
        event.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            authMessage.textContent = 'Email y contraseña son obligatorios.';
            return;
        }

        let { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error && error.message.includes('Invalid login credentials')) {
            ({ data, error } = await supabase.auth.signUp({ email, password }));
        }

        if (error) {
            authMessage.textContent = `Error: ${error.message}`;
        } else if (data.session) {
            window.location.href = 'home.html';
        } else if (data.user) {
            authMessage.textContent = 'Registro exitoso. Verifica tu email.';
        }
    }

    async function handleResetRequest() {
        const email = emailInput.value.trim();
        if (!email) {
            authMessage.textContent = 'Introduce tu email para restablecer.';
            return;
        }
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/reset-password.html',
        });
        authMessage.textContent = error ? `Error: ${error.message}` : 'Correo enviado. Revisa tu bandeja.';
    }

    if (confirmBtn) confirmBtn.addEventListener('click', handleAuth);
    if (resetBtn) resetBtn.addEventListener('click', handleResetRequest);
}

/**
 * Lógica para restablecer contraseña (reset-password.html).
 */
async function setupResetPasswordPage() {
    const newPasswordInput = document.getElementById('newPasswordInput');
    const updateBtn = document.getElementById('updateBtn');
    const resetMessage = document.getElementById('resetMessage');

    // Esperar un momento a que la sesión se recupere del link del correo
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        if (resetMessage) resetMessage.textContent = "Sesión no encontrada o link expirado.";
        return;
    }

    async function handleUpdate() {
        const password = newPasswordInput.value.trim();
        if (password.length < 6) {
            resetMessage.textContent = "Mínimo 6 caracteres.";
            return;
        }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            resetMessage.textContent = `Error: ${error.message}`;
        } else {
            resetMessage.textContent = "¡Contraseña cambiada! Redirigiendo...";
            setTimeout(() => window.location.href = 'index.html', 2000);
        }
    }

    if (updateBtn) updateBtn.addEventListener('click', handleUpdate);
}

/**
 * Lógica para páginas privadas (home.html, diario.html).
 */
async function setupPrivatePage() {
    const privateContent = document.getElementById('privateContent');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const loadingMessage = document.getElementById('loadingMessage');

    const { data: { session } } = await supabase.auth.getSession();

    if (loadingMessage) loadingMessage.classList.add('hidden');

    if (session) {
        if (userEmailDisplay) userEmailDisplay.textContent = session.user.email;
        if (privateContent) privateContent.classList.remove('hidden');
        if (logoutBtn) logoutBtn.addEventListener('click', async () => {
            await supabase.auth.signOut();
            window.location.href = 'index.html';
        });
    } else {
        window.location.href = 'index.html';
    }
}

// Router Simple
document.addEventListener('DOMContentLoaded', () => {
    const file = currentPath.split('/').pop().toLowerCase();
    
    if (file === 'home.html' || file === 'diario.html') {
        setupPrivatePage();
    } else if (file === 'reset-password.html') {
        setupResetPasswordPage();
    } else {
        setupAuthPage();
    }
});

// Control de Audio (si existe el elemento)
const audioPlayer = document.querySelector('audio');
if (audioPlayer) audioPlayer.volume = 0.5;