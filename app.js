// Конфигурация
const API_URL = 'http://localhost:8080'; // Заменить на реальный URL API
const USE_LOCAL = true; // true = локальные данные, false = API

// Расписание (локальная копия)
const SCHEDULE = {
    "ПН": [
        { time: "08:00–08:40", subject: "Душный час", room: "403" },
        { time: "08:45–09:20", subject: "Лит-ра", room: "403" },
        { time: "09:30–10:05", subject: "Лит-ра", room: "403" },
        { time: "10:15–10:50", subject: "Физра", room: "Зал" },
        { time: "11:00–11:35", subject: "Общество", room: "205" },
        { time: "11:45–12:20", subject: "ОБЗР", room: "208" },
        { time: "12:25–13:00", subject: "Англ яз", room: "202" },
    ],
    "ВТ": [
        { time: "08:00–08:40", subject: "Алгебра", room: "207" },
        { time: "08:45–09:25", subject: "Алгебра", room: "207" },
        { time: "09:35–10:15", subject: "Физра", room: "Зал" },
        { time: "10:25–11:05", subject: "Физика", room: "211" },
        { time: "11:15–11:55", subject: "Рус яз", room: "403" },
        { time: "12:00–12:40", subject: "Татарский/Русский", room: "TBD/403" },
        { time: "12:45–13:25", subject: "Англ яз", room: "202" },
    ],
    "СР": [
        { time: "08:00–08:40", subject: "Рус яз", room: "403" },
        { time: "08:45–09:25", subject: "Рус яз", room: "403" },
        { time: "09:35–10:15", subject: "История", room: "404" },
        { time: "10:25–11:05", subject: "История", room: "404" },
        { time: "11:15–11:55", subject: "Алгебра", room: "207" },
        { time: "12:00–12:40", subject: "Геометрия", room: "207" },
        { time: "12:45–13:25", subject: "Изб. Право", room: "205" },
    ],
    "ЧТ": [
        { time: "08:00–08:40", subject: "Душный час", room: "403" },
        { time: "08:45–09:20", subject: "Общество", room: "205" },
        { time: "09:30–10:05", subject: "География", room: "402" },
        { time: "10:15–10:50", subject: "Лит-ра", room: "403" },
        { time: "11:00–11:35", subject: "Физика", room: "211" },
        { time: "11:45–12:20", subject: "Математика", room: "207" },
        { time: "12:25–13:00", subject: "Татарский/Русский", room: "TBD/403" },
    ],
    "ПТ": [
        { time: "08:00–08:40", subject: "Информатика", room: "311" },
        { time: "08:45–09:25", subject: "Хореография", room: "Зал" },
        { time: "09:35–10:15", subject: "Химия", room: "215" },
        { time: "10:25–11:05", subject: "Общество", room: "205" },
        { time: "11:15–11:55", subject: "Общество", room: "205" },
        { time: "12:00–12:40", subject: "Англ яз", room: "202" },
    ],
    "СБ": [
        { time: "08:00–08:40", subject: "Биология", room: "402" },
        { time: "08:45–09:25", subject: "История", room: "406" },
        { time: "09:35–10:15", subject: "История", room: "406" },
        { time: "10:25–11:05", subject: "Вероятность", room: "207" },
        { time: "11:15–11:55", subject: "Рус яз", room: "403" },
    ],
    "ВС": [],
};

const DAYS_MAP = { 0: "ПН", 1: "ВТ", 2: "СР", 3: "ЧТ", 4: "ПТ", 5: "СБ", 6: "ВС" };
const DAYS_FULL = {
    "ПН": "Понедельник", "ВТ": "Вторник", "СР": "Среда",
    "ЧТ": "Четверг", "ПТ": "Пятница", "СБ": "Суббота", "ВС": "Воскресенье"
};

let currentDay = getTodayKey();
let notes = {}; // {"ПН_0": {text: "...", author: "Имя", author_id: 123, likes: [456]}}
let settings = {
    notifications: true,
    notify_before: 5,
    morning_digest: true,
    morning_hour: 7,
    morning_minute: 30
};
let userId = 0;
let userName = 'Аноним';
let currentNoteKey = null;

// Telegram WebApp
function initTelegram() {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        tg.setHeaderColor('#7c5cff');
        tg.setBackgroundColor('#0d0d0f');
        
        if (tg.initDataUnsafe?.user) {
            const user = tg.initDataUnsafe.user;
            userId = user.id;
            userName = user.first_name + (user.last_name ? ' ' + user.last_name[0] + '.' : '');
            
            const avatar = document.getElementById('userAvatar');
            if (user.photo_url) {
                avatar.src = user.photo_url;
            } else {
                const initial = (user.first_name?.[0] || '?').toUpperCase();
                avatar.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%237c5cff'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='white' font-size='16' font-weight='600'%3E${initial}%3C/text%3E%3C/svg%3E`;
            }
        }
    }
}

function getTodayKey() {
    const day = new Date().getDay();
    return DAYS_MAP[day === 0 ? 6 : day - 1];
}

function parseTime(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
}

function getCurrentLessonInfo(dayKey) {
    const lessons = SCHEDULE[dayKey] || [];
    const now = new Date();
    
    for (let i = 0; i < lessons.length; i++) {
        const [startStr, endStr] = lessons[i].time.split('–');
        const start = parseTime(startStr);
        const end = parseTime(endStr);
        
        if (now >= start && now <= end) {
            const total = (end - start) / 1000 / 60;
            const elapsed = (now - start) / 1000 / 60;
            const remaining = Math.ceil((end - now) / 1000 / 60);
            return {
                type: 'lesson',
                lesson: lessons[i],
                index: i,
                remaining,
                progress: (elapsed / total) * 100,
                next: lessons[i + 1] || null
            };
        }
        
        if (now < start) {
            return {
                type: 'break',
                next: lessons[i],
                nextIndex: i,
                minsUntil: Math.ceil((start - now) / 1000 / 60)
            };
        }
    }
    
    return { type: 'ended' };
}

// Обновление времени каждую секунду
function updateTime() {
    const now = new Date();
    document.getElementById('currentTime').textContent = 
        now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function updateCurrentLesson() {
    const todayKey = getTodayKey();
    const section = document.getElementById('currentLessonSection');
    const card = document.getElementById('currentLessonCard');
    
    if (currentDay !== todayKey) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    const info = getCurrentLessonInfo(todayKey);
    
    card.className = 'current-lesson-card';
    
    if (info.type === 'lesson') {
        card.classList.add('active');
        document.getElementById('statusText').textContent = 'Сейчас идёт';
        document.getElementById('currentSubject').textContent = info.lesson.subject;
        document.getElementById('currentTimeRange').textContent = info.lesson.time;
        document.getElementById('currentRoom').textContent = `каб. ${info.lesson.room}`;
        document.getElementById('progressBar').style.width = `${info.progress}%`;
        document.getElementById('timeLeft').textContent = `${info.remaining} мин`;
    } else if (info.type === 'break') {
        card.classList.add('break');
        document.getElementById('statusText').textContent = 'Перемена';
        document.getElementById('currentSubject').textContent = info.next.subject;
        document.getElementById('currentTimeRange').textContent = info.next.time;
        document.getElementById('currentRoom').textContent = `каб. ${info.next.room}`;
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('timeLeft').textContent = `через ${info.minsUntil} мин`;
    } else {
        card.classList.add('ended');
        document.getElementById('statusText').textContent = 'Уроки закончились';
        document.getElementById('currentSubject').textContent = 'Свободен';
        document.getElementById('currentTimeRange').textContent = '';
        document.getElementById('currentRoom').textContent = '';
        document.getElementById('progressBar').style.width = '100%';
        document.getElementById('timeLeft').textContent = '';
    }
}

function renderSchedule(dayKey) {
    const lessons = SCHEDULE[dayKey] || [];
    const list = document.getElementById('scheduleList');
    const todayKey = getTodayKey();
    const currentInfo = dayKey === todayKey ? getCurrentLessonInfo(dayKey) : null;
    
    if (!lessons.length) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-text">🎉 Выходной</div>
                <div class="empty-state-subtext">Отдыхай</div>
            </div>
        `;
        document.getElementById('totalLessons').textContent = '0';
        document.getElementById('endTime').textContent = '—';
        return;
    }
    
    list.innerHTML = lessons.map((lesson, i) => {
        const noteKey = `${dayKey}_${i}`;
        const noteData = notes[noteKey];
        const hasNote = noteData?.text?.trim();
        const likesCount = noteData?.likes?.length || 0;
        
        let cardClass = 'lesson-card';
        if (hasNote) cardClass += ' has-note';
        
        if (currentInfo) {
            if (currentInfo.type === 'lesson' && currentInfo.index === i) {
                cardClass += ' current';
            } else if (currentInfo.type === 'lesson' && i < currentInfo.index) {
                cardClass += ' past';
            } else if (currentInfo.type === 'break' && i < currentInfo.nextIndex) {
                cardClass += ' past';
            } else if (currentInfo.type === 'ended') {
                cardClass += ' past';
            }
        }
        
        const noteIndicator = hasNote ? `
            <div class="note-preview">
                <span class="note-indicator">📝</span>
                ${likesCount > 0 ? `<span class="likes-count">❤️ ${likesCount}</span>` : ''}
            </div>
        ` : '';
        
        return `
            <div class="${cardClass}" data-day="${dayKey}" data-index="${i}">
                <div class="lesson-number">${i + 1}</div>
                <div class="lesson-info">
                    <div class="lesson-subject">${lesson.subject}</div>
                    <div class="lesson-time">${lesson.time}</div>
                    ${noteIndicator}
                </div>
                <div class="lesson-room">${lesson.room}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('totalLessons').textContent = lessons.length;
    document.getElementById('endTime').textContent = lessons[lessons.length - 1].time.split('–')[1];
    
    list.querySelectorAll('.lesson-card').forEach(card => {
        card.addEventListener('click', () => openNoteModal(card.dataset.day, parseInt(card.dataset.index)));
    });
}

function openNoteModal(dayKey, index) {
    const lesson = SCHEDULE[dayKey][index];
    currentNoteKey = `${dayKey}_${index}`;
    const noteData = notes[currentNoteKey] || {};
    
    document.getElementById('modalSubject').textContent = lesson.subject;
    document.getElementById('modalDetails').textContent = `${DAYS_FULL[dayKey]} · ${lesson.time} · каб. ${lesson.room}`;
    document.getElementById('noteText').value = noteData.text || '';
    
    // Показываем автора если есть заметка
    const authorEl = document.getElementById('noteAuthor');
    if (noteData.text && noteData.author) {
        authorEl.textContent = `✏️ ${noteData.author}`;
        authorEl.style.display = 'block';
    } else {
        authorEl.style.display = 'none';
    }
    
    // Лайки
    const likesCount = noteData.likes?.length || 0;
    const isLiked = noteData.likes?.includes(userId);
    const likeBtn = document.getElementById('likeBtn');
    likeBtn.innerHTML = `${isLiked ? '❤️' : '🤍'} ${likesCount || ''}`;
    likeBtn.classList.toggle('liked', isLiked);
    likeBtn.style.display = noteData.text ? 'flex' : 'none';
    
    // Показываем кнопку удаления только автору
    const deleteBtn = document.getElementById('deleteNote');
    const canDelete = !noteData.author_id || noteData.author_id === userId;
    deleteBtn.style.display = canDelete && noteData.text ? 'block' : 'none';
    
    document.getElementById('noteModal').classList.add('active');
}

function closeNoteModal() {
    document.getElementById('noteModal').classList.remove('active');
    currentNoteKey = null;
}

async function saveNote() {
    const text = document.getElementById('noteText').value.trim();
    
    if (text) {
        const existing = notes[currentNoteKey] || {};
        notes[currentNoteKey] = {
            text,
            author: userName,
            author_id: userId,
            likes: existing.likes || []
        };
    } else {
        delete notes[currentNoteKey];
    }
    
    localStorage.setItem('schedule_notes', JSON.stringify(notes));
    
    if (!USE_LOCAL) {
        try {
            await fetch(`${API_URL}/api/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    key: currentNoteKey, 
                    text,
                    author: userName,
                    author_id: userId
                })
            });
        } catch (e) {
            console.log('API недоступен');
        }
    }
    
    closeNoteModal();
    renderSchedule(currentDay);
}

async function toggleLike() {
    if (!notes[currentNoteKey]?.text) return;
    
    const noteData = notes[currentNoteKey];
    if (!noteData.likes) noteData.likes = [];
    
    const idx = noteData.likes.indexOf(userId);
    if (idx > -1) {
        noteData.likes.splice(idx, 1);
    } else {
        noteData.likes.push(userId);
    }
    
    localStorage.setItem('schedule_notes', JSON.stringify(notes));
    
    if (!USE_LOCAL) {
        try {
            await fetch(`${API_URL}/api/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: currentNoteKey, user_id: userId })
            });
        } catch (e) {
            console.log('API недоступен');
        }
    }
    
    // Обновляем UI
    const isLiked = noteData.likes.includes(userId);
    const likeBtn = document.getElementById('likeBtn');
    likeBtn.innerHTML = `${isLiked ? '❤️' : '🤍'} ${noteData.likes.length || ''}`;
    likeBtn.classList.toggle('liked', isLiked);
    
    renderSchedule(currentDay);
}

function deleteNote() {
    document.getElementById('noteText').value = '';
    saveNote();
}

// Настройки
function loadSettings() {
    const saved = localStorage.getItem('schedule_settings_' + userId);
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
    }
    updateSettingsUI();
}

function updateSettingsUI() {
    const notifToggle = document.getElementById('toggleNotifications');
    const morningToggle = document.getElementById('toggleMorning');
    
    notifToggle.classList.toggle('active', settings.notifications);
    morningToggle.classList.toggle('active', settings.morning_digest);
    
    document.getElementById('notifyBefore').value = settings.notify_before;
    
    const h = String(settings.morning_hour).padStart(2, '0');
    const m = String(settings.morning_minute).padStart(2, '0');
    document.getElementById('morningTime').value = `${h}:${m}`;
}

async function saveSettings() {
    localStorage.setItem('schedule_settings_' + userId, JSON.stringify(settings));
    
    if (!USE_LOCAL) {
        try {
            await fetch(`${API_URL}/api/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, settings })
            });
        } catch (e) {
            console.log('API недоступен');
        }
    }
}

function initSettings() {
    document.getElementById('toggleNotifications').addEventListener('click', () => {
        settings.notifications = !settings.notifications;
        updateSettingsUI();
        saveSettings();
    });
    
    document.getElementById('toggleMorning').addEventListener('click', () => {
        settings.morning_digest = !settings.morning_digest;
        updateSettingsUI();
        saveSettings();
    });
    
    document.getElementById('notifyBefore').addEventListener('change', (e) => {
        settings.notify_before = parseInt(e.target.value);
        saveSettings();
    });
    
    document.getElementById('morningTime').addEventListener('change', (e) => {
        const [h, m] = e.target.value.split(':').map(Number);
        settings.morning_hour = h;
        settings.morning_minute = m;
        saveSettings();
    });
}

function initViewTabs() {
    const tabs = document.querySelectorAll('.view-tab');
    const scheduleView = document.getElementById('scheduleView');
    const settingsView = document.getElementById('settingsView');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            if (tab.dataset.view === 'schedule') {
                scheduleView.style.display = 'block';
                settingsView.style.display = 'none';
            } else {
                scheduleView.style.display = 'none';
                settingsView.style.display = 'block';
            }
        });
    });
}

function initDayTabs() {
    const tabs = document.querySelectorAll('.day-tab');
    const todayKey = getTodayKey();
    
    tabs.forEach(tab => {
        const day = tab.dataset.day;
        
        if (day === todayKey) {
            tab.classList.add('today');
        }
        if (day === currentDay) {
            tab.classList.add('active');
        }
        
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentDay = day;
            renderSchedule(day);
            updateCurrentLesson();
        });
    });
}

function initModal() {
    document.getElementById('closeModal').addEventListener('click', closeNoteModal);
    document.getElementById('saveNote').addEventListener('click', saveNote);
    document.getElementById('deleteNote').addEventListener('click', deleteNote);
    document.getElementById('likeBtn').addEventListener('click', toggleLike);
    
    document.getElementById('noteModal').addEventListener('click', (e) => {
        if (e.target.id === 'noteModal') closeNoteModal();
    });
}

async function loadNotes() {
    // Сначала из localStorage
    const saved = localStorage.getItem('schedule_notes');
    if (saved) {
        notes = JSON.parse(saved);
    }
    
    // Потом с сервера если есть
    if (!USE_LOCAL) {
        try {
            const res = await fetch(`${API_URL}/api/notes`);
            notes = await res.json();
            localStorage.setItem('schedule_notes', JSON.stringify(notes));
        } catch (e) {
            console.log('API недоступен, используем локальные данные');
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    initTelegram();
    await loadNotes();
    loadSettings();
    initDayTabs();
    initViewTabs();
    initSettings();
    initModal();
    renderSchedule(currentDay);
    
    // Обновление каждую секунду
    updateTime();
    updateCurrentLesson();
    
    setInterval(() => {
        updateTime();
        updateCurrentLesson();
    }, 1000);
    
    // Перерисовка расписания каждую минуту
    setInterval(() => {
        if (currentDay === getTodayKey()) {
            renderSchedule(currentDay);
        }
    }, 60000);
});
