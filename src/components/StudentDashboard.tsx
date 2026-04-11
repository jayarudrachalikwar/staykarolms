import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import {
  Trophy, Clock, CheckCircle2, TrendingUp, ArrowRight, Calendar,
  Code, Users, Flame, Star, BookOpen, Zap, Award, ChevronRight,
  Target, Play,
} from 'lucide-react';
import { problems, courses, batches, assessments } from '../lib/data';
import { toast } from 'sonner';

interface StudentDashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

// ── Micro-animation keyframes injected once ──────────────────────────────────
const injectedStyle = typeof document !== 'undefined' && (() => {
  const id = 'trailbliz-dash-anims';
  if (document.getElementById(id)) return true;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = `
    @keyframes tb-fade-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes tb-pulse-ring { 0%,100%{box-shadow:0 0 0 0 rgba(26,86,219,0.25)} 50%{box-shadow:0 0 0 8px rgba(26,86,219,0)} }
    @keyframes tb-shimmer { from{background-position:-200% 0} to{background-position:200% 0} }
    .tb-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
    .tb-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(26,86,219,0.12); }
    .tb-stat { animation: tb-fade-up 0.5s ease both; }
    .tb-stat:nth-child(1){animation-delay:.05s}
    .tb-stat:nth-child(2){animation-delay:.1s}
    .tb-stat:nth-child(3){animation-delay:.15s}
    .tb-stat:nth-child(4){animation-delay:.2s}
    .tb-main { animation: tb-fade-up 0.5s ease 0.25s both; }
    .tb-sidebar { animation: tb-fade-up 0.5s ease 0.35s both; }
  `;
  document.head.appendChild(s);
  return true;
})();

const BLUE = '#1A56DB';
const BLUE_LIGHT = '#EBF2FF';
const BLUE_MID = '#3B82F6';

export function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const [sessionDetailsOpen, setSessionDetailsOpen] = useState(false);

  // ── Data (same as before) ──────────────────────────────────────────────────
  const studentProgress = 65;
  const currentStreak = 7;
  const solvedProblems = 23;
  const totalPoints = 1850;

  const recentSubmissions = [
    { id: 'sub-1', problemTitle: 'Two Sum', status: 'accepted', points: 100, time: '2 hours ago' },
    { id: 'sub-2', problemTitle: 'Valid Parentheses', status: 'accepted', points: 120, time: '1 day ago' },
    { id: 'sub-3', problemTitle: 'Merge Intervals', status: 'wrong_answer', points: 0, time: '2 days ago' },
  ];

  const upcomingSession = {
    title: 'Advanced Algorithms — Trees & Graphs',
    date: 'Monday, Oct 20, 2025',
    time: '6:00 PM – 8:00 PM',
    instructor: 'Dr. Sarah Johnson',
  };

  const recommendedProblems = problems.slice(0, 3);
  const studentAssessments = assessments.filter(a => a.batchId === 'batch-1');

  const diffColor = (d: string) =>
    d === 'easy' ? '#10B981' : d === 'medium' ? '#F59E0B' : '#EF4444';

  // ── Stat cards ──────────────────────────────────────────────────────────────
  const stats = [
    {
      label: 'Course Progress',
      value: `${studentProgress}%`,
      sub: '+5% this week',
      icon: TrendingUp,
      color: BLUE,
      bg: BLUE_LIGHT,
      progress: studentProgress,
    },
    {
      label: 'Problems Solved',
      value: solvedProblems,
      sub: '+3 this week',
      icon: CheckCircle2,
      color: '#10B981',
      bg: 'rgba(16,185,129,0.1)',
    },
    {
      label: 'Current Streak',
      value: `${currentStreak} days`,
      sub: 'Keep it going! 🔥',
      icon: Flame,
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.1)',
    },
    {
      label: 'Total Points',
      value: totalPoints.toLocaleString(),
      sub: 'Rank #12',
      icon: Trophy,
      color: BLUE_MID,
      bg: 'rgba(59,130,246,0.1)',
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 pb-8">

      {/* ── Hero Header ──────────────────────────────────────────────────────── */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_MID} 60%, #60A5FA 100%)`,
          borderRadius: 20,
          padding: '28px 28px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* decorative blobs */}
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 80, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 4, letterSpacing: '0.02em' }}>
                Welcome back 👋
              </p>
              <h1 style={{ color: '#fff', fontSize: 'clamp(18px, 3vw, 26px)', fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
                Emma Wilson
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 5 }}>
                Let's conquer <strong style={{ color: '#fff' }}>Backend Development</strong> today!
              </p>
            </div>

            {/* Progress ring */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 68, height: 68, borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                border: '3px solid rgba(255,255,255,0.3)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(6px)',
              }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>{studentProgress}%</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>Done</span>
              </div>
            </div>
          </div>

          {/* Quick action chips */}
          <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Practice Now', icon: Code, page: 'code-practice' },
              { label: 'View Problems', icon: Target, page: 'problems' },
              { label: 'Leaderboard', icon: Trophy, page: 'leaderboard' },
            ].map(({ label, icon: Icon, page }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff', borderRadius: 40,
                  padding: '6px 14px', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', backdropFilter: 'blur(4px)',
                  transition: 'background 0.15s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              >
                <Icon size={13} />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="tb-card tb-stat"
            style={{
              background: '#fff',
              borderRadius: 16,
              padding: '16px',
              border: '1px solid #e8edf5',
              boxShadow: '0 2px 8px rgba(26,86,219,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginBottom: 4 }}>{s.label}</p>
                <p style={{ fontSize: 'clamp(18px,3vw,24px)', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>{s.value}</p>
              </div>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={20} color={s.color} />
              </div>
            </div>
            {s.progress !== undefined && (
              <div style={{ marginTop: 10 }}>
                <div style={{ height: 5, background: '#E8EDF5', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.progress}%`, background: `linear-gradient(90deg, ${BLUE}, ${BLUE_MID})`, borderRadius: 10, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            )}
            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: s.progress !== undefined ? 6 : 8 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main Layout ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5 tb-main">

          {/* Upcoming Live Session */}
          <div
            className="tb-card"
            style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf5', boxShadow: '0 2px 8px rgba(26,86,219,0.06)', overflow: 'hidden' }}
          >
            {/* coloured top strip */}
            <div style={{ height: 4, background: `linear-gradient(90deg, ${BLUE}, ${BLUE_MID})` }} />

            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', animation: 'tb-pulse-ring 2s infinite' }} />
                  <span style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Upcoming Live Session</span>
                </div>
                <span style={{
                  background: 'rgba(239,68,68,0.1)', color: '#EF4444',
                  borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600,
                }}>In 2 days</span>
              </div>

              <h4 style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 10 }}>{upcomingSession.title}</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { icon: Calendar, text: upcomingSession.date },
                  { icon: Clock, text: upcomingSession.time },
                  { icon: Users, text: `Instructor: ${upcomingSession.instructor}` },
                ].map(({ icon: Icon, text }, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6B7280', fontSize: 13 }}>
                    <Icon size={14} color={BLUE} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button
                  style={{
                    background: `linear-gradient(135deg,${BLUE},${BLUE_MID})`,
                    color: '#fff', border: 'none', borderRadius: 10,
                    padding: '9px 18px', fontSize: 13, fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(26,86,219,0.28)',
                  }}
                  onClick={() => {
                    toast.success('Joining session... Please wait');
                    setTimeout(() => toast.info('Live session will start in 2 days'), 1000);
                  }}
                >
                  <Play size={13} /> Join Session
                </button>
                <button
                  style={{
                    background: '#F8FAFF', color: BLUE,
                    border: `1.5px solid ${BLUE_LIGHT}`, borderRadius: 10,
                    padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                  onClick={() => setSessionDetailsOpen(true)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Recent Submissions */}
          <div
            className="tb-card"
            style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf5', boxShadow: '0 2px 8px rgba(26,86,219,0.06)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 0' }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Recent Submissions</span>
              <button
                style={{ display: 'flex', alignItems: 'center', gap: 4, color: BLUE, fontSize: 12, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => onNavigate('problems')}
              >
                View All <ArrowRight size={13} />
              </button>
            </div>
            <div style={{ padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 12,
                    border: '1px solid #E8EDF5', background: '#FAFBFF',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.borderColor = BLUE)}
                  onMouseOut={e => (e.currentTarget.style.borderColor = '#E8EDF5')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Code size={15} color={BLUE} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.problemTitle}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{sub.time}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 8 }}>
                    {sub.status === 'accepted' ? (
                      <>
                        <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle2 size={11} /> Accepted
                        </span>
                        <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>+{sub.points}pts</span>
                      </>
                    ) : (
                      <span style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600 }}>
                        Wrong
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Problems */}
          <div
            className="tb-card"
            style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf5', boxShadow: '0 2px 8px rgba(26,86,219,0.06)' }}
          >
            <div style={{ padding: '16px 20px 0' }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Recommended for You</p>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Based on your progress and learning path</p>
            </div>
            <div style={{ padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recommendedProblems.map((problem) => (
                <div
                  key={problem.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px', borderRadius: 12,
                    border: '1px solid #E8EDF5', background: '#FAFBFF',
                    cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
                  }}
                  onClick={() => onNavigate('problem', problem)}
                  onMouseOver={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.background = '#F0F5FF'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = '#E8EDF5'; e.currentTarget.style.background = '#FAFBFF'; }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{problem.title}</p>
                      <span style={{
                        background: `rgba(${problem.difficulty === 'easy' ? '16,185,129' : problem.difficulty === 'medium' ? '245,158,11' : '239,68,68'},0.1)`,
                        color: diffColor(problem.difficulty),
                        borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700, textTransform: 'capitalize',
                      }}>
                        {problem.difficulty}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                      {problem.tags.slice(0, 2).map(tag => (
                        <span key={tag} style={{ background: '#EBF2FF', color: BLUE, borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>{problem.points}pts</span>
                    <ArrowRight size={14} color={BLUE} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assessments */}
          {studentAssessments.length > 0 && (
            <div
              className="tb-card"
              style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf5', boxShadow: '0 2px 8px rgba(26,86,219,0.06)' }}
            >
              <div style={{ padding: '16px 20px 0' }}>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>Upcoming Assessments</p>
                <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Tests and assessments for your batch</p>
              </div>
              <div style={{ padding: '12px 20px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {studentAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    style={{
                      padding: '14px', borderRadius: 12,
                      border: '1px solid #E8EDF5', background: '#FAFBFF',
                      cursor: 'pointer', transition: 'border-color 0.15s',
                    }}
                    onClick={() => toast.info('Assessment feature coming soon!')}
                    onMouseOver={e => (e.currentTarget.style.borderColor = BLUE)}
                    onMouseOut={e => (e.currentTarget.style.borderColor = '#E8EDF5')}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{assessment.name}</p>
                          <span style={{
                            background: assessment.status === 'published' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                            color: assessment.status === 'published' ? '#10B981' : '#F59E0B',
                            borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 700, textTransform: 'capitalize',
                          }}>{assessment.status}</span>
                        </div>
                        <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>{assessment.description}</p>
                        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                          {[`${assessment.duration} mins`, `${assessment.totalMarks} marks`, `${assessment.questions.length} questions`].map(t => (
                            <span key={t} style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight size={16} color={BLUE} style={{ flexShrink: 0, marginTop: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ────────────────────────────────────────────────────────── */}
        <div className="space-y-4 sm:space-y-5 tb-sidebar">

          {/* Current Batch */}
          <div
            className="tb-card"
            style={{
              background: '#fff', borderRadius: 16, border: '1px solid #e8edf5',
              boxShadow: '0 2px 8px rgba(26,86,219,0.06)', padding: '0', overflow: 'hidden', cursor: 'pointer',
            }}
            onClick={() => onNavigate('problems')}
          >
            <div style={{ background: `linear-gradient(135deg,${BLUE},${BLUE_MID})`, padding: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Batch</p>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginTop: 4, position: 'relative' }}>{batches[0].name}</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 }}>{courses[0].title}</p>
            </div>
            <div style={{ padding: '14px 16px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#6B7280' }}>Progress</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: BLUE }}>{studentProgress}%</span>
              </div>
              <div style={{ height: 6, background: '#E8EDF5', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${studentProgress}%`, background: `linear-gradient(90deg,${BLUE},${BLUE_MID})`, borderRadius: 10, transition: 'width 0.6s ease' }} />
              </div>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { icon: Calendar, text: batches[0].schedule },
                  { icon: Users, text: `${batches[0].students} students` },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' }}>
                    <Icon size={13} color={BLUE} /> {text}
                  </div>
                ))}
              </div>
              <button
                style={{
                  marginTop: 14, width: '100%', background: `linear-gradient(135deg,${BLUE},${BLUE_MID})`,
                  color: '#fff', border: 'none', borderRadius: 10,
                  padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: '0 4px 12px rgba(26,86,219,0.25)',
                }}
              >
                View Problems <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Quick actions (mobile) */}
          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {[
              { label: 'Leaderboard', icon: Trophy, color: BLUE, bg: BLUE_LIGHT, page: 'leaderboard' },
              { label: 'Practice', icon: Code, color: BLUE_MID, bg: 'rgba(59,130,246,0.1)', page: 'code-practice' },
            ].map(({ label, icon: Icon, color, bg, page }) => (
              <div
                key={page}
                className="tb-card"
                style={{
                  background: '#fff', borderRadius: 14, border: '1px solid #E8EDF5',
                  padding: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 8, cursor: 'pointer', boxShadow: '0 2px 8px rgba(26,86,219,0.06)',
                }}
                onClick={() => onNavigate(page)}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={color} />
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Leaderboard card (desktop) */}
          <div
            className="tb-card hidden sm:block"
            style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf5', boxShadow: '0 2px 8px rgba(26,86,219,0.06)', padding: '16px 18px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: BLUE_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={18} color={BLUE} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>Leaderboard</p>
                <p style={{ fontSize: 11, color: '#9CA3AF' }}>See how you rank</p>
              </div>
            </div>

            {/* Rank teaser */}
            {[
              { rank: 1, name: 'Alex Chen', pts: 2840 },
              { rank: 2, name: 'Priya Nair', pts: 2650 },
              { rank: 12, name: 'You (Emma)', pts: totalPoints, highlight: true },
            ].map(({ rank, name, pts, highlight }) => (
              <div key={rank} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '7px 10px', borderRadius: 10, marginBottom: 4,
                background: highlight ? BLUE_LIGHT : '#FAFBFF',
                border: `1px solid ${highlight ? '#C3D9FF' : '#E8EDF5'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: rank === 1 ? '#F59E0B' : rank === 2 ? '#9CA3AF' : BLUE, width: 18 }}>#{rank}</span>
                  <span style={{ fontSize: 12, fontWeight: highlight ? 700 : 500, color: highlight ? BLUE : '#374151' }}>{name}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: highlight ? BLUE : '#6B7280' }}>{pts.toLocaleString()}</span>
              </div>
            ))}

            <button
              style={{
                marginTop: 10, width: '100%', background: '#F0F5FF',
                color: BLUE, border: `1.5px solid ${BLUE_LIGHT}`, borderRadius: 10,
                padding: '9px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
              onClick={() => onNavigate('leaderboard')}
            >
              Full Leaderboard <ArrowRight size={13} />
            </button>
          </div>

          {/* Monaco / Practice (desktop) */}
          <div
            className="tb-card hidden sm:block"
            style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf5', boxShadow: '0 2px 8px rgba(26,86,219,0.06)', padding: '16px 18px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} color={BLUE_MID} />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>Code Practice</p>
                <p style={{ fontSize: 11, color: '#9CA3AF' }}>Monaco Editor</p>
              </div>
            </div>
            <button
              style={{
                width: '100%', background: `linear-gradient(135deg,${BLUE},${BLUE_MID})`,
                color: '#fff', border: 'none', borderRadius: 10,
                padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: '0 4px 12px rgba(26,86,219,0.25)',
              }}
              onClick={() => onNavigate('code-practice')}
            >
              <Play size={13} /> Start Practicing
            </button>
          </div>

          {/* Recent Activity */}
          <div
            className="tb-card"
            style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8edf5', boxShadow: '0 2px 8px rgba(26,86,219,0.06)', padding: '16px 18px' }}
          >
            <p style={{ fontWeight: 700, fontSize: 14, color: '#0F172A', marginBottom: 14 }}>Recent Activity</p>
            {[
              { icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.1)', text: (<>Solved <strong>Two Sum</strong></>), time: '2 hours ago' },
              { icon: Award, color: BLUE, bg: BLUE_LIGHT, text: (<>Earned <strong>Speed Solver</strong> badge</>), time: '1 day ago' },
              { icon: BookOpen, color: BLUE_MID, bg: 'rgba(59,130,246,0.1)', text: (<>Joined discussion on <strong>Binary Search</strong></>), time: '2 days ago' },
            ].map(({ icon: Icon, color, bg, text, time }, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < 2 ? 12 : 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={14} color={color} />
                </div>
                <div>
                  <p style={{ fontSize: 12, color: '#374151' }}>{text}</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{time}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── Session Details Dialog ──────────────────────────────────────────── */}
      <Dialog open={sessionDetailsOpen} onOpenChange={setSessionDetailsOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
            <DialogDescription>Upcoming live session information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div style={{ padding: '14px', background: '#F0F5FF', borderRadius: 12, border: '1px solid #C3D9FF' }}>
              <h4 style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{upcomingSession.title}</h4>
              <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { icon: Calendar, text: upcomingSession.date },
                  { icon: Clock, text: upcomingSession.time },
                  { icon: Users, text: `Instructor: ${upcomingSession.instructor}` },
                ].map(({ icon: Icon, text }, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151' }}>
                    <Icon size={14} color={BLUE} /> {text}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 6 }}>Topics Covered</h5>
              <ul style={{ paddingLeft: 16, color: '#6B7280', fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <li>Binary Trees & Binary Search Trees</li>
                <li>Tree Traversals (DFS, BFS)</li>
                <li>Graph Representations</li>
                <li>Graph Algorithms Introduction</li>
              </ul>
            </div>
            <div>
              <h5 style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', marginBottom: 6 }}>Prerequisites</h5>
              <p style={{ fontSize: 13, color: '#6B7280' }}>Complete "Introduction to Trees" module before the session.</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                style={{
                  flex: 1, background: `linear-gradient(135deg,${BLUE},${BLUE_MID})`, color: '#fff',
                  border: 'none', borderRadius: 10, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}
                onClick={() => { toast.success('Added to calendar'); setSessionDetailsOpen(false); }}
              >
                Add to Calendar
              </button>
              <button
                style={{
                  padding: '10px 16px', background: '#F8FAFF', color: BLUE,
                  border: `1.5px solid ${BLUE_LIGHT}`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
                onClick={() => setSessionDetailsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}