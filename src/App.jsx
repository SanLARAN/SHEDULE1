import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  BookOpen,
  Calculator,
  Globe,
  FlaskConical,
  Dumbbell,
  Languages,
  Atom,
  Monitor,
  Music,
  Shield,
  Clock,
  MapPin,
  GraduationCap,
  MessageCircle,
  Scale,
  Leaf,
  Binary,
  Coffee,
  Sparkles,
  PenTool,
} from "lucide-react";

// ═══════════════════════════════════════════════════════
//  SCHEDULE DATA
// ═══════════════════════════════════════════════════════

const SCHEDULE = {
  ПН: [
    { time: "08:00–08:40", subject: "Душный час", room: "403" },
    { time: "08:45–09:20", subject: "Лит-ра", room: "403" },
    { time: "09:30–10:05", subject: "Лит-ра", room: "403" },
    { time: "10:15–10:50", subject: "Физра", room: "Зал" },
    { time: "11:00–11:35", subject: "Общество", room: "205" },
    { time: "11:45–12:20", subject: "ОБЗР", room: "208" },
    { time: "12:25–13:00", subject: "Англ яз", room: "202" },
  ],
  ВТ: [
    { time: "08:00–08:40", subject: "Алгебра", room: "207" },
    { time: "08:45–09:25", subject: "Алгебра", room: "207" },
    { time: "09:35–10:15", subject: "Физра", room: "Зал" },
    { time: "10:25–11:05", subject: "Физика", room: "211" },
    { time: "11:15–11:55", subject: "Рус яз", room: "403" },
    { time: "12:00–12:40", subject: "Татарский/Русский", room: "TBD/403" },
    { time: "12:45–13:25", subject: "Англ яз", room: "202" },
  ],
  СР: [
    { time: "08:00–08:40", subject: "Рус яз", room: "403" },
    { time: "08:45–09:25", subject: "Рус яз", room: "403" },
    { time: "09:35–10:15", subject: "История", room: "404" },
    { time: "10:25–11:05", subject: "История", room: "404" },
    { time: "11:15–11:55", subject: "Алгебра", room: "207" },
    { time: "12:00–12:40", subject: "Геометрия", room: "207" },
    { time: "12:45–13:25", subject: "Изб. Право", room: "205" },
  ],
  ЧТ: [
    { time: "08:00–08:40", subject: "Душный час", room: "403" },
    { time: "08:45–09:20", subject: "Общество", room: "205" },
    { time: "09:30–10:05", subject: "География", room: "402" },
    { time: "10:15–10:50", subject: "Лит-ра", room: "403" },
    { time: "11:00–11:35", subject: "Физика", room: "211" },
    { time: "11:45–12:20", subject: "Математика", room: "207" },
    { time: "12:25–13:00", subject: "Татарский/Русский", room: "TBD/403" },
  ],
  ПТ: [
    { time: "08:00–08:40", subject: "Информатика", room: "311" },
    { time: "08:45–09:25", subject: "Хореография", room: "Зал" },
    { time: "09:35–10:15", subject: "Химия", room: "215" },
    { time: "10:25–11:05", subject: "Общество", room: "205" },
    { time: "11:15–11:55", subject: "Общество", room: "205" },
    { time: "12:00–12:40", subject: "Англ яз", room: "202" },
  ],
  СБ: [
    { time: "08:00–08:40", subject: "Биология", room: "402" },
    { time: "08:45–09:25", subject: "История", room: "406" },
    { time: "09:35–10:15", subject: "История", room: "406" },
    { time: "10:25–11:05", subject: "Вероятность", room: "207" },
    { time: "11:15–11:55", subject: "Рус яз", room: "403" },
  ],
  ВС: [],
};

const DAYS_ORDERED = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const JS_DAY_TO_KEY = ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"];
const DAY_LABELS = {
  ПН: "Пн",
  ВТ: "Вт",
  СР: "Ср",
  ЧТ: "Чт",
  ПТ: "Пт",
  СБ: "Сб",
  ВС: "Вс",
};

// ═══════════════════════════════════════════════════════
//  SUBJECT VISUAL METADATA
// ═══════════════════════════════════════════════════════

const SUBJECT_META = {
  "Душный час": { icon: MessageCircle, c: ["#94a3b8", "#64748b"] },
  "Лит-ра": { icon: BookOpen, c: ["#c084fc", "#f472b6"] },
  Физра: { icon: Dumbbell, c: ["#fb923c", "#f87171"] },
  Общество: { icon: Scale, c: ["#fbbf24", "#f59e0b"] },
  ОБЗР: { icon: Shield, c: ["#34d399", "#2dd4bf"] },
  "Англ яз": { icon: Languages, c: ["#60a5fa", "#38bdf8"] },
  Алгебра: { icon: Calculator, c: ["#818cf8", "#6366f1"] },
  Физика: { icon: Atom, c: ["#22d3ee", "#06b6d4"] },
  "Рус яз": { icon: PenTool, c: ["#a78bfa", "#8b5cf6"] },
  "Татарский/Русский": { icon: Languages, c: ["#2dd4bf", "#14b8a6"] },
  История: { icon: GraduationCap, c: ["#fb923c", "#ea580c"] },
  Геометрия: { icon: Calculator, c: ["#60a5fa", "#3b82f6"] },
  "Изб. Право": { icon: Scale, c: ["#fb7185", "#e11d48"] },
  География: { icon: Globe, c: ["#4ade80", "#22c55e"] },
  Математика: { icon: Calculator, c: ["#818cf8", "#7c3aed"] },
  Информатика: { icon: Monitor, c: ["#38bdf8", "#0284c7"] },
  Хореография: { icon: Music, c: ["#f472b6", "#ec4899"] },
  Химия: { icon: FlaskConical, c: ["#a3e635", "#65a30d"] },
  Биология: { icon: Leaf, c: ["#4ade80", "#16a34a"] },
  Вероятность: { icon: Binary, c: ["#e879f9", "#d946ef"] },
};

const DEFAULT_META = { icon: Sparkles, c: ["#9ca3af", "#6b7280"] };
const meta = (s) => SUBJECT_META[s] || DEFAULT_META;

// ═══════════════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════════════

const todayKey = () => JS_DAY_TO_KEY[new Date().getDay()];
const nowMins = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};

function parseRange(t) {
  const [a, b] = t.split("–");
  const [sh, sm] = a.split(":").map(Number);
  const [eh, em] = b.split(":").map(Number);
  return { s: sh * 60 + sm, e: eh * 60 + em };
}

function status(t, today) {
  if (!today) return "neutral";
  const n = nowMins();
  const { s, e } = parseRange(t);
  if (n > e) return "past";
  if (n >= s && n <= e) return "current";
  return "upcoming";
}

function progress(t) {
  const n = nowMins();
  const { s, e } = parseRange(t);
  if (n <= s) return 0;
  if (n >= e) return 100;
  return Math.round(((n - s) / (e - s)) * 100);
}

function remaining(t) {
  const { e } = parseRange(t);
  const r = e - nowMins();
  if (r <= 0) return "Завершён";
  return `${r} мин`;
}

function greeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Доброе утро ☀️";
  if (h >= 12 && h < 17) return "Добрый день 🌤";
  if (h >= 17 && h < 22) return "Добрый вечер 🌅";
  return "Доброй ночи 🌙";
}

function fmtDate() {
  const m = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];
  const w = [
    "Воскресенье", "Понедельник", "Вторник", "Среда",
    "Четверг", "Пятница", "Суббота",
  ];
  const d = new Date();
  return `${w[d.getDay()]}, ${d.getDate()} ${m[d.getMonth()]}`;
}

// ═══════════════════════════════════════════════════════
//  CSS KEYFRAMES (injected once)
// ═══════════════════════════════════════════════════════

const KEYFRAMES = `
@keyframes auroraA{
  0%,100%{transform:translate(0,0) scale(1)}
  33%{transform:translate(5%,-8%) scale(1.15)}
  66%{transform:translate(-4%,6%) scale(.88)}
}
@keyframes auroraB{
  0%,100%{transform:translate(0,0) scale(1)}
  33%{transform:translate(-7%,5%) scale(.9)}
  66%{transform:translate(6%,-4%) scale(1.18)}
}
@keyframes auroraC{
  0%,100%{transform:translate(0,0) scale(1.05)}
  33%{transform:translate(6%,7%) scale(.92)}
  66%{transform:translate(-5%,-6%) scale(1.12)}
}
@keyframes livePulse{
  0%,100%{opacity:1;transform:scale(1)}
  50%{opacity:.4;transform:scale(2.2)}
}
@keyframes shimmer{
  0%{background-position:-200% 0}
  100%{background-position:200% 0}
}
`;

// ═══════════════════════════════════════════════════════
//  SUB-COMPONENTS
// ═══════════════════════════════════════════════════════

/* ───── Animated Background ───── */

function AuroraBackground() {
  const blobs = [
    {
      color: "#7c3aed",
      w: "70vmax",
      top: "-25%",
      left: "-15%",
      anim: "auroraA 20s ease-in-out infinite",
      opacity: 0.35,
    },
    {
      color: "#3b82f6",
      w: "60vmax",
      top: "5%",
      right: "-20%",
      anim: "auroraB 26s ease-in-out infinite",
      opacity: 0.28,
    },
    {
      color: "#ec4899",
      w: "65vmax",
      bottom: "-15%",
      left: "5%",
      anim: "auroraC 22s ease-in-out infinite",
      opacity: 0.22,
    },
    {
      color: "#06b6d4",
      w: "50vmax",
      bottom: "15%",
      right: "-5%",
      anim: "auroraA 18s ease-in-out infinite reverse",
      opacity: 0.18,
    },
  ];

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div className="fixed inset-0 overflow-hidden" style={{ background: "#050816" }}>
        {blobs.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: b.w,
              height: b.w,
              top: b.top,
              left: b.left,
              right: b.right,
              bottom: b.bottom,
              background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
              filter: "blur(100px)",
              opacity: b.opacity,
              animation: b.anim,
              willChange: "transform",
            }}
          />
        ))}
        {/* Subtle noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
      </div>
    </>
  );
}

/* ───── Subject Icon Badge ───── */

function SubjectBadge({ subject, size = "md" }) {
  const m = meta(subject);
  const Icon = m.icon;
  const lg = size === "lg";
  return (
    <div
      className={`${lg ? "w-14 h-14 rounded-2xl" : "w-11 h-11 rounded-xl"} flex items-center justify-center flex-shrink-0`}
      style={{
        background: `linear-gradient(135deg, ${m.c[0]}25, ${m.c[1]}18)`,
        border: `1px solid ${m.c[0]}35`,
        boxShadow: `0 4px 14px ${m.c[0]}18`,
      }}
    >
      <Icon size={lg ? 24 : 18} color={m.c[0]} strokeWidth={2} />
    </div>
  );
}

/* ───── Live Indicator ───── */

function LiveBadge() {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{
        background: "rgba(34,197,94,0.12)",
        border: "1px solid rgba(34,197,94,0.28)",
      }}
    >
      <span className="relative flex h-2 w-2">
        <span
          className="absolute inline-flex h-full w-full rounded-full bg-green-400"
          style={{ animation: "livePulse 2s ease-in-out infinite" }}
        />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
      </span>
      <span className="text-green-400 text-[11px] font-bold tracking-wider">
        LIVE
      </span>
    </div>
  );
}

/* ───── Progress Bar ───── */

function ProgressBar({ value, colors }) {
  return (
    <div
      className="w-full h-[3px] rounded-full overflow-hidden"
      style={{ background: "rgba(255,255,255,0.08)" }}
    >
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
          boxShadow: `0 0 12px ${colors[0]}50`,
        }}
      />
    </div>
  );
}

/* ───── Header ───── */

function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className="px-5 pt-14 pb-3"
    >
      <p className="text-white/40 text-[13px] font-medium tracking-wide">
        {fmtDate()}
      </p>
      <h1 className="text-white text-[26px] font-bold tracking-tight mt-0.5">
        {greeting()}
      </h1>
    </motion.header>
  );
}

/* ───── Day Selector ───── */

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
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {DAYS_ORDERED.map((day) => {
            const isSel = day === selected;
            const isToday = day === today;
            return (
              <motion.button
                key={day}
                onClick={() => onSelect(day)}
                whileTap={{ scale: 0.88 }}
                className="relative flex-1 py-2.5 rounded-xl text-[13px] font-semibold z-0 cursor-pointer"
                style={{ color: isSel ? "#fff" : "rgba(255,255,255,0.35)" }}
              >
                <span className="relative z-10">{DAY_LABELS[day]}</span>

                {/* Today dot */}
                {isToday && !isSel && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400 z-10" />
                )}

                {/* Animated pill highlight */}
                {isSel && (
                  <motion.span
                    layoutId="dayPill"
                    className="absolute inset-0 rounded-xl z-0"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      boxShadow:
                        "0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
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

/* ───── Hero Card (current lesson) ───── */

function HeroCard({ lesson, index, nextLesson }) {
  const m = meta(lesson.subject);
  const prog = progress(lesson.time);
  const rem = remaining(lesson.time);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 22, delay: 0.1 }}
      className="mx-4 mb-5"
    >
      <div
        className="relative overflow-hidden rounded-[22px] p-5"
        style={{
          background: "rgba(255,255,255,0.11)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: `0 16px 48px rgba(0,0,0,0.35), 
                      0 4px 20px ${m.c[0]}12, 
                      inset 0 1px 0 rgba(255,255,255,0.12)`,
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute -top-1/2 -right-1/4 w-3/4 h-3/4 rounded-full opacity-[0.07] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${m.c[0]}, transparent 70%)`,
            filter: "blur(40px)",
          }}
        />

        {/* Top shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] opacity-30"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 50%, transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 4s linear infinite",
          }}
        />

        <div className="relative z-10">
          {/* Row 1 — lesson number + time + LIVE */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-white/35 font-medium">Урок {index + 1}</span>
              <span className="text-white/15">·</span>
              <span className="text-white/45 tabular-nums">{lesson.time}</span>
            </div>
            <LiveBadge />
          </div>

          {/* Row 2 — icon + subject + room */}
          <div className="flex items-center gap-4 mb-5">
            <SubjectBadge subject={lesson.subject} size="lg" />
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-[22px] font-bold tracking-tight truncate leading-tight">
                {lesson.subject}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin size={13} className="text-white/35 flex-shrink-0" />
                <span className="text-white/45 text-[13px]">
                  Каб. {lesson.room}
                </span>
              </div>
            </div>
          </div>

          {/* Row 3 — progress */}
          <ProgressBar value={prog} colors={m.c} />
          <div className="flex justify-between mt-2">
            <span className="text-white/25 text-[11px] tabular-nums">
              {prog}% завершено
            </span>
            <span className="text-white/35 text-[11px] flex items-center gap-1">
              <Clock size={11} />
              {rem}
            </span>
          </div>

          {/* Row 4 — up next */}
          {nextLesson && (
            <div
              className="mt-4 pt-3 flex items-center gap-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-white/25 text-[11px] font-medium">
                Далее:
              </span>
              <span className="text-white/50 text-[11px] font-semibold">
                {nextLesson.subject}
              </span>
              <span className="text-white/20 text-[11px]">
                · Каб. {nextLesson.room}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

/* ───── Lesson Card ───── */

function LessonCard({ lesson, index, st, delay }) {
  const m = meta(lesson.subject);
  const isPast = st === "past";
  const isCurrent = st === "current";

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: isPast ? 0.38 : 1, x: 0 }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 26,
        delay,
      }}
      whileTap={{ scale: 0.975 }}
      className="cursor-default"
    >
      <div
        className="rounded-2xl p-3.5 transition-colors duration-300"
        style={{
          background: isCurrent
            ? "rgba(255,255,255,0.14)"
            : "rgba(255,255,255,0.055)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          border: isCurrent
            ? "1px solid rgba(255,255,255,0.22)"
            : "1px solid rgba(255,255,255,0.1)",
          boxShadow: isCurrent
            ? `0 8px 28px rgba(0,0,0,0.25), 0 2px 10px ${m.c[0]}10, inset 0 1px 0 rgba(255,255,255,0.1)`
            : "0 2px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Lesson index */}
          <div className="w-6 flex-shrink-0 flex flex-col items-center">
            <span
              className="text-[11px] font-bold tabular-nums"
              style={{
                color: isCurrent ? m.c[0] : "rgba(255,255,255,0.2)",
              }}
            >
              {index + 1}
            </span>
          </div>

          {/* Badge */}
          <SubjectBadge subject={lesson.subject} />

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-[15px] truncate leading-snug">
              {lesson.subject}
            </h3>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-white/35 text-[12px] flex items-center gap-1 tabular-nums">
                <Clock size={11} className="opacity-60" />
                {lesson.time}
              </span>
              <span className="text-white/35 text-[12px] flex items-center gap-1">
                <MapPin size={11} className="opacity-60" />
                {lesson.room}
              </span>
            </div>
          </div>

          {/* Status dot */}
          {isCurrent && (
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60"
                style={{ animation: "livePulse 2s ease-in-out infinite" }}
              />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
            </span>
          )}
        </div>

        {/* Inline progress bar for current */}
        {isCurrent && (
          <div className="mt-3 ml-9">
            <ProgressBar value={progress(lesson.time)} colors={m.c} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ───── Empty State ───── */

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
          <Coffee size={52} strokeWidth={1.5} className="text-white/15 mx-auto" />
        </motion.div>
        <h3 className="text-white/55 text-lg font-semibold mb-1.5">Выходной!</h3>
        <p className="text-white/25 text-sm leading-relaxed">
          Никаких уроков. Отдыхай&nbsp;
          <span role="img" aria-label="party">
            🎉
          </span>
        </p>
      </div>
    </motion.div>
  );
}

/* ───── Lessons count badge ───── */

function LessonCount({ count }) {
  return (
    <span
      className="text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-md"
      style={{
        color: "rgba(255,255,255,0.35)",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {count}
    </span>
  );
}

// ═══════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════

export default function App() {
  const today = todayKey();
  const [day, setDay] = useState(today);
  const [tick, setTick] = useState(0); // force re-render for time

  /* ── Telegram WebApp integration ── */
  useEffect(() => {
    try {
      const tg = window?.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        tg.setHeaderColor("#050816");
        tg.setBackgroundColor("#050816");
        tg.disableVerticalSwipes?.();
      }
    } catch {
      /* not inside Telegram */
    }
  }, []);

  /* ── Tick every 30 s so current-lesson indicator stays fresh ── */
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const isToday = day === today;
  const lessons = SCHEDULE[day] ?? [];

  const currentIdx = useMemo(() => {
    if (!isToday || !lessons.length) return -1;
    return lessons.findIndex((l) => status(l.time, true) === "current");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isToday, lessons, tick]);

  const nextLesson = currentIdx >= 0 && currentIdx < lessons.length - 1
    ? lessons[currentIdx + 1]
    : null;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      <AuroraBackground />

      <div className="relative z-10 min-h-screen pb-20">
        <Header />

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
                {/* ── Hero for current lesson ── */}
                {isToday && currentIdx !== -1 && (
                  <HeroCard
                    lesson={lessons[currentIdx]}
                    index={currentIdx}
                    nextLesson={nextLesson}
                  />
                )}

                {/* ── Section title ── */}
                <div className="px-5 mb-3 flex items-center justify-between">
                  <h2 className="text-white/25 text-[11px] font-semibold uppercase tracking-[0.08em]">
                    {isToday && currentIdx !== -1
                      ? "Все уроки"
                      : "Расписание"}
                  </h2>
                  <LessonCount count={lessons.length} />
                </div>

                {/* ── Lesson list ── */}
                <div className="px-4 space-y-2">
                  {lessons.map((l, i) => (
                    <LessonCard
                      key={`${day}-${i}`}
                      lesson={l}
                      index={i}
                      st={status(l.time, isToday)}
                      delay={0.06 + i * 0.04}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}