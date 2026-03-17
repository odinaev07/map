/* =====================
   ПЕРЕМЕННЫЕ И ОСНОВА
===================== */
:root {
    --bg: #f0f2f5;
    --bg-soft: #ffffff;
    --bg-card: #ffffff;
    --text: #1a1f36;
    --text-muted: #697386;
    --border: #e3e8ee;
    --input-bg: #ffffff;
    --primary: #3b82f6;
    --primary-hover: #2563eb;
    --blue-soft: #e8f0fe;
    --red-soft: #fde8e8;
    --shadow: 0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1);
    
    --team-blue: #3b82f6;
    --team-red: #ef4444;
}

body.dark {
    --bg: #0f172a;
    --bg-soft: #1e293b;
    --bg-card: #1e293b;
    --text: #f8fafc;
    --text-muted: #94a3b8;
    --border: #334155;
    --input-bg: #0f172a;
    --primary: #60a5fa;
    --blue-soft: rgba(59, 130, 246, 0.15);
    --shadow: 0 10px 15px rgba(0,0,0,0.3);
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

body { 
    margin: 0; 
    font-family: 'Inter', -apple-system, system-ui, sans-serif; 
    background: var(--bg); 
    color: var(--text);
    line-height: 1.5;
    transition: background 0.3s;
}

/* =====================
   LAYOUT (HUD)
===================== */
.top-hud {
    position: fixed; top: 0; left: 0; right: 0; height: 60px;
    background: var(--bg-soft); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px; z-index: 1000; box-shadow: var(--shadow);
}

.hud-left { display: flex; align-items: center; gap: 15px; }
.game-title { font-weight: 800; font-size: 14px; color: var(--primary); text-transform: uppercase; }

.main-nav { display: flex; gap: 8px; }
.nav-btn {
    background: transparent; border: none; padding: 6px 12px;
    color: var(--text-muted); font-weight: 600; cursor: pointer;
    border-radius: 8px; transition: 0.2s; font-size: 13px;
}
.nav-btn.active { background: var(--blue-soft); color: var(--primary); }

.main-content { padding-top: 60px; min-height: 100vh; }

/* =====================
   TOOLS GRID (4 БОК О БОК)
===================== */
.tools-grid {
    display: grid;
    /* По умолчанию 4 колонки */
    grid-template-columns: repeat(4, 1fr); 
    gap: 20px;
    padding: 25px;
    max-width: 1800px;
    margin: 0 auto;
}

.tool-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    height: 100%; /* Выравнивает высоту всех карточек в ряду */
}

/* Обычная карточка занимает 1 колонку, анализатор сделаем чуть шире, если нужно */
.large-card { grid-column: span 1; } 

h3 { 
    margin: 0 0 15px 0; 
    font-size: 15px; 
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
}

/* =====================
   ФОРМЫ И ЭЛЕМЕНТЫ
===================== */
.form-group { margin-bottom: 12px; }
.form-group label { 
    display: block; 
    font-size: 11px; 
    font-weight: 700; 
    color: var(--text-muted); 
    margin-bottom: 4px; 
    text-transform: uppercase;
}

.input-row { display: flex; gap: 8px; margin-bottom: 8px; }

input, select, textarea {
    width: 100%; padding: 10px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--input-bg);
    color: var(--text); font-size: 14px; transition: 0.2s;
}

input:focus, select:focus {
    outline: none; border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--blue-soft);
}

.btn-primary {
    background: var(--primary);
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    width: 100%;
    margin-top: auto; /* Прижимает кнопку к низу карточки */
    transition: 0.2s;
}

.btn-primary:hover { filter: brightness(1.1); }

.result-box {
    margin-top: 15px; padding: 12px; border-radius: 8px;
    background: var(--bg); font-size: 13px;
    border-left: 4px solid var(--primary);
}

/* =====================
   АДАПТИВНОСТЬ (МОБИЛКИ)
===================== */

/* Планшеты: 2 в ряд */
@media (max-width: 1200px) {
    .tools-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Телефоны: 1 в ряд */
@media (max-width: 768px) {
    .tools-grid {
        grid-template-columns: 1fr;
        padding: 15px;
        gap: 15px;
    }

    .top-hud { padding: 0 10px; }
    .hud-center { display: none; } /* Скрываем счет команд на мобилках */
    
    .nav-btn { padding: 6px 8px; font-size: 12px; }
    
    .tool-card { padding: 15px; }
    
    /* Скролл для таблиц внутри карточек */
    .table-responsive {
        margin: 0 -15px;
        padding: 0 15px;
        width: calc(100% + 30px);
    }
}

/* =====================
   MAP VIEW (СПЕЦИФИКА)
===================== */
.container-map { display: flex; height: calc(100vh - 60px); }
.map-wrapper { flex: 1; position: relative; overflow: hidden; padding: 10px; background: #000; }
canvas { max-width: 100%; height: auto; border-radius: 8px; cursor: crosshair; }

.sidebar {
    width: 450px; background: var(--bg-soft); border-left: 1px solid var(--border);
    padding: 15px; overflow-y: auto;
}

@media (max-width: 1000px) {
    .container-map { flex-direction: column; height: auto; }
    .sidebar { width: 100%; border-left: none; border-top: 1px solid var(--border); }
}

/* Стили таблиц */
table { width: 100%; border-collapse: collapse; font-size: 11px; }
th, td { padding: 6px; border: 1px solid var(--border); text-align: center; }
th { background: var(--bg); color: var(--text-muted); }
.row-blue { background: rgba(59, 130, 246, 0.08); }
.row-red { background: rgba(239, 68, 68, 0.08); }
