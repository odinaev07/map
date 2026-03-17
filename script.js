// Переключение вкладок
function switchTab(tabId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// Тема
const themeToggle = document.getElementById('themeToggle');
themeToggle.onclick = () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? '🌞' : '🌙';
};

// 1. Калькулятор Времени
function calcTimeTravel() {
    const dist = parseFloat(document.getElementById('time-distance').value) || 0;
    const speed = parseFloat(document.getElementById('time-speed').value) || 1;
    const factor = parseFloat(document.getElementById('time-faction').value);
    const isMarch = document.getElementById('time-march').checked;
    
    let finalSpeed = speed * factor;
    if (isMarch) finalSpeed *= 1.5;
    
    const hours = dist / finalSpeed;
    document.getElementById('time-result').innerHTML = `Время в пути: <b>${hours.toFixed(2)} ч.</b>`;
}

// 2. Калькулятор Строительства (ИСПРАВЛЕН)
function calcConstruction() {
    const buildData = document.getElementById('build-type').value.split('|');
    const maxHp = parseFloat(buildData[0]);
    const baseHours = parseFloat(buildData[1]);
    const morale = parseFloat(document.getElementById('build-morale').value) / 100;
    const currentHp = parseFloat(document.getElementById('build-hp').value) || 0;

    if (currentHp >= maxHp) {
        document.getElementById('build-timer').innerText = "ЗАВЕРШЕНО";
        return;
    }

    // Коэффициент ускорения от морали
    const k = morale; 
    const timePer1HP = (baseHours / maxHp) / k;
    const hoursToNext = (Math.floor(currentHp + 1) - currentHp) * timePer1HP;

    const format = (h) => {
        const s = Math.round(h * 3600);
        const hh = Math.floor(s / 3600);
        const mm = Math.floor((s % 3600) / 60);
        const ss = s % 60;
        return `${hh}ч ${mm}м ${ss}с`;
    };

    document.getElementById('build-next-hp').innerText = Math.floor(currentHp + 1);
    document.getElementById('build-timer').innerText = format(hoursToNext);
    document.getElementById('build-info').innerText = `Всего осталось: ${format((maxHp - currentHp) * timePer1HP)}`;
}

// 3. Калькулятор Морали
function calcMorale() {
    const m = parseFloat(document.getElementById('moral-val').value) || 100;
    const hp = parseFloat(document.getElementById('inf-hp').value) || 0;
    const max = parseFloat(document.getElementById('inf-max').value) || 1;
    
    const result = (hp / max) * (m / 100) * 100;
    document.getElementById('moral-result').innerHTML = `Эффективное состояние: <b>${result.toFixed(1)}%</b>`;
}
