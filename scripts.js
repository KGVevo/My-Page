
// ----------------- TEXTOS DE DÍAS -----------------
const dayTexts = {
  "2024-04-01":"    El Mes donde conocí a la mujer de mi vida\n-Es la niña, chica, mujer más hermosa, cariñosa y fantastica que he conocido, es mi mundo, ella es todo para mí, Te amo mi corazon de pollo, mi niña sensible <3 <3",

  "2025-10-27":"Trabajando a full con esta pagina, estoy agotado, puro script aqui, miedo de que no ande, pipipipipipi",
  "2025-10-31":"  Alarma sonando...\n-Hoy desperte a las 7:10, la alarma no paraba de sonar, yo la apago como persona responsable que soy, pero he caido dormido, me despierto a las 7:58 por arte de magia, intente ver a que hora pasaba el colectivo pero la jodida aplicacion no queria andar, entonces sali apurado sin desayunar encaminado hacia la Uni, el colectivo se asomo a mi casa a las 8:20, iba a llegar muy tarde a la Uni\n-Despues de un largo viaje caigo a la Uni a las 8:57, al bajar veo a dos de mis compañeros, aparentemente no era el unico que llegaba tarde hoy, me alegre un poco la verdad, despues de unas horas 'intensas' de Estadistica, fui a tomar el receso de las 10:30, el receso termino a las 11 pero yo y mis compas nos quedamos unos minutos más, no teniamos prisa ya que era pura practica, volvemos al salon y me pongo a escribir...\n-A las 12:30 la profe toma asistencia, por cada alumno nombrado era un alumno que se largaba, muy pocos se quedan siempre hasta las 13:00, por no decir casi nadie, yo incluido me iba una vez mi nombre sea llamado, total, era practica, la podia hacer en casa, me dirijo a la parada y en poco tiempo llega mi colectivo el 63A, ya que es mas rapido que el 62\n-Llego a casa, justo unos 15 minutos antes que mi hermana, justo lo que no deseaba, porque el primero que llega es el que limpia las cochinadas del perro, queria safarme pero parece que no resulto, limpio la suciedad y justo llega mi hermana, sirvo la comida para los dos y a comer, mientras deleitamos la comida miramos algo en la tele, al terminar de comer me lave el cabello, porque me molestaba bastante la verdad, necesito cortarme, ya está bien largo, despues de una larga limpieza de pelo, me alisto para ir a buscar a mi hermano.\n-Voy caminando hasta Luro y me tomo el 11 que no tardo mucho en llegar, llego como a las 16:30, al no andar la sucia aplicación del colectivo fuimos a la parada y tomar el primero que llega, por suerte no paso mucho y llego el 12, en el colectivo una chica me dijo que le abriera la ventana, pero cuando me dijo eso me llamo por mi nombre, algo inuasual, tal vez fui yo y mi sordura.\n-Bajamos en la parada donde se baja mi mujer cada vez que viene a verme, hacemos la caminata hasta casa sin ningun problema, al entrar a casa hacia calor así que abri un poco las ventanas, luego de dejar mis cosas me puse a lavar los platos, no era mucha cosa asi que fue sencillo y poco tardado, una vez hecho eso le preparo unos stickers que me habia pedido mi mujer, una vez terminado se los mando, y veo una captura que me habia mandado Isma, resulta que la chica del colectivo que sabia mi nombre era la hermana de Isma, realmente no me lo podia creer, me reí del momento porque le habia mandado una foto donde salia yo de espaldas, y Isma dice 'Mi juan'.\n-Me pongo a hacer la merienda para mi y mis hermanos, y a merendar, luego me pongo a full a terminar está pagina que estas leyendo, así es, aca son las 21:19, bueno, como queda muy poco de dia supongo que no hay mas que contar.",
  









  "2026-10-1": "LOL FUNCIONA OMG",

};
































// 🔐 Palabra secreta personalizada
const PASSWORD = "miamor"; 


const passwordScreen = document.getElementById("passwordScreen");
const passwordButton = document.getElementById("passwordButton");
const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");

// ❗ Bloquear todo el contenido hasta que ingrese la contraseña
document.body.style.overflow = "hidden";

// Al hacer clic en el botón de ingresar
passwordButton.addEventListener("click", () => {
  const input = passwordInput.value.trim().toLowerCase();
  
  if (input === PASSWORD.toLowerCase()) {
    // ✅ Correcta → animación suave y muestra pantalla de inicio
    passwordError.style.display = "none";
    passwordScreen.style.transition = "opacity 1s ease";
    passwordScreen.style.opacity = "0";

    setTimeout(() => {
      passwordScreen.style.display = "none";
      document.getElementById("startScreen").style.display = "flex";
      document.body.style.overflow = "auto";
    }, 1000);
  } else {
    // ❌ Incorrecta → pequeño “shake” animado
    passwordError.style.display = "block";
    passwordScreen.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-10px)" }, { transform: "translateX(10px)" }, { transform: "translateX(0)" }],
      { duration: 300, iterations: 1 }
    );
    passwordInput.value = "";
  }
});

// Permitir presionar Enter
passwordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") passwordButton.click();
});
// Permitir presionar Enter
passwordInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") passwordButton.click();
});


// ----------------- LLUVIA DE FLORES -----------------
function createFallingFlower() {
  const flower = document.createElement("div");
  flower.classList.add("falling-flower");
  const flowers = ["🌸", "🌺", "🌼", "💮", "🌻"];
  flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
  flower.style.left = Math.random() * 100 + "vw";
  flower.style.fontSize = 10 + Math.random() * 14 + "px";
  flower.style.animationDuration = (2 + Math.random() * 2) + "s";
  document.body.appendChild(flower);
  setTimeout(() => flower.remove(), 4500);
}
setInterval(createFallingFlower, 200);

// ----------------- ESTALLIDO DE CORAZONES -----------------
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





// 🔹 Solo mostramos el GIF y luego pasamos al contenido principal
document.getElementById('startButton').addEventListener('click', () => {
  const startScreen = document.getElementById('startScreen');
  const introGif = document.getElementById('introGif');

  startScreen.style.display = 'none';
  introGif.style.display = 'flex';
  introGif.style.zIndex = '31000';

  setTimeout(() => introGif.classList.add('show'), 50);

  // Ocultar el GIF tras unos segundos y habilitar la página
  setTimeout(() => {
    introGif.style.opacity = '0';
    setTimeout(() => {
      introGif.style.display = 'none';
      introGif.style.zIndex = '-1';
      introGif.style.pointerEvents = "none"; // 🔥 asegura que no bloquee los botones
      document.body.style.overflow = 'auto';
    }, 500);
  }, 6000);
});















// ------- CALENDARIO -------
const calendar = {
  currentDate: new Date(),
  monthNames: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
};

let selectedDay = null;
const dayMenu = document.getElementById("dayMenu");

function renderCalendar() {
  const month = calendar.currentDate.getMonth();
  const year = calendar.currentDate.getFullYear();
  document.getElementById("monthYear").textContent = `${calendar.monthNames[month]} ${year}`;
  
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const daysGrid = document.getElementById("daysGrid");
  daysGrid.innerHTML = "";

  for(let i=0; i<firstDay; i++) daysGrid.appendChild(document.createElement("div"));

  for(let d=1; d<=lastDate; d++){
    const day = document.createElement("div");
    day.textContent = d;
    day.addEventListener("click", () => {
      selectedDay = d;
      document.getElementById("popupTitle").textContent = `Día ${d}`;
      document.getElementById("dayPopup").style.display = "flex";
      startClaimCountdown(); // Inicia el contador al abrir
      

      // Cambiar texto del botón si ya fue reclamado
      const year = calendar.currentDate.getFullYear();
      const month = String(calendar.currentDate.getMonth() + 1).padStart(2, "0");
      const dayKey = `${year}-${month}-${String(d).padStart(2, "0")}`;
      const claimedDays = JSON.parse(localStorage.getItem("claimedDays") || "[]");
      const claimBtn = document.getElementById("claimBtn");


      claimBtn.textContent = claimedDays.includes(dayKey) ? "Ver" : "Reclamar";



    });
    daysGrid.appendChild(day);
  }

  // 🔹 Marcar días reclamados al renderizar
  highlightClaimedDays();
  checkMonthCompletion();


}

document.getElementById("prevMonth").addEventListener("click", () => {
  calendar.currentDate.setMonth(calendar.currentDate.getMonth() - 1);
  renderCalendar();
});
document.getElementById("nextMonth").addEventListener("click", () => {
  calendar.currentDate.setMonth(calendar.currentDate.getMonth() + 1);
  renderCalendar();
});


const toggleCalendarBtn = document.getElementById("toggleCalendar");
const cal = document.getElementById("calendar");

toggleCalendarBtn.addEventListener("click", () => {
  const isHidden = cal.style.display === "none" || cal.style.display === "";

  if (isHidden) {
    // 🔹 Siempre volver al mes actual antes de mostrar
    calendar.currentDate = new Date(); 
    renderCalendar();

    cal.style.display = "block";
    toggleCalendarBtn.style.visibility = "hidden"; 
  } else {
    cal.style.display = "none";
    toggleCalendarBtn.style.visibility = "visible";
  }

  document.getElementById("closeCalendar").addEventListener("click", () => {
    cal.style.display = "none";
    toggleCalendarBtn.style.visibility = "visible";
  });    
});

renderCalendar();

// ------- CERRAR POPUP -------
document.getElementById("closePopup").addEventListener("click", () => {
  document.getElementById("dayPopup").style.display = "none";
});

document.getElementById("closeViewDay").addEventListener("click", () => {
  document.getElementById("viewDayPopup").style.display = "none";
});

// ------- FUNCIÓN HORA ARGENTINA -------
function getArgentinaTime() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" }));
}






// ------- CONTADOR RECLAMAR -------
let countdownInterval;

function startClaimCountdown() {
  const claimBtn = document.getElementById("claimBtn");
  clearInterval(countdownInterval);

  function update() {
    const now = getArgentinaTime();

    // Fecha objetivo: 23:00 del día seleccionado
    const selectedDate = new Date(calendar.currentDate.getFullYear(), calendar.currentDate.getMonth(), selectedDay, 23, 0, 0);
    const diff = selectedDate - now;

    if (diff <= 0) {
      // 🔹 Verificar si el día ya fue reclamado
      const year = calendar.currentDate.getFullYear();
      const month = String(calendar.currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDay).padStart(2, "0");
      const key = `${year}-${month}-${day}`;
      const claimedDays = JSON.parse(localStorage.getItem("claimedDays") || "[]");

      // 🔸 Mostrar "Ver" si ya fue reclamado, o "Reclamar" si no
      if (claimedDays.includes(key)) {
        claimBtn.textContent = "Ver";
      } else {
        claimBtn.textContent = "Reclamar";
      }

      claimBtn.disabled = false;
      clearInterval(countdownInterval);
    } else {
      // 🔹 Mostrar cuenta regresiva mientras no sea hora
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      claimBtn.textContent = `Reclamar (${hours}h ${minutes}m ${seconds}s)`;
      claimBtn.disabled = true;
    }
  }

  update();
  countdownInterval = setInterval(update, 1000);
}





// ------- AL HACER CLICK EN RECLAMAR -------
document.getElementById("claimBtn").addEventListener("click", () => {
  const year = calendar.currentDate.getFullYear();
  const month = String(calendar.currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDay).padStart(2, "0");
  const key = `${year}-${month}-${day}`;

  const text = dayTexts[key] || "No hay texto para este día.";

  let claimedDays = JSON.parse(localStorage.getItem("claimedDays") || "[]");
  const isAlreadyClaimed = claimedDays.includes(key);


  if (!isAlreadyClaimed) {
    claimedDays.push(key);
    localStorage.setItem("claimedDays", JSON.stringify(claimedDays));

    // 💫 Explosión de estrellitas
    createStarBurst();

    // Cambiar botón a "Ver"
    const claimBtn = document.getElementById("claimBtn");
    claimBtn.textContent = "Ver";
    claimBtn.disabled = false;
    }



    // Mostrar texto del día
    document.getElementById("viewDayTitle").textContent = `Día ${selectedDay} - ${calendar.monthNames[month - 1]}`;
    document.getElementById("viewDayText").textContent = text;
    document.getElementById("viewDayPopup").style.display = "flex";
    document.getElementById("dayPopup").style.display = "none";


    // Marcar día reclamado
    highlightClaimedDays();
    checkMonthCompletion();


    // ------- EXPLOSIÓN DE ESTRELLITAS -------
    function createStarBurst() {
    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement("div");
      star.classList.add("star-burst");
      star.textContent = "⭐";
      star.style.position = "fixed";
      star.style.left = Math.random() * 100 + "vw";
      star.style.top = Math.random() * 100 + "vh";
      star.style.fontSize = 10 + Math.random() * 20 + "px";
      star.style.opacity = 1;
      star.style.transition = "transform 1.5s ease-out, opacity 5s ease-out";

      star.style.zIndex = "999999"; // 🔥 aún más alto que los popups
      star.style.pointerEvents = "none"; // no bloquea clics

      document.body.appendChild(star);

      const xMove = (Math.random() - 0.5) * 600;
      const yMove = (Math.random() - 0.5) * 600;

      requestAnimationFrame(() => {
        star.style.transform = `translate(${xMove}px, ${yMove}px) scale(0.5)`;
        star.style.opacity = 0;
      });

    setTimeout(() => star.remove(), 5000);
  }
}
});


function checkMonthCompletion() {
  const allDays = document.querySelectorAll("#daysGrid div");
  const validDays = Array.from(allDays).filter(d => d.textContent.trim() !== "");
  const claimedInMonth = validDays.filter(d => d.classList.contains("claimed")).length;
  const monthTitle = document.getElementById("monthYear");

  if (claimedInMonth === validDays.length && validDays.length > 0) {
    monthTitle.classList.add("golden-month");
  } else {
    monthTitle.classList.remove("golden-month");
  }
}





const bgMusic = document.getElementById("bgMusic");
const toggleMusicBtn = document.getElementById("toggleMusic");


  
// Al cargar la página: reproducir música e iniciar animación del gif
window.addEventListener("load", () => {
  // Intentar reproducir música automáticamente
  bgMusic.play().then(() => {
    toggleMusicBtn.textContent = "⏸️";
  }).catch(() => {
    toggleMusicBtn.textContent = "🎵";
  });


// ---------- ANIMACIÓN DE LIRIOS CRECIENDO ----------
  const intro = document.getElementById("introGif");
  // Dejamos que la animación CSS se encargue del fade
  // Solo aseguramos que no bloquee la interacción
  setTimeout(() => {
    intro.style.pointerEvents = "none";
  }, 5000);
});


// Botón para reproducir/pausar
toggleMusicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    toggleMusicBtn.textContent = "⏸️";
  } else {
    bgMusic.pause();
    toggleMusicBtn.textContent = "🎵";
  }
});




const startButton = document.getElementById("startButton");
const startScreen = document.getElementById("startScreen");
const introGif = document.getElementById("introGif");

// 🔹 Asegurarse de que el GIF esté oculto al inicio
window.addEventListener("load", () => {
  introGif.style.display = "none";

  // Asegurar que los botones funcionen correctamente al iniciar
  document.getElementById("toggleCalendar").disabled = false;
  document.getElementById("toggleMusic").disabled = false;
});

startButton.addEventListener("click", () => {
  // Ocultar pantalla de inicio
  startScreen.style.display = "none";

  // Mostrar el GIF justo después de presionar "Comenzar"
  introGif.style.display = "flex";
  introGif.style.zIndex = "31000";
  setTimeout(() => introGif.classList.add("show"), 50);


  // Reproducir música
  bgMusic.play().catch(() => {
    console.log("Autoplay bloqueado, el usuario interactuó");
  });

  // 🔹 Ocultar el GIF después de unos segundos
setTimeout(() => {
  introGif.style.opacity = "0";
  setTimeout(() => {
    introGif.style.display = "none";
    introGif.style.zIndex = "-1";
    introGif.style.pointerEvents = "none";

    // 🌟 Mostrar botones con animación suave
    const musicBtn = document.getElementById("toggleMusic");
    const daysBtn = document.getElementById("toggleCalendar");

    [musicBtn, daysBtn].forEach(btn => {
      btn.style.opacity = "0";
      btn.style.display = "block";
      btn.style.transition = "opacity 1s ease";
      setTimeout(() => btn.style.opacity = "1", 100);
    });

  }, 500); // coincide con el fade-out
}, 6000);   
});



// ------- MARCAR DÍAS RECLAMADOS -------
function highlightClaimedDays() {
  const claimedDays = JSON.parse(localStorage.getItem("claimedDays") || "[]");
  const month = calendar.currentDate.getMonth();
  const year = calendar.currentDate.getFullYear();

  document.querySelectorAll("#daysGrid div").forEach((el) => {
    const day = el.textContent.trim();
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    if (claimedDays.includes(key)) {
      el.classList.add("claimed");
      el.innerHTML = `${day} <span style="color: gold;">⭐</span>`;
    } else {
      el.classList.remove("claimed");
      el.innerHTML = day;
    }
  });
}




