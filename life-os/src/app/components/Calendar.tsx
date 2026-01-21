'use client';
import React, { useState, useEffect, useCallback } from 'react';

const CalendarIcons = {
  ChevronLeft: ({ className = "w-5 h-5" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 18 9 12 15 6"/></svg>),
  ChevronRight: ({ className = "w-5 h-5" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"/></svg>),
  Plus: ({ className = "w-5 h-5" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Clock: ({ className = "w-4 h-4" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
  MapPin: ({ className = "w-4 h-4" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
  X: ({ className = "w-5 h-5" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  CalendarDays: ({ className = "w-5 h-5" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>),
  Zap: ({ className = "w-4 h-4" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
  Target: ({ className = "w-4 h-4" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>),
  TrendingUp: ({ className = "w-4 h-4" }: { className?: string }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
};

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  location?: string;
  color: 'cyan' | 'violet' | 'pink' | 'emerald' | 'amber';
  type: 'meeting' | 'personal' | 'travel' | 'deadline' | 'reminder';
}

const eventColors: Record<string, string> = {
  cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

const eventDots: Record<string, string> = {
  cyan: 'bg-cyan-400',
  violet: 'bg-violet-400',
  pink: 'bg-pink-400',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
};

const eventGlows: Record<string, string> = {
  cyan: 'shadow-cyan-500/30',
  violet: 'shadow-violet-500/30',
  pink: 'shadow-pink-500/30',
  emerald: 'shadow-emerald-500/30',
  amber: 'shadow-amber-500/30',
};

// Animated counter hook
function useAnimatedCounter(target: number, duration: number = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return count;
}

// Stat card with animated counter
function StatCard({ icon: Icon, label, value, color, delay = 0 }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
  delay?: number;
}) {
  const [show, setShow] = useState(false);
  const count = useAnimatedCounter(show ? value : 0, 800);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-white/60 text-sm">{label}</span>
      </div>
      <span className={`font-bold text-lg ${color}`}>{count}</span>
    </div>
  );
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventPanel, setShowEventPanel] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Current year events for demo
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const events: CalendarEvent[] = [
    { id: '1', title: 'Team Standup', date: new Date(currentYear, currentMonth, 20), time: '9:00 AM', duration: '30 min', location: 'Zoom', color: 'cyan', type: 'meeting' },
    { id: '2', title: 'Denver Flight', date: new Date(currentYear, 2, 15), time: '2:30 PM', duration: '3h 45m', location: 'DTW → DEN', color: 'violet', type: 'travel' },
    { id: '3', title: 'Portfolio Review', date: new Date(currentYear, currentMonth, 20), time: '2:00 PM', duration: '1 hour', location: 'Studio', color: 'pink', type: 'personal' },
    { id: '4', title: 'Pay Amex Statement', date: new Date(currentYear, currentMonth, 21), time: '11:59 PM', duration: '', color: 'amber', type: 'deadline' },
    { id: '5', title: 'Boss Meeting', date: new Date(currentYear, currentMonth, 20), time: '3:00 PM', duration: '1 hour', location: 'Office', color: 'emerald', type: 'meeting' },
    { id: '6', title: 'Gym Session', date: new Date(currentYear, currentMonth, 22), time: '6:00 PM', duration: '1 hour', location: 'Fitness Center', color: 'emerald', type: 'personal' },
    { id: '7', title: 'Project Deadline', date: new Date(currentYear, currentMonth, 25), time: '5:00 PM', duration: '', color: 'pink', type: 'deadline' },
    { id: '8', title: 'Dentist', date: new Date(currentYear, currentMonth, 28), time: '3:00 PM', duration: '1 hour', location: 'Downtown Dental', color: 'cyan', type: 'personal' },
    { id: '9', title: 'Code Review', date: new Date(currentYear, currentMonth, 23), time: '10:00 AM', duration: '2 hours', location: 'Remote', color: 'violet', type: 'meeting' },
    { id: '10', title: 'Dinner Reservation', date: new Date(currentYear, currentMonth, 24), time: '7:30 PM', duration: '2 hours', location: 'The Capital Grille', color: 'pink', type: 'personal' },
  ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { daysInMonth: lastDay.getDate(), startingDay: firstDay.getDay() };
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  const isPast = (day: number) => {
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return checkDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const getEventsForDay = (day: number) => events.filter(event =>
    event.date.getDate() === day &&
    event.date.getMonth() === currentDate.getMonth() &&
    event.date.getFullYear() === currentDate.getFullYear()
  );

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setShowEventPanel(true);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  const selectedDateEvents = selectedDate ? events.filter(event =>
    event.date.getDate() === selectedDate.getDate() &&
    event.date.getMonth() === selectedDate.getMonth() &&
    event.date.getFullYear() === selectedDate.getFullYear()
  ) : [];

  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingEvents = events
    .filter(event => event.date >= today && event.date <= nextWeek)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 4);

  // Stats for current month
  const monthEvents = events.filter(e => e.date.getMonth() === currentDate.getMonth() && e.date.getFullYear() === currentDate.getFullYear());
  const meetingCount = monthEvents.filter(e => e.type === 'meeting').length;
  const deadlineCount = monthEvents.filter(e => e.type === 'deadline').length;
  const personalCount = monthEvents.filter(e => e.type === 'personal').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20">
              <CalendarIcons.CalendarDays className="w-6 h-6 text-violet-400" />
            </div>
            Calendar
          </h2>
          <p className="text-white/60 text-sm mt-1">Manage your schedule and events</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium hover:from-violet-500 hover:to-cyan-500 transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]">
          <CalendarIcons.Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Calendar Grid */}
        <div
          className="xl:col-span-3 relative group"
          onMouseMove={handleMouseMove}
        >
          {/* Apple Liquid Glass card - Official CSS specs */}
          <div
            className="relative rounded-[2rem] p-6 overflow-hidden transition-all duration-500"
            style={{
              background: `
                radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.2) 0%, transparent 50%),
                rgba(255, 255, 255, 0.15)
              `,
              backdropFilter: 'blur(2px) saturate(180%)',
              WebkitBackdropFilter: 'blur(2px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2), inset 0 4px 20px rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Shine pseudo-element effect */}
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 1), inset 0px -9px 0px -8px rgba(255, 255, 255, 1)',
                opacity: 0.6,
                filter: 'blur(1px) brightness(115%)',
              }}
            />
            {/* Top shine highlight */}
            <div className="absolute inset-x-0 top-0 h-24 rounded-t-[2rem] pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)' }} />

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <CalendarIcons.ChevronLeft />
              </button>

              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                {(currentDate.getMonth() !== today.getMonth() || currentDate.getFullYear() !== today.getFullYear()) && (
                  <button
                    onClick={goToToday}
                    className="px-3 py-1 text-xs rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 transition-all"
                  >
                    Today
                  </button>
                )}
              </div>

              <button
                onClick={nextMonth}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <CalendarIcons.ChevronRight />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3">
              {dayNames.map((day, i) => (
                <div key={day} className="text-center text-xs sm:text-sm text-white/40 font-medium py-2 uppercase tracking-wider">
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{dayNamesShort[i]}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDay }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dayEvents = getEventsForDay(day);
                const hasEvents = dayEvents.length > 0;
                const isTodayCell = isToday(day);
                const isPastDay = isPast(day);
                const isHovered = hoveredDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`
                      aspect-square rounded-2xl transition-all duration-300
                      flex flex-col items-center justify-start pt-1.5 sm:pt-2 gap-0.5 sm:gap-1
                      relative overflow-hidden group/day
                      ${isHovered && !isTodayCell ? 'scale-105 z-10' : ''}
                    `}
                    style={{
                      // Apple Liquid Glass: Official CSS recreation
                      background: isTodayCell
                        ? 'rgba(255, 255, 255, 0.25)'
                        : isPastDay
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(2px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(2px) saturate(180%)',
                      border: isTodayCell
                        ? '1px solid rgba(255,255,255,0.9)'
                        : isPastDay
                          ? '1px solid rgba(255,255,255,0.2)'
                          : '1px solid rgba(255,255,255,0.8)',
                      boxShadow: isTodayCell
                        ? '0 8px 32px rgba(31, 38, 135, 0.3), inset 0 4px 20px rgba(255, 255, 255, 0.4)'
                        : isHovered && !isPastDay
                          ? '0 8px 32px rgba(31, 38, 135, 0.25), inset 0 4px 20px rgba(255, 255, 255, 0.35)'
                          : '0 4px 16px rgba(31, 38, 135, 0.15), inset 0 2px 10px rgba(255, 255, 255, 0.2)',
                      transform: isHovered && !isTodayCell ? 'translateY(-3px) scale(1.05)' : undefined,
                    }}
                  >
                    {/* Inner shine effect */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        boxShadow: 'inset -6px -5px 0px -7px rgba(255, 255, 255, 0.8), inset 0px -6px 0px -5px rgba(255, 255, 255, 0.6)',
                        opacity: isTodayCell ? 0.9 : isPastDay ? 0.3 : 0.7
                      }}
                    />

                    <span className={`
                      text-xs sm:text-sm font-semibold transition-all duration-300
                      ${isTodayCell ? 'text-white' : isPastDay ? 'text-white/40' : 'text-white/80'}
                      ${isHovered && !isTodayCell ? 'text-white scale-110' : ''}
                    `}>
                      {day}
                    </span>

                    {/* Event dots */}
                    {hasEvents && (
                      <div className="flex gap-0.5 flex-wrap justify-center px-0.5 max-w-full">
                        {dayEvents.slice(0, 3).map((event, i) => (
                          <div
                            key={i}
                            className={`
                              w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full
                              ${eventDots[event.color]}
                              transition-all duration-300
                              ${isHovered ? 'scale-125' : ''}
                            `}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[8px] text-white/50 ml-0.5">+{dayEvents.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Hover tooltip preview */}
                    {isHovered && hasEvents && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-black/90 border border-white/10 text-[10px] text-white whitespace-nowrap z-20 hidden sm:block animate-fade-in">
                        {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Today Card - Apple Liquid Glass Official */}
          <div
            className="relative rounded-[2rem] p-6 text-center overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(2px) saturate(180%)',
              WebkitBackdropFilter: 'blur(2px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2), inset 0 4px 20px rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Shine effect */}
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 1), inset 0px -9px 0px -8px rgba(255, 255, 255, 1)',
                opacity: 0.6,
              }}
            />
            {/* Animated glow ring */}
            <div className="absolute inset-0 rounded-[2rem] animate-pulse-glow" style={{ boxShadow: '0 0 30px rgba(31, 38, 135, 0.15)' }} />

            <p className="relative text-white/60 text-xs uppercase tracking-[0.2em] font-medium">Today</p>
            <p className="relative text-6xl font-bold mt-3 mb-2 text-white drop-shadow-lg">
              {new Date().getDate()}
            </p>
            <p className="relative text-white/80 text-sm font-medium">
              {dayNames[new Date().getDay()]}, {monthNames[new Date().getMonth()]}
            </p>
            <p className="relative text-white/50 text-xs mt-1">{new Date().getFullYear()}</p>
          </div>

          {/* Upcoming Events - Apple Liquid Glass Official */}
          <div
            className="rounded-[2rem] p-5 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(2px) saturate(180%)',
              WebkitBackdropFilter: 'blur(2px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2), inset 0 4px 20px rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Shine effect */}
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 1), inset 0px -9px 0px -8px rgba(255, 255, 255, 1)',
                opacity: 0.6,
              }}
            />
            <h4 className="font-semibold mb-4 text-white/90 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              Upcoming
            </h4>
            <div className="space-y-2">
              {upcomingEvents.length > 0 ? upcomingEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`
                    p-3 rounded-xl border ${eventColors[event.color]}
                    transition-all duration-300 hover:scale-[1.02] cursor-pointer
                    hover:shadow-lg ${eventGlows[event.color]}
                    animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="font-medium text-sm">{event.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-xs opacity-80">
                    <CalendarIcons.Clock className="w-3 h-3" />
                    <span>
                      {event.date.getMonth() === today.getMonth() && event.date.getDate() === today.getDate()
                        ? 'Today'
                        : event.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {event.time}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-white/40 text-sm text-center py-4">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Monthly Stats - Apple Liquid Glass Official */}
          <div
            className="rounded-[2rem] p-5 relative overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(2px) saturate(180%)',
              WebkitBackdropFilter: 'blur(2px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.8)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2), inset 0 4px 20px rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Shine effect */}
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 1), inset 0px -9px 0px -8px rgba(255, 255, 255, 1)',
                opacity: 0.6,
              }}
            />
            <h4 className="font-semibold mb-4 text-white/90 flex items-center gap-2">
              <CalendarIcons.TrendingUp className="w-4 h-4 text-emerald-400" />
              This Month
            </h4>
            <div className="space-y-2">
              <StatCard
                icon={CalendarIcons.CalendarDays}
                label="Total Events"
                value={monthEvents.length}
                color="text-white"
                delay={0}
              />
              <StatCard
                icon={CalendarIcons.Zap}
                label="Meetings"
                value={meetingCount}
                color="text-cyan-400"
                delay={100}
              />
              <StatCard
                icon={CalendarIcons.Target}
                label="Deadlines"
                value={deadlineCount}
                color="text-amber-400"
                delay={200}
              />
            </div>

            {/* Progress bar */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/50">Month Progress</span>
                <span className="text-violet-400 font-medium">
                  {Math.round((today.getDate() / daysInMonth) * 100)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-1000 ease-out"
                  style={{
                    width: `${(today.getDate() / daysInMonth) * 100}%`,
                    animation: 'slideInWidth 1s ease-out forwards'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {showEventPanel && selectedDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={() => setShowEventPanel(false)}
        >
          <div
            className="relative w-full max-w-md animate-slide-up"
            onClick={e => e.stopPropagation()}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(2px) saturate(180%)',
              WebkitBackdropFilter: 'blur(2px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.8)',
              borderRadius: '2rem',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.2), inset 0 4px 20px rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Shine effect */}
            <div
              className="absolute inset-0 rounded-[2rem] pointer-events-none"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset -10px -8px 0px -11px rgba(255, 255, 255, 1), inset 0px -9px 0px -8px rgba(255, 255, 255, 1)',
                opacity: 0.6,
              }}
            />

            <div className="relative p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                  </h3>
                  <p className="text-white/50 text-sm">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => setShowEventPanel(false)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:rotate-90"
                >
                  <CalendarIcons.X />
                </button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1">
                {selectedDateEvents.length > 0 ? selectedDateEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className={`
                      p-4 rounded-xl border ${eventColors[event.color]}
                      transition-all duration-300 hover:scale-[1.02]
                      hover:shadow-lg ${eventGlows[event.color]}
                      animate-slide-up
                    `}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <p className="font-semibold text-white">{event.title}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm opacity-80">
                      <CalendarIcons.Clock className="w-4 h-4" />
                      <span>{event.time}{event.duration && ` • ${event.duration}`}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 mt-1.5 text-sm opacity-80">
                        <CalendarIcons.MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-white/10 flex items-center justify-center">
                      <CalendarIcons.Plus className="w-8 h-8 text-white/30" />
                    </div>
                    <p className="text-white/50 mb-4">No events scheduled</p>
                    <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 text-white border border-violet-500/30 hover:border-violet-400/50 hover:from-violet-500/30 hover:to-cyan-500/30 transition-all duration-300 hover:scale-105">
                      Add Event
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes slideInWidth {
          from { width: 0; }
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}
