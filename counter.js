// ====== CONFIGURACIÓN: poné acá la fecha en que empezaron (AAAA-MM-DD) ======
const START_DATE = '2025-03-01'; // 1 de marzo (cambiá solo el AÑO por el real)
// ===========================================================================
// El contador mensual cuenta hasta el mismo día del mes que START_DATE:
// al empezar un día 1, el mesiversario es el 1 de cada mes y el aniversario cada 1 de marzo.

const [SY, SM, SD] = START_DATE.split('-').map(Number);

// Fecha del mesiversario número n (n = 0 es el inicio). Si el mes no tiene ese día, usa el último.
function anniversary(n) {
    const first = new Date(SY, SM - 1 + n, 1);
    const last = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    return new Date(first.getFullYear(), first.getMonth(), Math.min(SD, last));
}

function compute(now) {
    let n = (now.getFullYear() - SY) * 12 + (now.getMonth() - (SM - 1));
    if (n < 0) n = 0;
    while (n > 0 && anniversary(n) > now) n--;
    while (anniversary(n + 1) <= now) n++;

    const days = Math.floor((now - anniversary(n)) / 86400000);
    const prev = anniversary(n), next = anniversary(n + 1);
    return {
        years: Math.floor(n / 12),
        months: n % 12,
        days,
        msLeft: next - now,
        progress: (now - prev) / (next - prev),
        isMonthiversary: n >= 1 && days === 0,
        isAnniversary: n >= 12 && n % 12 === 0 && days === 0,
    };
}

function render() {
    const c = compute(new Date());
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('cYears', c.years);
    set('cMonths', c.months);
    set('cDays', c.days);
    const totalSec = Math.floor(c.msLeft / 1000);
    set('cHours', Math.floor(totalSec / 3600));
    set('cMin', String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0'));
    set('cSec', String(totalSec % 60).padStart(2, '0'));
    const bar = document.getElementById('cBar');
    if (bar) bar.style.width = (c.progress * 100).toFixed(1) + '%';
    set('cNote', c.isAnniversary ? '💜 ¡Feliz aniversario!' : c.isMonthiversary ? '💜 ¡Hoy es nuestro mesiversario!' : '');
}

if (typeof document !== 'undefined') {
    render();
    setInterval(render, 1000);
}
if (typeof module !== 'undefined') module.exports = { compute };
