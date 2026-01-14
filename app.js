// Расписание уроков
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

// Эмодзи для предметов
const SUBJECT_EMOJI = {
    "Алгебра": "📐",
    "Геометрия": "📐",
    "Математика": "📐",
    "Вероятность": "🎲",
    "Рус яз": "📝",
    "Лит-ра": "📚",
    "Англ яз": "🇬🇧",
    "Физика": "⚛️",
    "Химия": "🧪",
    "Биология": "🧬",
    "Информатика": "💻",
    "История": "🏛️",
    "Общество": "👥",
    "География": "🌍",
    "Физра": "🏃",
    "Хореография": "💃",
    "Душный час": "😴",
    "ОБЗР": "🛡️",
    "Изб. Право": "⚖️",
    "Татарский/Русский": "🗣️",
};

const DAYS_ORDER = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
const DAYS_MAP = { 0: "ПН", 1: "ВТ", 2: "СР", 3: "ЧТ", 4: "ПТ", 5: "СБ", 6: "ВС" };

let currentDay = getTodayKey();
let updateInterval;

// Инициализация Telegram WebApp
function initTelegram() {
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        // Применяем тему Telegram
        if (tg.colorScheme === 'light') {
            document.body.classList.add('tg-theme-light');
        }
        
        // Устанавливаем цвет хедера
        tg.setHeaderColor('#6c5ce7');
        tg.setBackgroundColor(tg.colorScheme === 'light' ? '#f5f5f7' : '#0f0f0f');
    }
}

function getTodayKey() {
    const day = new Date().getDay();
    return DAYS_MAP[day === 0 ? 6 : day - 1];
}

function getEmoji(subject) {
    for (const [key, emoji] of Object.entries(SUBJECT_EMOJI)) {
        if (subject.includes(key)) return emoji;
    }
    return "📖";
}

function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

function getCurrentLessonInfo(dayKey) {
    const lessons = SCHEDULE[dayKey] || [];
    const now = new Date();
    
    for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        const [startStr, endStr] = lesson.time.split('–');
        const start = parseTime(startStr);
        const end = parseTime(endStr);
        
        if (now >= start && now <= end) {
            const totalDuration = (end - start) / 1000 / 60;
            const elapsed = (now - start) / 1000 / 60;
            const remaining = Math.ceil((end - now) / 1000 / 60);
            const progress = (elapsed / totalDuration) * 100;
            
            return {
                type: 'lesson',
                lesson,
                index: i,
                remaining,
                progress,
                nextLesson: lessons[i + 1] || null
            };
        }
        
        if (now < start) {
            const minsUntil = Math.ceil((start - now) / 1000 / 60);
            return {
                type: 'break',
                nextLesson: lesson,
                nextIndex: i,
                minsUntil
            };
        }
    }
    
    return { type: 'ended' };
}

function updateCurrentLessonCard() {
    const todayKey = getTodayKey();
    const card = document.getElementById('currentLessonCard');
    const section = document.getElementById('currentLessonSection');
    
    // Показываем карточку только для сегодняшнего дня
    if (currentDay !== todayKey) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    const info = getCurrentLessonInfo(todayKey);
    
    card.classList.remove('active', 'break', 'ended');
    
    if (info.type === 'lesson') {
        card.classList.add('active');
        document.getElementById('lessonStatus').innerHTML = `
            <span class="status-dot"></span>
            <span class="status-text">Сейчас идёт</span>
        `;
        document.getElementById('currentSubject').textContent = 
            `${getEmoji(info.lesson.subject)} ${info.lesson.subject}`;
        document.getElementById('currentTimeRange').textContent = info.lesson.time;
        document.getElementById('currentRoom').textContent = `Каб. ${info.lesson.room}`;
        document.getElementById('progressBar').style.width = `${info.progress}%`;
        document.getElementById('timeLeft').textContent = `Осталось ${info.remaining} мин`;
        
    } else if (info.type === 'break') {
        card.classList.add('break');
        document.getElementById('lessonStatus').innerHTML = `
            <span class="status-dot"></span>
            <span class="status-text">Перемена</span>
        `;
        document.getElementById('currentSubject').textContent = 
            `${getEmoji(info.nextLesson.subject)} ${info.nextLesson.subject}`;
        document.getElementById('currentTimeRange').textContent = info.nextLesson.time;
        document.getElementById('currentRoom').textContent = `Каб. ${info.nextLesson.room}`;
        document.getElementById('progressBar').style.width = '0%';
        document.getElementById('timeLeft').textContent = `Через ${info.minsUntil} мин`;
        
    } else {
        card.classList.add('ended');
        document.getElementById('lessonStatus').innerHTML = `
            <span class="status-dot"></span>
            <span class="status-text">Уроки закончились</span>
        `;
        document.getElementById('currentSubject').textContent = '🎉 Свобода!';
        document.getElementById('currentTimeRange').textContent = '';
        document.getElementById('currentRoom').textContent = '';
        document.getElementById('progressBar').style.width = '100%';
        document.getElementById('timeLeft').textContent = 'Отдыхай!';
    }
}

function renderSchedule(dayKey) {
    const lessons = SCHEDULE[dayKey] || [];
    const list = document.getElementById('scheduleList');
    const todayKey = getTodayKey();
    const currentInfo = dayKey === todayKey ? getCurrentLessonInfo(dayKey) : null;
    
    if (lessons.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-emoji">🎉</div>
                <div class="empty-state-text">Выходной!</div>
                <div class="empty-state-subtext">Отдыхай и набирайся сил</div>
            </div>
        `;
        document.getElementById('totalLessons').textContent = '0';
        document.getElementById('endTime').textContent = '—';
        return;
    }
    
    list.innerHTML = lessons.map((lesson, index) => {
        const emoji = getEmoji(lesson.subject);
        let cardClass = 'lesson-card';
        
        if (currentInfo) {
            if (currentInfo.type === 'lesson' && currentInfo.index === index) {
                cardClass += ' current';
            } else if (currentInfo.type === 'lesson' && index < currentInfo.index) {
                cardClass += ' past';
            } else if (currentInfo.type === 'break' && index < currentInfo.nextIndex) {
                cardClass += ' past';
            } else if (currentInfo.type === 'ended') {
                cardClass += ' past';
            }
        }
        
        return `
            <div class="${cardClass}" style="animation-delay: ${index * 0.05}s">
                <div class="lesson-number">${index + 1}</div>
                <div class="lesson-emoji">${emoji}</div>
                <div class="lesson-info">
                    <div class="lesson-subject">${lesson.subject}</div>
                    <div class="lesson-time">${lesson.time}</div>
                </div>
                <div class="lesson-room">${lesson.room}</div>
            </div>
        `;
    }).join('');
    
    // Обновляем статистику
    document.getElementById('totalLessons').textContent = lessons.length;
    const lastLesson = lessons[lessons.length - 1];
    const endTime = lastLesson.time.split('–')[1];
    document.getElementById('endTime').textContent = endTime;
}

function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.getElementById('currentTime').textContent = timeStr;
}

function initDayTabs() {
    const tabs = document.querySelectorAll('.day-tab');
    const todayKey = getTodayKey();
    
    tabs.forEach(tab => {
        const day = tab.dataset.day;
        
        // Отмечаем сегодняшний день
        if (day === todayKey) {
            tab.classList.add('today');
        }
        
        // Активный таб
        if (day === currentDay) {
            tab.classList.add('active');
        }
        
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentDay = day;
            renderSchedule(day);
            updateCurrentLessonCard();
        });
    });
}

function startUpdates() {
    updateTime();
    updateCurrentLessonCard();
    
    // Обновляем каждую минуту
    updateInterval = setInterval(() => {
        updateTime();
        updateCurrentLessonCard();
        if (currentDay === getTodayKey()) {
            renderSchedule(currentDay);
        }
    }, 60000);
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initTelegram();
    initDayTabs();
    renderSchedule(currentDay);
    startUpdates();
});
