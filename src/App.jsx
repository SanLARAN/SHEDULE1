import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  BookOpen, Calculator, Globe, FlaskConical, Dumbbell,
  Languages, Atom, Monitor, Music, Shield, Clock,
  MapPin, GraduationCap, MessageCircle, Scale, Leaf,
  Binary, Coffee, Sparkles, PenTool,
} from "lucide-react";

/* ═══════════════════════════════════════════
   РАСПИСАНИЕ
   ═══════════════════════════════════════════ */

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

const DAYS_ORDERED = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const JS_DAY_MAP = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
const DAY_LABELS = { "ПН": "Пн", "ВТ": "Вт", "СР": "Ср", "ЧТ": "Чт", "ПТ": "Пт", "СБ": "Сб", "ВС": "Вс" };

/* ═══════════════════════════════════════════
   МЕТА ПРЕДМЕТОВ
   ═══════════════════════════════════════════ */

const SUBJECT_META = {
  "Душный час":        { icon: MessageCircle, c: ["#94a3b8", "#64748b"] },
  "Лит-ра":            { icon: BookOpen,      c: ["#c084fc", "#f472b6"] },
  "Физра":             { icon: Dumbbell,      c: ["#fb923c", "#f87171"] },
  "Общество":          { icon: Scale,         c: ["#fbbf24", "#f59e0b"] },
  "ОБЗР":              { icon: Shield,        c: ["#34d399", "#2dd4bf"] },
  "Англ яз":           { icon: Languages,     c: ["#60a5fa", "#38bdf8"] },
  "Алгебра":           { icon: Calculator,    c: ["#818cf8", "#6366f1"] },
  "Физика":            { icon: Atom,          c: ["#22d3ee", "#06b6d4"] },
  "Рус яз":            { icon: PenTool,       c: ["#a78bfa", "#8b5cf6"] },
  "Татарский/Русский": { icon: Languages,     c: ["#2dd4bf", "#14b8a6"] },
  "История":           { icon: GraduationCap, c: ["#fb923c", "#ea580c"] },
  "Геометрия":         { icon: Calculator,    c: ["#60a5fa", "#3b82f6"] },
  "Изб. Право":        { icon: Scale,         c: ["#fb7185", "#e11d48"] },
  "География":         { icon: Globe,         c: ["#4ade80", "#22c55e"] },
  "Математика":        { icon: Calculator,    c: ["#818cf8", "#7c3aed"] },
  "Информатика":       { icon: Monitor,       c: ["#38bdf8", "#0284c7"] },
  "Хореография":       { icon: Music,         c: ["#f472b6", "#ec4899"] },
  "Химия":             { icon: FlaskConical,  c: ["#a3e635", "#65a30d"] },
  "Биология":          { icon: Leaf,          c: ["#4ade80", "#16a34a"] },
  "Вероятность":       { icon: Binary,        c: ["#e879f9", "#d946ef"] },
};

const DEFAULT_META = { icon: Sparkles, c: ["#9ca3af", "#6b7280"] };
const getMeta = (s) => SUBJECT_META[s] || DEFAULT_META;

/* ═══════════════════════════════════════════
   УТИЛИТЫ ВРЕМЕНИ
   ═══════════════════════════════════════════ */

const getTodayKey = () => JS_DAY_MAP[new Date().getDay()];
const getNowMins = () => new Date().getHours() * 60 + new Date().getMinutes();

function parseTimeRange(t) {
  const parts = t.split("–");
  const [sh, sm] = parts[0].split(":").map(Number);
  const [eh, em] = parts[1].split(":").map(Number);
  return { start: sh * 60 + sm, end: eh * 60 + em };
}

function getLessonStatus(timeStr, isToday) {
  if (!isToday) return "neutral";
  const now = getNowMins();
  const { start, end } = parseTimeRange(timeStr);
  if (now > end) return "past";
  if (now >= start && now <= end) return "current";
  return "upcoming";
}

function getLessonProgress(timeStr) {
  const now = getNowMins();
  const { start, end } = parseTimeRange(timeStr);
  if (now <= start) return 0;
  if (now >= end) return 100;
  return Math.round(((now - start) / (end - start)) * 100);
}

function getTimeRemaining(timeStr) {
  const { end } = parseTimeRange(timeStr);
  const r = end - getNowMins();
  if (r <= 0) return "Завершён";
  return r + " мин";
}

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Доброе утро ☀️";
  if (h >= 12 && h < 17) return "Добрый день 🌤";
  if (h >= 17 && h < 22) return "Добрый вечер 🌅";
  return "Доброй ночи 🌙";
}

function getFormattedDate() {
  const months = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
  const weekdays = ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"];
  const d = new Date();
  return weekdays[d.getDay()] + ", " + d.getDate() + " " + months[d.getMonth()];
}

/* ═══════════════════════════════════════════
   CSS АНИМАЦИИ
   ═══════════════════════════════════════════ */

const INJECTED_CSS = `
@keyframes auroraA {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(5%,-8%) scale(1.15); }
  66% { transform: translate(-4%,6%) scale(0.88); }
}
@keyframes auroraB {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(-7%,5%) scale(0.9); }
  66% { transform: translate(6%,-4%) scale(1.18); }
}
@keyframes auroraC {
  0%, 100% { transform: translate(0,0) scale(1.05); }
  33% { transform: translate(6%,7%) scale(0.92); }
  66% { transform: translate(-5%,-6%) scale(1.12); }
}
@keyframes livePulse {
  0%, 100% { opacity:1; transform:scale(1); }
  50% { opacity:0.4; transform:scale(2.2); }
}
@keyframes shimmer {
  0% { background-position:-200% 0; }
  100% { background-position:200% 0; }
}
`;

/* ═══════════════════════════════════════════
   КОМПОНЕНТЫ
   ═══════════════════════════════════════════ */

function AuroraBackground() {
  const blobs = [
    { color: "#7c3aed", size: "70vmax", top: "-25%", left: "-15%", anim: "auroraA 20s ease-in-out infinite", opacity: 0.35 },
    { color: "#3b82f6", size: "60vmax", top: "5%", right: "-20%", anim: "auroraB 26s ease-in-out infinite", opacity: 0.28 },
    { color: "#ec4899", size: "65vmax", bottom: "-15%", left: "5%", anim: "auroraC 22s ease-in-out infinite", opacity: 0.22 },
    { color: "#06b6d4", size: "50vmax", bottom: "15%", right: "-5%", anim: "auroraA 18s ease-in-out infinite reverse", opacity: 0.18 },
  ];

  return (
    <>
      <style>{INJECTED_CSS}</style>
      <div className="fixed inset-0 overflow-hidden" style={{ background: "#050816" }}>
        {blobs.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.size,
              height: b.size,
              top: b.top,
              left: b.left,
              right: b.right,
              bottom: b.bottom,
              background: "radial-gradient(circle, " + b.color + " 0%, transparent 70%)",
              filter: "blur(100px)",
              opacity: b.opacity,
              animation: b.anim,
              willChange: "transform",
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.03,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "128px 128px",
          }}
        />
      </div>
    </>
  );
}

function SubjectBadge({ subject, large }) {
  const m = getMeta(subject);
  const Icon = m.icon;
  return (
    <div
      className={"flex items-center justify-center flex-shrink-0 " + (large ? "w-14 h-14 rounded-2xl" : "w-11 h-11 rounded-xl")}
      style={{
        background: "linear-gradient(135deg, " + m.c[0] + "25, " + m.c[1] + "18)",
        border: "1px solid " + m.c[0] + "35",
        boxShadow: "0 4px 14px " + m.c[0] + "18",
      }}
    >
      <Icon size={large ? 24 : 18} color={m.c[0]} strokeWidth={2} />
    </div>
  );
}

function LiveBadge() {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.28)" }}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400" style={{ animation: "livePulse 2s ease-in-out infinite" }} />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
      </span>
      <span className="text-green-400 font-bold" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>LIVE</span>
    </div>
  );
}

function ProgressBar({ value, colors }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height: "3px", background: "rgba(255,255,255,0.08)" }}>
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: value + "%" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: "linear-gradient(90deg, " + colors[0] + ", " + colors[1] + ")",
          boxShadow: "0 0 12px " + colors[0] + "50",
        }}
      />
    </div>
  );
}

function AppHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className="px-5 pt-14 pb-3"
    >
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: 500 }}>{getFormattedDate()}</p>
      <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: 700, marginTop: "2px", letterSpacing: "-0.02em" }}>{getGreeting()}</h1>
    </motion.header>
  );
}

function DaySelector({ selected, onSelect, today }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.05 }}
      className="px-4 mb-5"
    >
      <LayoutGroup>
        <div
          className="flex gap-1.5 p-1.5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {DAYS_ORDERED.map((day) => {
            const isSel = day === selected;
            const isToday = day === today;
            return (
              <motion.button
                key={day}
                onClick={() => onSelect(day)}
                whileTap={{ scale: 0.88 }}
                className="relative flex-1 rounded-xl z-0 cursor-pointer"
                style={{
                  padding: "10px 0",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: isSel ? "#fff" : "rgba(255,255,255,0.35)",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                }}
              >
                <span className="relative z-10">{DAY_LABELS[day]}</span>
                {isToday && !isSel && (
                  <span
                    className="absolute left-1/2 rounded-full bg-blue-400 z-10"
                    style={{ bottom: "4px", width: "4px", height: "4px", transform: "translateX(-50%)" }}
                  />
                )}
                {isSel && (
                  <motion.span
                    layoutId="dayHighlight"
                    className="absolute inset-0 rounded-xl z-0"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </motion.nav>
  );
}

function HeroCard({ lesson, lessonIndex, nextLesson }) {
  const m = getMeta(lesson.subject);
  const prog = getLessonProgress(lesson.time);
  const rem = getTimeRemaining(lesson.time);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 }}
      className="mx-4 mb-5"
    >
      <div
        className="relative overflow-hidden rounded-3xl p-5"
        style={{
          background: "rgba(255,255,255,0.11)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.35), 0 4px 20px " + m.c[0] + "12, inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            top: "-50%", right: "-25%", width: "75%", height: "75%", opacity: 0.07,
            background: "radial-gradient(circle, " + m.c[0] + ", transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0"
          style={{
            height: "1px", opacity: 0.3,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 50%, transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 4s linear infinite",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2" style={{ fontSize: "13px" }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Урок {lessonIndex + 1}</span>
              <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontVariantNumeric: "tabular-nums" }}>{lesson.time}</span>
            </div>
            <LiveBadge />
          </div>

          <div className="flex items-center gap-4 mb-5">
            <SubjectBadge subject={lesson.subject} large />
            <div className="flex-1" style={{ minWidth: 0 }}>
              <h2
                className="truncate"
                style={{ color: "#fff", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 }}
              >
                {lesson.subject}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={13} style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px" }}>Каб. {lesson.room}</span>
              </div>
            </div>
          </div>

          <ProgressBar value={prog} colors={m.c} />
          <div className="flex justify-between mt-2">
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", fontVariantNumeric: "tabular-nums" }}>{prog}% завершено</span>
            <span className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>
              <Clock size={11} />
              {rem}
            </span>
          </div>

          {nextLesson && (
            <div className="flex items-center gap-2 mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", fontWeight: 500 }}>Далее:</span>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 600 }}>{nextLesson.subject}</span>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>· Каб. {nextLesson.room}</span>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function LessonCard({ lesson, lessonIndex, lessonStatus, animDelay }) {
  const m = getMeta(lesson.subject);
  const isPast = lessonStatus === "past";
  const isCurrent = lessonStatus === "current";

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: isPast ? 0.38 : 1, x: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 26, delay: animDelay }}
      whileTap={{ scale: 0.975 }}
    >
      <div
        className="rounded-2xl"
        style={{
          padding: "14px",
          background: isCurrent ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.055)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          border: isCurrent ? "1px solid rgba(255,255,255,0.22)" : "1px solid rgba(255,255,255,0.1)",
          boxShadow: isCurrent
            ? "0 8px 28px rgba(0,0,0,0.25), 0 2px 10px " + m.c[0] + "10, inset 0 1px 0 rgba(255,255,255,0.1)"
            : "0 2px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center" style={{ width: "24px", flexShrink: 0 }}>
            <span
              className="font-bold"
              style={{
                fontSize: "11px",
                fontVariantNumeric: "tabular-nums",
                color: isCurrent ? m.c[0] : "rgba(255,255,255,0.2)",
              }}
            >
              {lessonIndex + 1}
            </span>
          </div>

          <SubjectBadge subject={lesson.subject} />

          <div className="flex-1" style={{ minWidth: 0 }}>
            <h3 className="truncate" style={{ color: "#fff", fontWeight: 600, fontSize: "15px", lineHeight: 1.3 }}>
              {lesson.subject}
            </h3>
            <div className="flex items-center gap-3" style={{ marginTop: "2px" }}>
              <span className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", fontVariantNumeric: "tabular-nums" }}>
                <Clock size={11} style={{ opacity: 0.6 }} />
                {lesson.time}
              </span>
              <span className="flex items-center gap-1" style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>
                <MapPin size={11} style={{ opacity: 0.6 }} />
                {lesson.room}
              </span>
            </div>
          </div>

          {isCurrent && (
            <span className="relative flex flex-shrink-0" style={{ width: "10px", height: "10px" }}>
              <span className="absolute inline-flex rounded-full bg-green-400" style={{ width: "100%", height: "100%", opacity: 0.6, animation: "livePulse 2s ease-in-out infinite" }} />
              <span className="relative inline-flex rounded-full bg-green-400" style={{ width: "10px", height: "10px" }} />
            </span>
          )}
        </div>

        {isCurrent && (
          <div style={{ marginTop: "12px", marginLeft: "36px" }}>
            <ProgressBar value={getLessonProgress(lesson.time)} colors={m.c} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.12 }}
      className="mx-4 mt-10"
    >
      <div
        className="rounded-3xl p-10 text-center"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="mb-5 inline-block"
        >
          <Coffee size={52} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.15)" }} />
        </motion.div>
        <h3 style={{ color: "rgba(255,255,255,0.55)", fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}>Выходной!</h3>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "14px", lineHeight: 1.6 }}>
          Никаких уроков. Отдыхай 🎉
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   ГЛАВНОЕ ПРИЛОЖЕНИЕ
   ═══════════════════════════════════════════ */

export default function App() {
  const today = getTodayKey();
  const [day, setDay] = useState(today);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        var tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        if (tg.setHeaderColor) tg.setHeaderColor("#050816");
        if (tg.setBackgroundColor) tg.setBackgroundColor("#050816");
        if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
      }
    } catch (e) {
      console.log("Not in Telegram");
    }
  }, []);

  useEffect(() => {
    var id = setInterval(function () {
      setTick(function (t) { return t + 1; });
    }, 30000);
    return function () { clearInterval(id); };
  }, []);

  var isToday = day === today;
  var lessons = SCHEDULE[day] || [];

  var currentIdx = useMemo(function () {
    if (!isToday || !lessons.length) return -1;
    for (var i = 0; i < lessons.length; i++) {
      if (getLessonStatus(lessons[i].time, true) === "current") return i;
    }
    return -1;
  }, [isToday, lessons, tick]);

  var nextLesson = (currentIdx >= 0 && currentIdx < lessons.length - 1) ? lessons[currentIdx + 1] : null;

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AuroraBackground />

      <div className="relative z-10 min-h-screen" style={{ paddingBottom: "80px" }}>
        <AppHeader />
        <DaySelector selected={day} onSelect={setDay} today={today} />

        <AnimatePresence mode="wait">
          <motion.div
            key={day}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {lessons.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                {isToday && currentIdx !== -1 && (
                  <HeroCard lesson={lessons[currentIdx]} lessonIndex={currentIdx} nextLesson={nextLesson} />
                )}

                <div className="px-5 mb-3 flex items-center justify-between">
                  <h2 style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    {isToday && currentIdx !== -1 ? "Все уроки" : "Расписание"}
                  </h2>
                  <span
                    className="rounded-md"
                    style={{
                      fontSize: "11px", fontWeight: 600, fontVariantNumeric: "tabular-nums",
                      padding: "2px 8px",
                      color: "rgba(255,255,255,0.35)",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {lessons.length}
                  </span>
                </div>

                <div className="px-4" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {lessons.map(function (l, i) {
                    return (
                      <LessonCard
                        key={day + "-" + i}
                        lesson={l}
                        lessonIndex={i}
                        lessonStatus={getLessonStatus(l.time, isToday)}
                        animDelay={0.06 + i * 0.04}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
