'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  DARK_MODE_PARAMS,
  NHBP,
  useLiquidGlass,
  LiquidGlassSvgDefs,
  LiquidGlassPanel,
  SimpleGlassPanel,
  LightGlassPanel,
  LiquidGlassStyles,
} from './LiquidGlass';

// ─── Constants ──────────────────────────────────────────────────────────────

const BUILDER_STEPS = {
  TITLE: 0,
  DESCRIPTION: 1,
  QUESTIONS: 2,
  NOTIFICATIONS: 3,
  REVIEW: 4,
};

const QUESTION_TYPES = [
  { id: 'short_text', label: 'Short Text', icon: 'Aa', description: 'Single-line text input' },
  { id: 'long_text', label: 'Long Text', icon: '¶', description: 'Multi-line text area' },
  { id: 'single_choice', label: 'Single Choice', icon: '◉', description: 'Radio button selection' },
  { id: 'multiple_choice', label: 'Multiple Choice', icon: '☑', description: 'Checkbox selection' },
  { id: 'dropdown', label: 'Dropdown', icon: '▾', description: 'Dropdown menu selection' },
  { id: 'number', label: 'Number', icon: '#', description: 'Numeric input field' },
  { id: 'date', label: 'Date', icon: '📅', description: 'Date picker' },
  { id: 'email', label: 'Email', icon: '@', description: 'Email address field' },
  { id: 'file_upload', label: 'File Upload', icon: '📎', description: 'File attachment' },
];

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = {
  root: {
    minHeight: '100vh',
    background: '#0a0a0f',
    color: '#e0e0e0',
    fontFamily: 'Tahoma, "Segoe UI", Geneva, Verdana, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },

  gridOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(20, 169, 162, 0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(20, 169, 162, 0.015) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    zIndex: 0,
  },

  orb: (size, top, left, color, animName) => ({
    position: 'fixed',
    width: size,
    height: size,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
    top,
    left,
    animation: `${animName} 20s ease-in-out infinite`,
    pointerEvents: 'none',
    zIndex: 0,
    opacity: 0.3,
  }),

  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '40px 24px',
    position: 'relative',
    zIndex: 1,
  },

  header: {
    textAlign: 'center',
    marginBottom: 48,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },

  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 40,
  },

  progressDot: (active, completed) => ({
    width: active ? 12 : 8,
    height: active ? 12 : 8,
    borderRadius: '50%',
    background: completed
      ? NHBP.turquoise
      : active
        ? NHBP.turquoiseLight
        : 'rgba(255,255,255,0.15)',
    transition: 'all 0.3s ease',
    boxShadow: active ? `0 0 12px ${NHBP.turquoiseGlow}` : 'none',
  }),

  progressLine: (completed) => ({
    width: 40,
    height: 2,
    background: completed ? NHBP.turquoise : 'rgba(255,255,255,0.1)',
    borderRadius: 1,
    transition: 'background 0.3s ease',
  }),

  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },

  input: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  },

  inputFocus: {
    borderColor: NHBP.turquoise,
    boxShadow: `0 0 0 3px ${NHBP.turquoiseGlow}`,
  },

  textarea: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    minHeight: 100,
    resize: 'vertical',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  },

  primaryButton: {
    padding: '14px 32px',
    background: `linear-gradient(135deg, ${NHBP.turquoise}, ${NHBP.turquoiseDark})`,
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'transform 0.15s ease, box-shadow 0.3s ease',
    boxShadow: `0 4px 20px ${NHBP.turquoiseGlow}`,
    fontFamily: 'inherit',
  },

  secondaryButton: {
    padding: '14px 32px',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.7)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    fontFamily: 'inherit',
  },

  dangerButton: {
    padding: '8px 16px',
    background: 'rgba(186, 12, 47, 0.15)',
    color: NHBP.pink,
    border: `1px solid rgba(186, 12, 47, 0.3)`,
    borderRadius: 10,
    fontSize: 13,
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    fontFamily: 'inherit',
  },

  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },

  mouseGradient: (x, y) => ({
    position: 'fixed',
    inset: 0,
    background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(20, 169, 162, 0.06), transparent 60%)`,
    pointerEvents: 'none',
    zIndex: 0,
    transition: 'background 0.3s ease',
  }),

  questionCard: {
    marginBottom: 16,
    transition: 'transform 0.2s ease',
  },

  questionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  questionNumber: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${NHBP.turquoise}, ${NHBP.turquoiseDark})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
    flexShrink: 0,
  },

  questionActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },

  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: 14,
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },

  toggle: (active) => ({
    width: 44,
    height: 24,
    borderRadius: 12,
    background: active
      ? NHBP.turquoise
      : 'rgba(255,255,255,0.1)',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background 0.2s ease',
    flexShrink: 0,
    border: 'none',
  }),

  toggleKnob: (active) => ({
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: 3,
    left: active ? 23 : 3,
    transition: 'left 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
  }),

  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
    marginBottom: 16,
  },

  typeCard: (selected) => ({
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'transform 0.15s ease',
    transform: selected ? 'scale(1.03)' : 'scale(1)',
    boxShadow: selected ? `0 0 16px ${NHBP.turquoiseGlow}` : 'none',
  }),

  typeIcon: {
    fontSize: 24,
    marginBottom: 4,
    display: 'block',
    color: NHBP.turquoiseLight,
  },

  typeLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#fff',
  },

  typeDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },

  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    background: `rgba(20, 169, 162, 0.15)`,
    color: NHBP.turquoiseLight,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 600,
    marginLeft: 8,
  },

  formListItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },

  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },

  notificationRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },

  welcomeContent: {
    textAlign: 'center',
    padding: '48px 32px',
  },

  welcomeTitle: {
    fontSize: 32,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 16,
    lineHeight: 1.3,
  },

  welcomeDesc: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.7,
    maxWidth: 560,
    margin: '0 auto 32px',
  },

  ctaRow: {
    display: 'flex',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
};

// ─── Keyframes ──────────────────────────────────────────────────────────────

const KEYFRAMES = `
@keyframes float1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -40px) scale(1.05); }
  50% { transform: translate(-20px, 20px) scale(0.95); }
  75% { transform: translate(40px, 30px) scale(1.02); }
}

@keyframes float2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-40px, 30px) scale(1.08); }
  66% { transform: translate(30px, -50px) scale(0.92); }
}

@keyframes float3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  20% { transform: translate(50px, 20px) scale(0.96); }
  40% { transform: translate(-30px, -40px) scale(1.04); }
  60% { transform: translate(20px, 50px) scale(0.98); }
  80% { transform: translate(-50px, -10px) scale(1.06); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

// ─── Sub-Components ─────────────────────────────────────────────────────────

function ProgressBar({ currentStep }) {
  const labels = ['Title', 'Description', 'Questions', 'Notifications', 'Review'];
  return (
    <div style={styles.progressContainer}>
      {labels.map((label, i) => (
        <React.Fragment key={label}>
          {i > 0 && <div style={styles.progressLine(i <= currentStep)} />}
          <div
            style={styles.progressDot(i === currentStep, i < currentStep)}
            title={label}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

function Toggle({ active, onChange }) {
  return (
    <button
      style={styles.toggle(active)}
      onClick={() => onChange(!active)}
      type="button"
    >
      <div style={styles.toggleKnob(active)} />
    </button>
  );
}

function QuestionCard({ question, index, total, onUpdate, onDelete, onMoveUp, onMoveDown }) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelValue, setLabelValue] = useState(question.label);
  const [editingOptions, setEditingOptions] = useState(false);
  const [optionsValue, setOptionsValue] = useState(
    (question.options || []).join('\n')
  );

  const hasOptions = ['single_choice', 'multiple_choice', 'dropdown'].includes(
    question.type
  );

  const typeInfo = QUESTION_TYPES.find((t) => t.id === question.type);

  return (
    <SimpleGlassPanel radius={16} style={styles.questionCard}>
      <div style={{ padding: 20 }}>
        {/* Header */}
        <div style={styles.questionHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
            <div style={styles.questionNumber}>{index + 1}</div>
            <div style={{ flex: 1 }}>
              {editingLabel ? (
                <input
                  type="text"
                  style={{ ...styles.input, padding: '8px 12px', fontSize: 14 }}
                  value={labelValue}
                  onChange={(e) => setLabelValue(e.target.value)}
                  onBlur={() => {
                    setEditingLabel(false);
                    onUpdate({ ...question, label: labelValue });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setEditingLabel(false);
                      onUpdate({ ...question, label: labelValue });
                    }
                  }}
                  autoFocus
                />
              ) : (
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                  onClick={() => setEditingLabel(true)}
                >
                  {question.label || 'Untitled Question'}
                  <span
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.3)',
                      marginLeft: 8,
                    }}
                  >
                    click to edit
                  </span>
                </div>
              )}
              <div
                style={{
                  fontSize: 12,
                  color: NHBP.turquoiseLight,
                  marginTop: 4,
                }}
              >
                {typeInfo?.icon} {typeInfo?.label}
              </div>
            </div>
          </div>

          <div style={styles.questionActions}>
            <button
              style={{
                ...styles.iconButton,
                opacity: index === 0 ? 0.3 : 1,
                pointerEvents: index === 0 ? 'none' : 'auto',
              }}
              onClick={() => onMoveUp(index)}
              title="Move up"
            >
              ↑
            </button>
            <button
              style={{
                ...styles.iconButton,
                opacity: index === total - 1 ? 0.3 : 1,
                pointerEvents: index === total - 1 ? 'none' : 'auto',
              }}
              onClick={() => onMoveDown(index)}
              title="Move down"
            >
              ↓
            </button>
            <button
              style={{ ...styles.iconButton, color: NHBP.pink }}
              onClick={() => onDelete(index)}
              title="Delete"
            >
              ×
            </button>
          </div>
        </div>

        {/* Options editor for choice-type questions */}
        {hasOptions && (
          <div style={{ marginTop: 12 }}>
            {editingOptions ? (
              <div>
                <label style={{ ...styles.label, fontSize: 11 }}>
                  Options (one per line)
                </label>
                <textarea
                  style={{ ...styles.textarea, minHeight: 80, fontSize: 13 }}
                  value={optionsValue}
                  onChange={(e) => setOptionsValue(e.target.value)}
                  onBlur={() => {
                    setEditingOptions(false);
                    const opts = optionsValue
                      .split('\n')
                      .map((o) => o.trim())
                      .filter(Boolean);
                    onUpdate({ ...question, options: opts });
                  }}
                  autoFocus
                />
              </div>
            ) : (
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => setEditingOptions(true)}
              >
                {(question.options || []).length === 0 ? (
                  <span
                    style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}
                  >
                    Click to add options...
                  </span>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                    }}
                  >
                    {question.options.map((opt, i) => (
                      <span key={i} style={styles.badge}>
                        {opt}
                      </span>
                    ))}
                    <span
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.3)',
                        alignSelf: 'center',
                      }}
                    >
                      click to edit
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Required toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            Required
          </span>
          <Toggle
            active={question.required}
            onChange={(val) => onUpdate({ ...question, required: val })}
          />
        </div>
      </div>
    </SimpleGlassPanel>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function NHBPFormBuilder() {
  // ─── State ──────────────────────────────────────────────────────────────
  const [view, setView] = useState('welcome'); // 'welcome' | 'my-forms' | 'builder'
  const [step, setStep] = useState(BUILDER_STEPS.TITLE);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Form being built
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [notifications, setNotifications] = useState({
    emailOnSubmit: true,
    emailTo: '',
    sendConfirmation: false,
    confirmationMessage: '',
  });

  // Saved forms list (in-memory for demo)
  const [savedForms, setSavedForms] = useState([]);

  // Question type selector
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  // Liquid glass engine
  const { svgDefsRef, registerPanel, rebuild } = useLiquidGlass(DARK_MODE_PARAMS);

  // Rebuild on step/view changes
  useEffect(() => {
    const timer = setTimeout(rebuild, 100);
    return () => clearTimeout(timer);
  }, [step, view, rebuild]);

  // Mouse follow gradient
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────

  const handleNext = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, BUILDER_STEPS.REVIEW));
  }, []);

  const handleBack = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, BUILDER_STEPS.TITLE));
  }, []);

  const handleAddQuestion = useCallback((typeId) => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        type: typeId,
        label: '',
        required: false,
        options: [],
      },
    ]);
    setShowTypeSelector(false);
  }, []);

  const handleUpdateQuestion = useCallback((index, updated) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[index] = updated;
      return next;
    });
  }, []);

  const handleDeleteQuestion = useCallback((index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleMoveUp = useCallback((index) => {
    if (index === 0) return;
    setQuestions((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const handleMoveDown = useCallback((index) => {
    setQuestions((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const handlePublish = useCallback(() => {
    const form = {
      id: `form_${Date.now()}`,
      title: formTitle,
      description: formDescription,
      questions,
      notifications,
      createdAt: new Date().toISOString(),
      submissions: 0,
    };
    setSavedForms((prev) => [form, ...prev]);
    // Reset builder
    setFormTitle('');
    setFormDescription('');
    setQuestions([]);
    setNotifications({
      emailOnSubmit: true,
      emailTo: '',
      sendConfirmation: false,
      confirmationMessage: '',
    });
    setStep(BUILDER_STEPS.TITLE);
    setView('my-forms');
  }, [formTitle, formDescription, questions, notifications]);

  const handleNewForm = useCallback(() => {
    setFormTitle('');
    setFormDescription('');
    setQuestions([]);
    setStep(BUILDER_STEPS.TITLE);
    setView('builder');
  }, []);

  // ─── Render: Welcome Screen ───────────────────────────────────────────

  function renderWelcome() {
    return (
      <LiquidGlassPanel
        radius={28}
        registerRef={registerPanel}
        style={{ animation: 'fadeInUp 0.6s ease forwards' }}
      >
        <div style={styles.welcomeContent}>
          <h1 style={styles.welcomeTitle}>
            NHBP Form Builder
            <br />
            <span style={{ color: NHBP.turquoise }}>Create Custom Forms</span>
          </h1>
          <p style={styles.welcomeDesc}>
            Build custom forms for tribal services, surveys, and applications.
            Drag and drop questions, set notifications, and share with your team.
          </p>
          <div style={styles.ctaRow}>
            <button
              style={styles.primaryButton}
              onClick={handleNewForm}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              Create New Form
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => setView('my-forms')}
            >
              My Forms
            </button>
          </div>
        </div>
      </LiquidGlassPanel>
    );
  }

  // ─── Render: My Forms ─────────────────────────────────────────────────

  function renderMyForms() {
    return (
      <div style={{ animation: 'fadeInUp 0.6s ease forwards' }}>
        <LiquidGlassPanel radius={24} registerRef={registerPanel}>
          <div style={{ padding: 32 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                }}
              >
                My Forms
              </h2>
              <button style={styles.primaryButton} onClick={handleNewForm}>
                + New Form
              </button>
            </div>

            {savedForms.length === 0 ? (
              <div style={styles.emptyState}>
                <div
                  style={{
                    fontSize: 48,
                    marginBottom: 16,
                    opacity: 0.3,
                  }}
                >
                  📝
                </div>
                <p
                  style={{
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.4)',
                    marginBottom: 24,
                  }}
                >
                  No forms yet. Create your first form to get started.
                </p>
                <button style={styles.primaryButton} onClick={handleNewForm}>
                  Create New Form
                </button>
              </div>
            ) : (
              <div>
                {savedForms.map((form) => (
                  <SimpleGlassPanel
                    key={form.id}
                    radius={14}
                    style={{ marginBottom: 12 }}
                  >
                    <div style={styles.formListItem}>
                      <div>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: '#fff',
                          }}
                        >
                          {form.title}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: 'rgba(255,255,255,0.4)',
                            marginTop: 4,
                          }}
                        >
                          {form.questions.length} question
                          {form.questions.length !== 1 ? 's' : ''} &middot;{' '}
                          {new Date(form.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                      >
                        <span style={styles.badge}>
                          {form.submissions} submissions
                        </span>
                      </div>
                    </div>
                  </SimpleGlassPanel>
                ))}
              </div>
            )}
          </div>
        </LiquidGlassPanel>

        <LiquidGlassPanel
          radius={18}
          registerRef={registerPanel}
          style={{ marginTop: 16 }}
        >
          <div style={{ padding: '16px 24px', textAlign: 'center' }}>
            <button
              style={styles.secondaryButton}
              onClick={() => setView('welcome')}
            >
              Back to Home
            </button>
          </div>
        </LiquidGlassPanel>
      </div>
    );
  }

  // ─── Render: Builder Step - Title ─────────────────────────────────────

  function renderTitleStep() {
    return (
      <LiquidGlassPanel radius={24} registerRef={registerPanel}>
        <div style={{ padding: 32 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 8,
            }}
          >
            Form Title
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.45)',
              marginBottom: 24,
            }}
          >
            Give your form a clear, descriptive title
          </p>
          <div style={{ marginBottom: 20 }}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              style={styles.input}
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g., Housing Maintenance Request Form"
              onFocus={(e) => {
                e.target.style.borderColor = NHBP.turquoise;
                e.target.style.boxShadow = `0 0 0 3px ${NHBP.turquoiseGlow}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </LiquidGlassPanel>
    );
  }

  // ─── Render: Builder Step - Description ───────────────────────────────

  function renderDescriptionStep() {
    return (
      <LiquidGlassPanel radius={24} registerRef={registerPanel}>
        <div style={{ padding: 32 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 8,
            }}
          >
            Form Description
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.45)',
              marginBottom: 24,
            }}
          >
            Add a brief description that explains the purpose of this form
          </p>
          <div style={{ marginBottom: 20 }}>
            <label style={styles.label}>Description</label>
            <textarea
              style={styles.textarea}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Describe what this form is for and any instructions for the person filling it out..."
              onFocus={(e) => {
                e.target.style.borderColor = NHBP.turquoise;
                e.target.style.boxShadow = `0 0 0 3px ${NHBP.turquoiseGlow}`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </LiquidGlassPanel>
    );
  }

  // ─── Render: Builder Step - Questions ─────────────────────────────────

  function renderQuestionsStep() {
    return (
      <div>
        <LiquidGlassPanel radius={24} registerRef={registerPanel}>
          <div style={{ padding: 32 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#fff',
                    margin: 0,
                  }}
                >
                  Build Questions
                </h2>
                <p
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.45)',
                    margin: '4px 0 0',
                  }}
                >
                  {questions.length} question{questions.length !== 1 ? 's' : ''}{' '}
                  added
                </p>
              </div>
              <LightGlassPanel
                radius={12}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowTypeSelector(!showTypeSelector)}
              >
                <div
                  style={{
                    padding: '10px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    color: NHBP.turquoiseLight,
                  }}
                >
                  + Add Question
                </div>
              </LightGlassPanel>
            </div>

            {/* Question type selector */}
            {showTypeSelector && (
              <SimpleGlassPanel
                radius={16}
                style={{ marginBottom: 20, animation: 'fadeInUp 0.3s ease' }}
              >
                <div style={{ padding: 16 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.5)',
                      marginBottom: 12,
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                    }}
                  >
                    Choose Question Type
                  </div>
                  <div style={styles.typeGrid}>
                    {QUESTION_TYPES.map((qt) => (
                      <LightGlassPanel
                        key={qt.id}
                        radius={12}
                        style={styles.typeCard(false)}
                        onClick={() => handleAddQuestion(qt.id)}
                      >
                        <div style={{ padding: 12 }}>
                          <span style={styles.typeIcon}>{qt.icon}</span>
                          <div style={styles.typeLabel}>{qt.label}</div>
                          <div style={styles.typeDesc}>{qt.description}</div>
                        </div>
                      </LightGlassPanel>
                    ))}
                  </div>
                </div>
              </SimpleGlassPanel>
            )}

            {/* Question list */}
            {questions.length === 0 ? (
              <div style={styles.emptyState}>
                <div
                  style={{
                    fontSize: 40,
                    marginBottom: 12,
                    opacity: 0.25,
                  }}
                >
                  📝
                </div>
                <p
                  style={{
                    fontSize: 15,
                    color: 'rgba(255,255,255,0.35)',
                  }}
                >
                  No questions yet. Click &quot;Add Question&quot; to start
                  building.
                </p>
              </div>
            ) : (
              questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={i}
                  total={questions.length}
                  onUpdate={(updated) => handleUpdateQuestion(i, updated)}
                  onDelete={handleDeleteQuestion}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                />
              ))
            )}
          </div>
        </LiquidGlassPanel>
      </div>
    );
  }

  // ─── Render: Builder Step - Notifications ─────────────────────────────

  function renderNotificationsStep() {
    return (
      <LiquidGlassPanel radius={24} registerRef={registerPanel}>
        <div style={{ padding: 32 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 8,
            }}
          >
            Email Notifications
          </h2>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.45)',
              marginBottom: 24,
            }}
          >
            Configure how you want to be notified about form submissions
          </p>

          <div style={styles.notificationRow}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>
                Email on submission
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.4)',
                  marginTop: 2,
                }}
              >
                Receive an email each time someone submits this form
              </div>
            </div>
            <Toggle
              active={notifications.emailOnSubmit}
              onChange={(val) =>
                setNotifications((prev) => ({
                  ...prev,
                  emailOnSubmit: val,
                }))
              }
            />
          </div>

          {notifications.emailOnSubmit && (
            <div style={{ marginTop: 16, marginBottom: 20 }}>
              <label style={styles.label}>Notification Email</label>
              <input
                type="email"
                style={styles.input}
                value={notifications.emailTo}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    emailTo: e.target.value,
                  }))
                }
                placeholder="admin@nhbp-nsn.gov"
                onFocus={(e) => {
                  e.target.style.borderColor = NHBP.turquoise;
                  e.target.style.boxShadow = `0 0 0 3px ${NHBP.turquoiseGlow}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}

          <div style={styles.notificationRow}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>
                Send confirmation to submitter
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.4)',
                  marginTop: 2,
                }}
              >
                Send a confirmation email to the person who fills out the form
              </div>
            </div>
            <Toggle
              active={notifications.sendConfirmation}
              onChange={(val) =>
                setNotifications((prev) => ({
                  ...prev,
                  sendConfirmation: val,
                }))
              }
            />
          </div>

          {notifications.sendConfirmation && (
            <div style={{ marginTop: 16 }}>
              <label style={styles.label}>Confirmation Message</label>
              <textarea
                style={styles.textarea}
                value={notifications.confirmationMessage}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    confirmationMessage: e.target.value,
                  }))
                }
                placeholder="Thank you for your submission. We will review it and get back to you..."
                onFocus={(e) => {
                  e.target.style.borderColor = NHBP.turquoise;
                  e.target.style.boxShadow = `0 0 0 3px ${NHBP.turquoiseGlow}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          )}
        </div>
      </LiquidGlassPanel>
    );
  }

  // ─── Render: Builder Step - Review/Publish ────────────────────────────

  function renderReviewStep() {
    return (
      <div>
        <LiquidGlassPanel radius={24} registerRef={registerPanel}>
          <div style={{ padding: 32 }}>
            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 8,
              }}
            >
              Review & Publish
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.45)',
                marginBottom: 24,
              }}
            >
              Review your form before publishing
            </p>

            {/* Form summary */}
            <SimpleGlassPanel radius={14} style={{ marginBottom: 16 }}>
              <div style={{ padding: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 4,
                  }}
                >
                  Form Title
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {formTitle || '(Untitled Form)'}
                </div>
              </div>
            </SimpleGlassPanel>

            {formDescription && (
              <SimpleGlassPanel radius={14} style={{ marginBottom: 16 }}>
                <div style={{ padding: 20 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.4)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 4,
                    }}
                  >
                    Description
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.6,
                    }}
                  >
                    {formDescription}
                  </div>
                </div>
              </SimpleGlassPanel>
            )}

            <SimpleGlassPanel radius={14} style={{ marginBottom: 16 }}>
              <div style={{ padding: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 12,
                  }}
                >
                  Questions ({questions.length})
                </div>
                {questions.map((q, i) => {
                  const typeInfo = QUESTION_TYPES.find((t) => t.id === q.type);
                  return (
                    <div
                      key={q.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 0',
                        borderBottom:
                          i < questions.length - 1
                            ? '1px solid rgba(255,255,255,0.04)'
                            : 'none',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: NHBP.turquoise,
                          fontWeight: 600,
                          width: 24,
                        }}
                      >
                        {i + 1}.
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          color: '#fff',
                          flex: 1,
                        }}
                      >
                        {q.label || 'Untitled Question'}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: 'rgba(255,255,255,0.35)',
                        }}
                      >
                        {typeInfo?.label}
                      </span>
                      {q.required && (
                        <span
                          style={{
                            fontSize: 10,
                            color: NHBP.red,
                            fontWeight: 700,
                          }}
                        >
                          REQ
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </SimpleGlassPanel>

            <SimpleGlassPanel radius={14}>
              <div style={{ padding: 20 }}>
                <div
                  style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 8,
                  }}
                >
                  Notifications
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  {notifications.emailOnSubmit
                    ? `Email notifications to ${notifications.emailTo || '(not set)'}`
                    : 'Email notifications disabled'}
                </div>
                {notifications.sendConfirmation && (
                  <div
                    style={{
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.4)',
                      marginTop: 4,
                    }}
                  >
                    Confirmation emails enabled
                  </div>
                )}
              </div>
            </SimpleGlassPanel>
          </div>
        </LiquidGlassPanel>
      </div>
    );
  }

  // ─── Render: Builder Navigation ───────────────────────────────────────

  function renderBuilderNav() {
    const isLastStep = step === BUILDER_STEPS.REVIEW;
    const canProceed =
      step === BUILDER_STEPS.TITLE
        ? formTitle.trim().length > 0
        : step === BUILDER_STEPS.QUESTIONS
          ? questions.length > 0
          : true;

    return (
      <LiquidGlassPanel
        radius={18}
        registerRef={registerPanel}
        style={{ marginTop: 16 }}
      >
        <div style={{ ...styles.navBar, padding: '16px 24px' }}>
          <button
            style={styles.secondaryButton}
            onClick={
              step === BUILDER_STEPS.TITLE
                ? () => setView('welcome')
                : handleBack
            }
          >
            {step === BUILDER_STEPS.TITLE ? 'Cancel' : 'Back'}
          </button>
          <button
            style={{
              ...styles.primaryButton,
              opacity: canProceed ? 1 : 0.4,
              pointerEvents: canProceed ? 'auto' : 'none',
            }}
            onClick={isLastStep ? handlePublish : handleNext}
            onMouseEnter={(e) => {
              if (canProceed) e.target.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            {isLastStep ? 'Publish Form' : 'Continue'}
          </button>
        </div>
      </LiquidGlassPanel>
    );
  }

  // ─── Render: Builder View ─────────────────────────────────────────────

  function renderBuilder() {
    return (
      <div style={{ animation: 'fadeInUp 0.6s ease forwards' }}>
        <ProgressBar currentStep={step} />

        {step === BUILDER_STEPS.TITLE && renderTitleStep()}
        {step === BUILDER_STEPS.DESCRIPTION && renderDescriptionStep()}
        {step === BUILDER_STEPS.QUESTIONS && renderQuestionsStep()}
        {step === BUILDER_STEPS.NOTIFICATIONS && renderNotificationsStep()}
        {step === BUILDER_STEPS.REVIEW && renderReviewStep()}

        {renderBuilderNav()}
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────────

  return (
    <div style={styles.root}>
      {/* Injected styles */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <LiquidGlassStyles />

      {/* SVG filter defs (hidden) */}
      <LiquidGlassSvgDefs svgDefsRef={svgDefsRef} />

      {/* Mouse follow gradient */}
      <div style={styles.mouseGradient(mousePos.x, mousePos.y)} />

      {/* Grid overlay */}
      <div style={styles.gridOverlay} />

      {/* Floating orbs */}
      <div
        style={styles.orb(
          400,
          '10%',
          '70%',
          NHBP.turquoiseGlow,
          'float1'
        )}
      />
      <div
        style={styles.orb(
          300,
          '60%',
          '10%',
          'rgba(95, 12, 14, 0.15)',
          'float2'
        )}
      />
      <div
        style={styles.orb(
          250,
          '40%',
          '50%',
          'rgba(186, 12, 47, 0.08)',
          'float3'
        )}
      />

      {/* Main content */}
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>NHBP Form Builder</h1>
          <p style={styles.headerSubtitle}>
            Nottawaseppi Huron Band of the Potawatomi
          </p>
        </div>

        {/* View content */}
        {view === 'welcome' && renderWelcome()}
        {view === 'my-forms' && renderMyForms()}
        {view === 'builder' && renderBuilder()}
      </div>
    </div>
  );
}
