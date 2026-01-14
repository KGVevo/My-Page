import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// IMPORTANTE: REEMPLAZA ESTOS VALORES CON TUS CREDENCIALES REALES
const SUPABASE_URL = 'https://wuvziddaulkvngczgzki.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dnppZGRhdWxrdm5nY3pnemtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTY2NzIsImV4cCI6MjA3OTA3MjY3Mn0.ydZO7oBZaDgc8LHVcessF06LJ8WD_Aw-fvPg0mfnJWI';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variables de estado global
let currentUserId = null;
let viewContext = 'own'; // 'own' o 'shared'
let sharedUserId = null; // ID del usuario cuyo diario se está viendo
let isEditing = false; // Bandera para saber si el usuario está en modo edición

// --- Referencia a elementos del DOM ---
const currentUserIdDisplay = document.getElementById('currentUserIdDisplay');
const calendarTitle = document.getElementById('calendarTitle'); 
const notificationBanner = document.getElementById('notification-banner'); 

// MODAL DE COMPARTIR
const shareModal = document.getElementById('shareModal'); 
const closeShareModalBtn = document.getElementById('closeShareModalBtn'); 
const sharedUserIdInput = document.getElementById('sharedUserIdInput'); 
const loadSharedDiarioBtn = document.getElementById('loadSharedDiarioBtn');
const viewSharedDiarioBtn = document.getElementById('viewSharedDiarioBtn');

// MODAL DE CALENDARIO (Contenedor principal)
const calendarModal = document.getElementById('calendarModal');
const closeCalendarBtn = document.getElementById('closeCalendarBtn'); // Añadido
const prevMonthBtn = document.getElementById('prevMonthBtn'); 
const nextMonthBtn = document.getElementById('nextMonthBtn'); 
const currentMonthYearSpan = document.getElementById('currentMonthYear');
const daysGrid = document.getElementById('daysGrid');

// MODAL DE ACCIÓN (Reclamar/Ver/Editar)
const actionModal = document.getElementById('actionModal');
const closeActionModalBtn = document.getElementById('closeActionModalBtn'); // Añadido
const selectedDateDisplay = document.getElementById('selectedDateDisplay');

// Elementos del Action Modal
const claimedButtonsGroup = document.getElementById('claimedButtonsGroup'); 
const claimPrompt = document.getElementById('claimPrompt'); 
const claimViewBtn = document.getElementById('claimViewBtn'); // Reclamar o Guardar Cambios
const viewEntryBtn = document.getElementById('viewEntryBtn'); // Ver (para ir a ViewModal)
const editEntryBtn = document.getElementById('editEntryBtn'); // Iniciar Edición
const deleteBtn = document.getElementById('deleteBtn'); // Eliminar
const entryTextarea = document.getElementById('entryTextarea'); 
const currentClaimIdInput = document.getElementById('currentClaimId'); 

// MODAL DE VISTA (Diario Compartido/Vista de Entrada)
const viewModal = document.getElementById('viewModal'); 
const closeViewModalBtn = document.getElementById('closeViewModalBtn'); // Añadido
const viewDateDisplay = document.getElementById('viewDateDisplay'); 
const entryTextView = document.getElementById('entryTextView'); 
const viewUserName = document.getElementById('viewUserName');


let currentDate = new Date(); 
let claimedDates = {}; // Caché para días reclamados { 'YYYY-MM-DD': { id: claim_id, text: entry_text } } 

const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];


// --- INICIALIZACIÓN Y FUNCIONES DE UTILIDAD ---

/**
 * Función para copiar el ID de usuario al portapapeles.
 */
function copyUserId() {
    if (currentUserId) {
        const tempInput = document.createElement('input');
        tempInput.value = currentUserId;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            // document.execCommand('copy') es preferido en entornos iFrame
            document.execCommand('copy'); 
            showNotification("¡ID copiado al portapapeles!", 'success');
        } catch (err) {
            console.error('Error al copiar el texto:', err);
            showNotification("Error: No se pudo copiar el ID.", 'error');
        }
        document.body.removeChild(tempInput);
    }
}

// Inicializar el ID del usuario y mostrarlo
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        currentUserId = session.user.id;
        if (currentUserIdDisplay) {
            currentUserIdDisplay.textContent = currentUserId;
            currentUserIdDisplay.addEventListener('click', copyUserId);
        }
        console.log("Supabase User ID loaded:", currentUserId);
        // Si ya está en la página diario.html, renderizar el calendario por primera vez
        if (window.location.pathname.includes('diario.html') || window.location.pathname.includes('index.html')) {
            // Solo se renderiza si se abre el modal, no al cargar la página
            // renderCalendar(); 
        }
    } else {
        currentUserId = null;
        if (currentUserIdDisplay) {
            currentUserIdDisplay.textContent = "ID no disponible.";
        }
        console.error("No active Supabase session in flower_script.js.");
    }
});


// ... Animaciones (Se mantienen) ...
function createFallingFlower() {
    const flower = document.createElement("div");
    flower.classList.add("falling-flower");
    const flowers = ["🌸", "🌺", "🌼", "💮", "🌻", "🔸"]; 
    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    
    flower.style.left = Math.random() * 100 + "vw";
    flower.style.fontSize = 10 + Math.random() * 14 + "px";
    flower.style.animationDuration = (2 + Math.random() * 3) + "s";
    
    flower.style.setProperty('--random-rotation-start', `${Math.random() * 360}deg`);
    flower.style.setProperty('--random-rotation-end', `${360 + Math.random() * 720}deg`); 
    
    document.body.appendChild(flower);
    
    setTimeout(() => flower.remove(), 5000); 
}

setInterval(createFallingFlower, 200);

document.addEventListener("click", (e) => {
    const numberOfHearts = 3;
    const heartTypes = ["💖", "❤️", "💘", "💞", "💕", "💓", "💗"];
    for (let i = 0; i < numberOfHearts; i++) {
        const heart = document.createElement("div");
        heart.className = "burst-heart";
        heart.textContent = heartTypes[Math.floor(Math.random() * heartTypes.length)];
        heart.style.left = e.clientX + "px";
        heart.style.top = e.clientY + "px";
        const size = 10 + Math.random() * 20;
        heart.style.fontSize = size + "px";
        
        document.body.appendChild(heart);
        
        const xMove = (Math.random() - 0.5) * 200;
        const yMove = (Math.random() - 0.5) * 200;
        const rotate = Math.random() * 720;
        
        requestAnimationFrame(() => {
            heart.style.transform = `translate(${xMove}px, ${yMove}px) rotate(${rotate}deg)`;
            heart.style.opacity = 0;
        });

        setTimeout(() => heart.remove(), 800);
    }
});


function showNotification(message, type = 'success') {
    if (!notificationBanner) return;
    
    notificationBanner.textContent = message;
    notificationBanner.classList.remove('error');
    if (type === 'error') {
        notificationBanner.classList.add('error');
    }
    notificationBanner.classList.add('show');

    setTimeout(() => {
        notificationBanner.classList.remove('show');
    }, 3000);
}

function getStartDayOfWeek(date) {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    // 0=Dom, 1=Lun, ..., 6=Sab. Queremos que Lun sea 0.
    return day === 0 ? 6 : day - 1; 
}

/**
 * Verifica si algún modal está abierto para decidir si desbloquear el scroll del cuerpo.
 */
function checkAndUnlockScroll() {
    const isAnyModalOpen = !(
        calendarModal?.classList.contains('hidden') &&
        actionModal?.classList.contains('hidden') &&
        viewModal?.classList.contains('hidden') &&
        shareModal?.classList.contains('hidden')
    );
    if (!isAnyModalOpen) {
        document.body.classList.remove('modal-open');
    }
}


// --- MANEJO DE MODALES ---

function showCalendarModal() {
    if (!currentUserId) return;

    if (calendarTitle) {
        const displayName = sharedUserId ? sharedUserId.substring(0, 8) + '...' : currentUserId.substring(0, 8) + '...';
        calendarTitle.textContent = viewContext === 'own' ? 'Mi Diario' : `Diario de ${displayName}`;
    }
    
    if (calendarModal) {
        document.body.classList.add('modal-open');
        calendarModal.classList.remove('hidden');
        renderCalendar(); 
        requestAnimationFrame(() => {
            const modalContent = calendarModal.querySelector('.calendar-modal');
            if (modalContent) modalContent.classList.add('show');
        });
    }
}

function hideCalendarModal(unlockScroll = true) {
    if (calendarModal) {
        const modalContent = calendarModal.querySelector('.calendar-modal');
        if (modalContent) modalContent.classList.remove('show');
        
        setTimeout(() => {
            calendarModal.classList.add('hidden');
            if (unlockScroll) {
                 checkAndUnlockScroll();
            }
        }, 300); 
    }
}

/**
 * Muestra el modal de acción, configurando si es modo Reclamar (nuevo) o Ver/Editar (existente).
 */
function showActionModal(dateString) {
    const entryData = claimedDates[dateString];
    isEditing = false; // Resetear estado de edición
    
    // 1. Si estamos viendo un diario compartido, redirigimos a ViewModal
    if (viewContext === 'shared') {
        if (entryData) {
             showViewModal(dateString, entryData.text, sharedUserId);
        } else {
             showNotification("Este usuario no tiene entrada para este día.", 'error');
        }
        return;
    }

    // 2. Lógica para 'own' (Diario propio)
    if (actionModal) {
        if (!currentUserId) {
            showNotification("Error: No se encontró la sesión de usuario.", 'error');
            return;
        }

        hideCalendarModal(false); // Escondemos el calendario pero mantenemos el scroll bloqueado

        const dateParts = dateString.split('-');
        const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); 
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        selectedDateDisplay.textContent = dateObj.toLocaleDateString('es-ES', options);
        
        claimViewBtn.dataset.date = dateString; 
        
        // --- CONFIGURACIÓN DEL MODAL ---
        
        if (entryData) {
            // DÍA RECLAMADO (Muestra botones Ver/Editar)
            currentClaimIdInput.value = entryData.id;
            entryTextarea.value = entryData.text; 
            
            // Ocultar elementos de edición/reclamar directamente
            entryTextarea.classList.add('hidden');
            claimPrompt.classList.add('hidden');
            claimViewBtn.classList.add('hidden'); 
            
            // Mostrar botones de ver/editar
            if (claimedButtonsGroup) {
                claimedButtonsGroup.classList.remove('hidden');
            }
            
        } else {
            // DÍA NO RECLAMADO (Muestra la opción de Reclamar)
            currentClaimIdInput.value = '';
            entryTextarea.value = '';
            entryTextarea.readOnly = false;
            
            // Mostrar elementos de reclamar
            entryTextarea.classList.remove('hidden');
            claimPrompt.classList.remove('hidden');
            claimPrompt.textContent = 'Escribe tu entrada del diario:';
            claimViewBtn.classList.remove('hidden');
            
            // Botón de reclamar
            claimViewBtn.textContent = 'Reclamar Día';
            claimViewBtn.style.backgroundColor = '#ff91a4'; // Rosa
            
            // FIX: Bloquea el zoom y escalado del viewport MIENTRAS el teclado está abierto.
            document.querySelector('meta[name="viewport"]').setAttribute(
                'content', 
                'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
            );
            
            // FIX: Forzar el focus después de un breve retraso para que el scroll se ajuste.
            setTimeout(() => {
                entryTextarea.focus();
            }, 100);            


            // Ocultar elementos de ver/editar
            if (claimedButtonsGroup) {
                claimedButtonsGroup.classList.add('hidden');
            }

        
        }
        
        document.body.classList.add('modal-open'); 
        viewModal.classList.add('hidden'); // Asegurar que ViewModal está oculto
        actionModal.classList.remove('hidden');
        requestAnimationFrame(() => {
            const modalContent = actionModal.querySelector('.calendar-modal');
            if (modalContent) modalContent.classList.add('show');
        });
    }
}

function hideActionModal() {
    if (actionModal) {
        const modalContent = actionModal.querySelector('.calendar-modal');
        if (modalContent) modalContent.classList.remove('show');
        isEditing = false; 
        
        setTimeout(() => {
            actionModal.classList.add('hidden');
            checkAndUnlockScroll();

            // FIX: Restaurar el viewport para permitir zoom/escalado normal.
            document.querySelector('meta[name="viewport"]').setAttribute(
                'content', 
                'width=device-width, initial-scale=1.0'
            );

        }, 300);
    }
}

function showViewModal(dateString, text, userId = currentUserId) {
      if (viewModal) {
        hideActionModal(); 
        hideShareModal();
        hideCalendarModal(false); // Mantiene el scroll bloqueado

        const dateParts = dateString.split('-');
        const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); 
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        
        const userName = userId === currentUserId ? 'Tu entrada' : `Entrada de ${userId.substring(0, 8)}...`;
        viewUserName.textContent = userName;
        viewDateDisplay.textContent = dateObj.toLocaleDateString('es-ES', options);

        entryTextView.textContent = text || "No hay entrada de diario para este día.";
        
        document.body.classList.add('modal-open'); 
        viewModal.classList.remove('hidden');
        
        requestAnimationFrame(() => {
             const modalContent = viewModal.querySelector('.calendar-modal');
             if (modalContent) modalContent.classList.add('show');
        });
    }
}

function hideViewModal() {
    if (viewModal) {
        const modalContent = viewModal.querySelector('.calendar-modal');
        if (modalContent) modalContent.classList.remove('show');
        
        setTimeout(() => {
            viewModal.classList.add('hidden');
            checkAndUnlockScroll();
        }, 300); 
    }
}

// Modal de Compartir
function showShareModal() {
    hideCalendarModal(false);
    hideViewModal();
    hideActionModal();
    
    if (shareModal) {
        document.body.classList.add('modal-open'); 
        shareModal.classList.remove('hidden');
        requestAnimationFrame(() => {
            const modalContent = shareModal.querySelector('.calendar-modal');
            if (modalContent) modalContent.classList.add('show');
        });
    }
}

function hideShareModal() {
      if (shareModal) {
        const modalContent = shareModal.querySelector('.calendar-modal');
        if (modalContent) modalContent.classList.remove('show');
        
        setTimeout(() => {
            shareModal.classList.add('hidden');
            checkAndUnlockScroll();
        }, 300); 
    }
}

// --- LÓGICA DE DATOS Y ESTADO ---

/**
 * Obtiene todos los reclamos del usuario según el contexto (propio o compartido), incluyendo el ID.
 */
async function fetchClaimedDatesForCurrentMonth() {
    const targetUserId = viewContext === 'own' ? currentUserId : sharedUserId;
    
    if (!targetUserId) {
        claimedDates = {};
        return;
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('claims')
        .select('id, claimed_date, entry_text')
        .eq('user_id', targetUserId)
        .gte('claimed_date', startDate) 
        .lte('claimed_date', endDate); 

    if (error) {
        console.error('Error fetching claimed dates:', error);
        showNotification(`Error al cargar las entradas.`, 'error');
        claimedDates = {};
        return;
    }

    claimedDates = {};
    if (data) {
        data.forEach(claim => {
            claimedDates[claim.claimed_date] = { 
                id: claim.id, 
                text: claim.entry_text 
            };
        });
    }
}

/**
 * Maneja el reclamo de un día nuevo (función del botón "Reclamar Día").
 */
async function handleClaim() {
    const dateToClaim = claimViewBtn.dataset.date;
    const entryText = entryTextarea.value.trim();
    
    if (!currentUserId || !dateToClaim) {
        showNotification("Error: Sesión no válida o fecha no seleccionada.", 'error');
        return;
    }
    
    if (entryText.length < 5) {
        showNotification("Por favor, escribe al menos 5 caracteres en la entrada.", 'error');
        return;
    }
    
    claimViewBtn.disabled = true;
    claimViewBtn.textContent = 'Guardando...';

    const { data, error } = await supabase
        .from('claims')
        .insert([
            { user_id: currentUserId, claimed_date: dateToClaim, entry_text: entryText }
        ])
        .select('id, entry_text'); 

    claimViewBtn.disabled = false;

    if (error) {
        console.error('Error al reclamar el día:', error);
        claimViewBtn.textContent = 'Error al reclamar';
        showNotification("Error al guardar el reclamo. Intenta de nuevo.", 'error'); 
        return;
    }

    // Éxito: Actualizar caché
    const newClaim = data[0];
    claimedDates[dateToClaim] = { id: newClaim.id, text: newClaim.entry_text };
    
    showNotification(`¡Día ${dateToClaim} reclamado exitosamente!`, 'success');
    
    hideActionModal();
    renderCalendar(); 
}

/**
 * Inicia el modo de edición (función del botón "Editar Entrada").
 */
function handleEditStart() {
    const dateToEdit = claimViewBtn.dataset.date;
    if (!claimedDates[dateToEdit]) {
          showNotification("No hay entrada para editar.", 'error');
          return;
    }
    
    isEditing = true;
    
    // Ocultar botones de Ver/Editar
    claimedButtonsGroup.classList.add('hidden');
    
    // Mostrar elementos de edición
    entryTextarea.classList.remove('hidden');
    entryTextarea.readOnly = false;
    entryTextarea.value = claimedDates[dateToEdit].text; // Asegurar que el texto esté cargado
    claimPrompt.classList.remove('hidden');
    
    // Reconfigurar claimViewBtn para guardar
    claimPrompt.textContent = 'Edita tu entrada y guarda los cambios:';
    claimViewBtn.textContent = 'Guardar Cambios';
    claimViewBtn.style.backgroundColor = '#4CAF50'; // Verde
    claimViewBtn.classList.remove('hidden');

    // FIX: Bloquea el zoom y escalado del viewport MIENTRAS el teclado está abierto.
    document.querySelector('meta[name="viewport"]').setAttribute(
        'content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    );
    
    // FIX: Forzar el focus después de un breve retraso para que el scroll se ajuste.
    setTimeout(() => {
        entryTextarea.focus();
        // Mueve el cursor al final del texto al editar
        entryTextarea.setSelectionRange(entryTextarea.value.length, entryTextarea.value.length);
    }, 100);


}

/**
 * Maneja el guardado de una entrada editada (función del botón "Guardar Cambios").
 */
async function handleSave() {
    const claimId = currentClaimIdInput.value;
    const dateToClaim = claimViewBtn.dataset.date;
    const entryText = entryTextarea.value.trim();
    
    if (!claimId) {
        showNotification("Error: ID de entrada no encontrado. No se pudo guardar.", 'error');
        return;
    }
    if (entryText.length < 5) {
        showNotification("Por favor, escribe al menos 5 caracteres en la entrada.", 'error');
        return;
    }

    claimViewBtn.disabled = true;
    claimViewBtn.textContent = 'Guardando...';
    
    const { error } = await supabase
        .from('claims')
        .update({ entry_text: entryText, updated_at: new Date().toISOString() }) 
        .eq('id', claimId);

    claimViewBtn.disabled = false;

    if (error) {
        console.error('Error al actualizar el día:', error);
        claimViewBtn.textContent = 'Error al guardar';
        showNotification("Error al actualizar la entrada. Intenta de nuevo.", 'error');
        return;
    }

    // Éxito: Actualizar caché local y forzar una actualización del calendario
    claimedDates[dateToClaim].text = entryText; // Actualización de la caché local
    
    showNotification(`¡Entrada del diario actualizada con éxito!`, 'success');
    
    // Regresar al estado inicial del Action Modal (Ver/Editar)
    showActionModal(dateToClaim); 
    
    // **FIX: Forzar un refetch de los datos del calendario para garantizar la consistencia visual**
    renderCalendar();
}

/**
 * Maneja la eliminación de una entrada (función del botón "Eliminar Entrada").
 * NOTA DE CORRECCIÓN: Se eliminó window.confirm para cumplir con las restricciones del iFrame.
 */
async function handleDelete() {
    const claimId = currentClaimIdInput.value;
    const dateToClaim = claimViewBtn.dataset.date;
    
    if (!claimId) {
        showNotification("Error: ID de entrada no encontrado para eliminar.", 'error');
        return;
    }
    
    // --- Lógica de confirmación no bloqueante ---
    showNotification("¡Eliminando entrada! (Esta acción es permanente).", 'error'); 
    console.warn(`Eliminando entrada con ID: ${claimId} de forma inmediata.`);
    // ---------------------------------------------

    deleteBtn.disabled = true;
    deleteBtn.textContent = 'Eliminando...';
    
    const { error } = await supabase
        .from('claims')
        .delete()
        .eq('id', claimId);

    deleteBtn.disabled = false;
    deleteBtn.textContent = 'Eliminar Entrada';

    if (error) {
        console.error('Error al eliminar el día:', error);
        showNotification("Error al eliminar la entrada. Intenta de nuevo.", 'error');
        return;
    }

    // Éxito: Eliminar de la caché y cerrar modal
    delete claimedDates[dateToClaim];
    
    showNotification(`¡Entrada eliminada con éxito!`, 'success');
    hideActionModal();
    renderCalendar(); 
}


async function renderCalendar() {
    if (!daysGrid) return;
    
    await fetchClaimedDatesForCurrentMonth();
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); 
    
    if (currentMonthYearSpan) {
        currentMonthYearSpan.textContent = `${monthNames[month]} ${year}`;
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = getStartDayOfWeek(currentDate);

    const today = new Date();
    const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

    daysGrid.innerHTML = ''; 

    // 1. Días vacíos (relleno inicial)
    for (let i = 0; i < startDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day-cell', 'empty');
        daysGrid.appendChild(emptyCell);
    }

    // 2. Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        dayCell.textContent = day;
        
        const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayCell.dataset.date = fullDate;

        if (claimedDates[fullDate]) {
             if (viewContext === 'own') {
                 dayCell.classList.add('claimed'); 
             } else {
                 dayCell.classList.add('other-claimed'); 
             }
        }

        // Listener de clic para abrir el modal de acción
        dayCell.addEventListener('click', () => {
             showActionModal(fullDate);
        });
        
        if (isCurrentMonth && day === today.getDate() && viewContext === 'own') {
            dayCell.classList.add('today');
        }

        daysGrid.appendChild(dayCell);
    }
}

function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
}

// --- LISTENERS GLOBALES ---

// 1. Ver Mi Diario (Botón en home.html)
if (document.getElementById('viewDiarioBtn')) {
    document.getElementById('viewDiarioBtn').addEventListener('click', () => {
        if (!currentUserId) {
            showNotification("Carga de sesión incompleta. Intenta de nuevo.", 'error');
            return;
        }
        viewContext = 'own';
        sharedUserId = null;
        showCalendarModal();
    });
}

// 2. Botón Cargar Diario Compartido (dentro del shareModal)
if (loadSharedDiarioBtn) {
    loadSharedDiarioBtn.addEventListener('click', () => {
        const inputId = sharedUserIdInput.value.trim();
        
        if (!inputId || inputId.length < 36) { 
            showNotification("ID de usuario no válido.", 'error');
            return;
        }
        
        if (inputId === currentUserId) {
            showNotification("Ese es tu propio ID. Usa 'Ver Mi Diario'.", 'error');
            return;
        }

        sharedUserId = inputId;
        viewContext = 'shared';
        hideShareModal();
        showCalendarModal(); 
    });
}

// 3. Botón Abrir Modal Compartido (en la página principal)
if (viewSharedDiarioBtn) {
    viewSharedDiarioBtn.addEventListener('click', showShareModal);
}

// 4. Lógica de Reclamar/Guardar (En actionModal)
if (claimViewBtn) {
    claimViewBtn.addEventListener('click', () => {
        if (isEditing) {
            handleSave(); // Si está en modo edición, guarda
        } else {
            handleClaim(); // Si está en modo reclamar, reclama
        }
    });
}

// 5. Botón Ver Entrada (En actionModal)
if (viewEntryBtn) {
    viewEntryBtn.addEventListener('click', () => {
        const dateToView = claimViewBtn.dataset.date;
        const entryData = claimedDates[dateToView];
        if (entryData) {
            showViewModal(dateToView, entryData.text);
        } else {
            showNotification("Error: Contenido de entrada no encontrado.", 'error');
        }
    });
}

// 6. Botón Editar Entrada (En actionModal)
if (editEntryBtn) {
    editEntryBtn.addEventListener('click', handleEditStart);
}

// 7. Botón Eliminar Entrada (En actionModal)
if (deleteBtn) {
    deleteBtn.addEventListener('click', handleDelete);
}

// 8. Listeners para navegación de mes 
if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => changeMonth(-1));
}
if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => changeMonth(1));
}


// Listeners para navegación y cierre de modales
if (closeCalendarBtn) {
    closeCalendarBtn.addEventListener('click', () => hideCalendarModal(true));
}
if (closeActionModalBtn) {
    closeActionModalBtn.addEventListener('click', () => {
        hideActionModal();
        showCalendarModal(); // Volvemos al calendario al cerrar
    });
}

if (closeViewModalBtn) {
    closeViewModalBtn.addEventListener('click', hideViewModal);
}
if (closeShareModalBtn) {
    closeShareModalBtn.addEventListener('click', hideShareModal);
}

// Cierre de modales al hacer clic fuera
if (calendarModal) {
    // Tu lógica de cierre de modal si hacen clic fuera debe ir aquí.
    // Por ejemplo:
    // calendarModal.addEventListener('click', (e) => {
    //     if (e.target === calendarModal) {
    //         hideCalendarModal(true);
    //     }
    // });
}