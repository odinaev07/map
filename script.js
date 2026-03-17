// ==========================================
// 1. УПРАВЛЕНИЕ ВКЛАДКАМИ И ТЕМОЙ
// ==========================================
function switchTab(tabId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    
    const selected = document.getElementById(tabId);
    selected.classList.remove('hidden');
    selected.classList.add('active');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '🌞';
}
themeToggle.onclick = () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '🌞' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (typeof redrawMap === 'function') redrawMap();
};

function addLeadingZero(number) { return number < 10 ? "0" + number : number; }

// ==========================================
// 2. КАЛЬКУЛЯТОР ВРЕМЕНИ
// ==========================================
function calcTimeTravel() {
    const dist = parseFloat(document.getElementById('time-distance').value) || 0;
    const speed = parseFloat(document.getElementById('time-speed').value) || 1;
    const mapSpeed = parseFloat(document.getElementById('time-mapSpeed').value) || 1;
    const faction = parseFloat(document.getElementById('time-faction').value);
    const march = document.getElementById('time-march').checked ? 1.5 : 1;

    if (speed === 0) return document.getElementById('time-result').innerText = "Скорость не может быть 0";

    const timeInSeconds = dist * 3600 / (speed * faction * march * mapSpeed);
    const h = Math.floor(timeInSeconds / 3600);
    const m = Math.floor((timeInSeconds % 3600) / 60);
    const s = Math.floor(timeInSeconds % 60);

    document.getElementById('time-result').innerText = `Прибытие через: ${addLeadingZero(h)}:${addLeadingZero(m)}:${addLeadingZero(s)}`;
}

// ==========================================
// 3. КАЛЬКУЛЯТОР ДОРОГИ
// ==========================================
function calcRoadTravel() {
    const d1 = parseFloat(document.getElementById("road-dist1").value) || 0;
    const d2 = parseFloat(document.getElementById("road-dist2").value) || 0;
    const t1 = document.getElementById("road-terrain1").value;
    const t2 = document.getElementById("road-terrain2").value;
    const speed = parseFloat(document.getElementById("road-speed").value) || 1;
    const march = document.getElementById("road-march").checked ? 1.5 : 1;

    function getMod(type) {
        if (type === 'friendly') return 0.7;
        if (type === 'enemy') return 0.35;
        return 1.0; 
    }

    const s1 = speed * march * getMod(t1);
    const s2 = speed * march * getMod(t2);

    if (s1 === 0 || s2 === 0) return;

    const total = ((d1 / s1) + (d2 / s2)) * 3600;
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = Math.round(total % 60);

    document.getElementById("road-result").innerText = `Итого: ${h}ч ${m}мин ${s}сек`;
}

// ==========================================
// 4. КАЛЬКУЛЯТОР МОРАЛИ
// ==========================================
function calcMorale() {
    const p = parseFloat(document.getElementById('moral-val').value) || 0;
    const hpInf = parseFloat(document.getElementById('inf-hp').value) || 0;
    const maxInf = parseFloat(document.getElementById('inf-max').value) || 0;
    const hpTank = parseFloat(document.getElementById('tank-hp').value) || 0;
    const maxTank = parseFloat(document.getElementById('tank-max').value) || 0;

    let res = `<b>Мораль пров:</b> ${p}%<br>`;
    
    if (maxInf > 0) {
        const hpi1 = hpInf + 0.01 * maxInf * (p - 100 * hpInf / maxInf) / 5;
        const hpi2 = hpInf + 0.01 * maxInf * (50 - 100 * hpInf / maxInf) / 10;
        const hpi3 = hpInf + 0.01 * maxInf * (50 - 100 * hpInf / maxInf) / 7;
        res += `<hr><b>Пехота (${hpInf}):</b><br>На своей: ${hpi1.toFixed(1)}<br>У союзника: ${hpi2.toFixed(1)}<br>У врага: ${hpi3.toFixed(1)}<br>`;
    }

    if (maxTank > 0) {
        const hpt1 = hpTank + 0.01 * maxTank * (100 - 100 * hpTank / maxTank) / 7;
        res += `<hr><b>Техника (${hpTank}):</b><br>На своей: ${hpt1.toFixed(1)}<br>В другом месте: без изм.<br>`;
    }

    document.getElementById('moral-result').innerHTML = res;
}

// ==========================================
// 5. АНАЛИЗАТОР АЛЬЯНСОВ
// ==========================================
let filteredAlliances = {};
function processAllianceData() {
    const raw = document.getElementById('alliance-data').value;
    const resDiv = document.getElementById('alliance-result');
    try {
        const json = JSON.parse(raw);
        const logins = json.result.logins || [];
        const alliances = {};
        
        logins.forEach(p => {
            const aName = p.allianceName || "Без альянса";
            if(aName === "Без альянса" || aName === "Unknown Alliance") return;
            if (!alliances[aName]) alliances[aName] = [];
            alliances[aName].push({ name: p.login, id: p.siteUserID });
        });

        filteredAlliances = {};
        for(let k in alliances) { if(alliances[k].length >= 2) filteredAlliances[k] = alliances[k]; }

        const sorted = Object.keys(filteredAlliances).sort((a,b) => filteredAlliances[b].length - filteredAlliances[a].length);
        let html = '<table><tr><th>Альянс</th><th>Игроков</th></tr>';
        sorted.forEach(name => {
            html += `<tr onclick="toggleAllyMembers(this, '${name}')"><td>${name}</td><td>${filteredAlliances[name].length}</td></tr>`;
        });
        html += '</table>';
        resDiv.innerHTML = html;
    } catch (e) {
        resDiv.innerHTML = "<span style='color:red'>Ошибка JSON формата</span>";
    }
}

function toggleAllyMembers(row, allyName) {
    const next = row.nextSibling;
    if(next && next.classList && next.classList.contains('member-list-row')) { next.remove(); return; }
    const members = filteredAlliances[allyName];
    const newRow = document.createElement('tr');
    newRow.className = 'member-list-row';
    let listHtml = '<td colspan="2" style="background:var(--bg); padding:10px;"><ul style="margin:0; padding-left:20px; text-align:left;">';
    members.forEach(m => { listHtml += `<li>${m.name} <small>(ID: ${m.id})</small></li>`; });
    listHtml += '</ul></td>';
    newRow.innerHTML = listHtml;
    row.parentNode.insertBefore(newRow, row.nextSibling);
}

// ==========================================
// 6. ИГРОВАЯ КАРТА 
// ==========================================
const countries = ["Sweden", "Germany", "Austria", "Italy", "France", "Britain", "Russia", "Turkey", "Morocco", "Spain"];
const countrySeeds = { "Sweden": [[630, 242]], "Germany": [[517, 538]], "Austria": [[751, 667]], "Italy": [[548, 769], [467, 854], [581, 933]], "France": [[314, 650], [462, 800]], "Britain": [[349, 452], [257, 415]], "Russia": [[1051, 400]], "Turkey": [[904, 865], [866, 830]], "Morocco": [[229, 935]], "Spain": [[160, 788], [325, 844]] };
const regionData = { "Sweden": [1, 3, 3, 6, 1, 1, 0], "Germany": [3, 0, 2, 3, 5, 1, 1], "Austria": [5, 1, 2, 4, 2, 0, 1], "Italy": [5, 1, 2, 1, 2, 1, 3], "France": [6, 2, 4, 1, 2, 0, 0], "Britain": [3, 2, 4, 1, 4, 0, 1], "Russia": [5, 2, 2, 1, 1, 3, 1], "Turkey": [3, 1, 4, 3, 3, 0, 1], "Morocco": [2, 3, 3, 0, 0, 4, 3], "Spain": [3, 2, 5, 3, 2, 0, 0] };
const growthData = { "Sweden": [-200, 99, 299, 199, -34, 75, -133], "Germany": [-1, -200, 200, -101, 365, 75, -34], "Austria": [199, -100, 200, -1, 66, -25, -34], "Italy": [199, -100, 200, -300, 66, 75, 166], "France": [299, -1, 399, -300, 66, -25, -133], "Britain": [-1, -1, 399, -300, 266, -25, -34], "Russia": [199, -1, 200, -300, -34, 274, -34], "Turkey": [-1, -100, 399, -101, 166, -25, -34], "Morocco": [-101, 99, 299, -400, -133, 374, 166], "Spain": [-1, -1, 499, -101, 66, -25, -133] };
const TEAM_COLORS = { 1: [51, 102, 204], 2: [204, 51, 51] };
let teamSelection = {}, pixelToCountry = null, originalPixels = null, canvas, ctx, width, height;

window.onload = function() {
    canvas = document.getElementById('gameCanvas'); 
    if(!canvas) return;
    ctx = canvas.getContext('2d');
    const img = new Image(); 
    img.src = "map.png"; 
    
    img.onload = function() {
        width = canvas.width = img.width; 
        height = canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        setTimeout(() => { 
            try { 
                processMapFloodFill(); 
                document.getElementById('loader').style.display='none'; 
                initTable(); 
            } catch(e){ console.error(e); } 
        }, 50);
    };

    canvas.addEventListener('click', onMapClick);
    canvas.addEventListener('touchstart', function(e) { onMapClick(e.touches[0]); e.preventDefault(); }, {passive: false});
};

function processMapFloodFill() {
    const data = ctx.getImageData(0,0,width,height).data;
    pixelToCountry = new Int8Array(width*height).fill(-1); 
    originalPixels = new Uint8ClampedArray(data);
    
    countries.forEach((name, countryIdx) => {
        countrySeeds[name].forEach(seed => {
            const sIdx = seed[1]*width+seed[0];
            if (pixelToCountry[sIdx]!==-1) return;
            const target = [data[sIdx*4], data[sIdx*4+1], data[sIdx*4+2]];
            const stack = [sIdx]; pixelToCountry[sIdx] = countryIdx;
            
            while(stack.length > 0) {
                const p = stack.pop(); const cx = p%width, cy = Math.floor(p/width);
                [[cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]].forEach(n => {
                    if (n[0]>=0 && n[0]<width && n[1]>=0 && n[1]<height) {
                        const nIdx = n[1]*width+n[0];
                        if (pixelToCountry[nIdx]===-1) {
                            const d = nIdx*4; 
                            const dist = Math.abs(data[d]-target[0])+Math.abs(data[d+1]-target[1])+Math.abs(data[d+2]-target[2]);
                            if (dist<45) { pixelToCountry[nIdx]=countryIdx; stack.push(nIdx); }
                        }
                    }
                });
            }
        });
    });
    redrawMap();
}

function redrawMap() {
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;
    const isDark = document.body.classList.contains('dark');

    for (let i = 0; i < width * height; i++) {
        const r = originalPixels[i*4], g = originalPixels[i*4+1], b = originalPixels[i*4+2];
        if (r > 245 && g > 245 && b > 245) {
            const bgVal = isDark ? 30 : 255; 
            data[i*4] = bgVal; data[i*4+1] = bgVal; data[i*4+2] = bgVal; data[i*4+3] = 255;
            continue;
        }
        const countryIdx = pixelToCountry[i];
        if (countryIdx !== -1) {
            const countryName = countries[countryIdx];
            const team = teamSelection[countryName];
            if (team) {
                const tc = TEAM_COLORS[team];
                data[i*4] = tc[0]; data[i*4+1] = tc[1]; data[i*4+2] = tc[2]; data[i*4+3] = 255;
            } else {
                data[i*4] = 180; data[i*4+1] = 180; data[i*4+2] = 180; data[i*4+3] = 255;
            }
        } else {
            data[i*4] = 80; data[i*4+1] = 80; data[i*4+2] = 80; data[i*4+3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

function onMapClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const cIdx = pixelToCountry[y*width+x];
    if (cIdx !== -1) { 
        const n = countries[cIdx]; 
        setCountryTeam(n, (teamSelection[n] || 0) + 1 > 2 ? 0 : (teamSelection[n] || 0) + 1); 
    }
}

function setCountryTeam(n, id) { 
    if (id===0) delete teamSelection[n]; else teamSelection[n]=id; 
    updateTableVisuals(n); updateStats(); redrawMap(); 
}

function initTable() {
    const tbody = document.getElementById('tableBody'); 
    tbody.innerHTML = '';
    countries.forEach(c => {
        const tr = document.createElement('tr'); 
        tr.id = 'row-'+c;
        const btns = `<div class="btn-group"><button class="team-select-btn ts-blue" id="btn-${c}-1" onclick="setCountryTeam('${c}', 1)">1</button><button class="team-select-btn ts-red" id="btn-${c}-2" onclick="setCountryTeam('${c}', 2)">2</button></div>`;
        tr.innerHTML = `<td align="left">${c}</td><td>${btns}</td>` + regionData[c].map(v => `<td>${v}</td>`).join('');
        tbody.appendChild(tr);
    });
    updateStats();
}

function updateTableVisuals(c) {
    const tr = document.getElementById('row-'+c), team = teamSelection[c];
    tr.className = team===1 ? 'row-blue' : (team===2 ? 'row-red' : '');
    const b1 = document.getElementById(`btn-${c}-1`), b2 = document.getElementById(`btn-${c}-2`);
    if(b1) b1.classList.toggle('active', team===1);
    if(b2) b2.classList.toggle('active', team===2);
}

function updateStats() {
    let sb = Array(7).fill(0), sr = Array(7).fill(0), gbh = Array(7).fill(0), grh = Array(7).fill(0);
    countries.forEach(c => {
        const team = teamSelection[c];
        if (team) {
            regionData[c].forEach((v, i) => team===1 ? sb[i]+=v : sr[i]+=v);
            growthData[c].forEach((v, i) => team===1 ? gbh[i]+=v : grh[i]+=v);
        }
    });

    for(let i=0; i<7; i++) {
        document.getElementById('sb'+i).textContent = sb[i]; document.getElementById('sr'+i).textContent = sr[i];
        document.getElementById('gbh'+i).textContent = gbh[i]; document.getElementById('grh'+i).textContent = grh[i];
        document.getElementById('gbd'+i).textContent = gbh[i]*24; document.getElementById('grd'+i).textContent = grh[i]*24;
    }

    document.getElementById('cat-sb-food').innerHTML = `<b>${sb[0]+sb[1]}</b> <span class="cat-label">ЕДА</span>`;
    document.getElementById('cat-sb-mats').innerHTML = `<b>${sb[2]+sb[3]}</b> <span class="cat-label">МАТ</span>`;
    document.getElementById('cat-sb-ener').innerHTML = `<b>${sb[4]+sb[5]+sb[6]}</b> <span class="cat-label">ЭНЕРГ</span>`;
    
    document.getElementById('cat-sr-food').innerHTML = `<b>${sr[0]+sr[1]}</b> <span class="cat-label">ЕДА</span>`;
    document.getElementById('cat-sr-mats').innerHTML = `<b>${sr[2]+sr[3]}</b> <span class="cat-label">МАТ</span>`;
    document.getElementById('cat-sr-ener').innerHTML = `<b>${sr[4]+sr[5]+sr[6]}</b> <span class="cat-label">ЭНЕРГ</span>`;

    const u = (arr, id) => { document.getElementById(`${id}-food`).textContent=arr[0]+arr[1]; document.getElementById(`${id}-mats`).textContent=arr[2]+arr[3]; document.getElementById(`${id}-ener`).textContent=arr[4]+arr[5]+arr[6]; };
    u(gbh, 'gbh'); u(grh, 'grh'); u(gbh.map(v=>v*24), 'gbd'); u(grh.map(v=>v*24), 'grd');

    const sum = arr => arr.reduce((a,b) => a+b, 0);
    document.getElementById('hud-blue-total').textContent = sum(sb); document.getElementById('hud-red-total').textContent = sum(sr);
}

// ==========================================
// 7. КАЛЬКУЛЯТОР СТРОИТЕЛЬСТВА (ИНТЕГРИРОВАН)
// ==========================================
function calcConstruction() {
    const morale = parseFloat(document.getElementById('build-morale').value) || 0;
    const currentHp = parseFloat(document.getElementById('build-hp').value) || 0;
    
    const buildData = document.getElementById('build-type').value.split('|');
    const maxHp = parseFloat(buildData[0]);
    const baseTotalHours = parseFloat(buildData[1]);

    let k = (morale <= 80) ? (0.2 + 0.01 * morale) : (0.6 + 0.005 * morale);
    const actualTimePerHp = (baseTotalHours / maxHp) / k;
    const totalHoursOnTimer = (maxHp - currentHp) * actualTimePerHp;
    const timerAtNextHp = totalHoursOnTimer - actualTimePerHp;

    const formatFull = (totalHours) => {
        if (totalHours <= 0) return "0д 00:00:00";
        const totalSeconds = Math.round(totalHours * 3600);
        const d = Math.floor(totalSeconds / 86400);
        const h = Math.floor((totalSeconds % 86400) / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${d}д ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const nextHp = Math.floor(currentHp + 1);
    document.getElementById('build-next-hp').innerText = nextHp > maxHp ? maxHp : nextHp;
    document.getElementById('build-timer').innerText = formatFull(timerAtNextHp);
    
    const cycleSeconds = Math.round(actualTimePerHp * 3600);
    const cM = Math.floor(cycleSeconds / 60);
    const cS = cycleSeconds % 60;

    document.getElementById('build-info').innerHTML = `
        Готовность: <b>${formatFull(totalHoursOnTimer)}</b><br>
        1 HP каждые <b>${cM}м ${cS}с</b> (k: ${k.toFixed(3)})
    `;
}
