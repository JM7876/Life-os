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

const STEPS = {
  WELCOME: 0,
  SERVICE_SELECT: 1,
  FORM: 2,
  REVIEW: 3,
  SUBMITTED: 4,
};

const SERVICES = [
  {
    id: 'enrollment',
    title: 'Tribal Enrollment',
    description: 'Apply for tribal enrollment or update your membership information',
    icon: '📋',
  },
  {
    id: 'housing',
    title: 'Housing Services',
    description: 'Request housing assistance, maintenance, or new housing applications',
    icon: '🏠',
  },
  {
    id: 'education',
    title: 'Education & Scholarships',
    description: 'Apply for scholarships, tutoring, or educational program funding',
    icon: '🎓',
  },
  {
    id: 'health',
    title: 'Health Services',
    description: 'Schedule appointments, request records, or access wellness programs',
    icon: '🏥',
  },
  {
    id: 'eldercare',
    title: 'Elder Care',
    description: 'Services for tribal elders including meals, transport, and activities',
    icon: '🤝',
  },
  {
    id: 'cultural',
    title: 'Cultural Programs',
    description: 'Language classes, cultural events, and heritage preservation',
    icon: '🪶',
  },
  {
    id: 'economic',
    title: 'Economic Development',
    description: 'Small business grants, employment assistance, and job training',
    icon: '💼',
  },
  {
    id: 'general',
    title: 'General Inquiry',
    description: 'Ask a question or submit a general request to tribal administration',
    icon: '📨',
  },
];

// ─── Form field definitions per service ─────────────────────────────────────

const SERVICE_FORMS = {
  enrollment: [
    { name: 'fullName', label: 'Full Legal Name', type: 'text', required: true },
    { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
    { name: 'enrollmentNumber', label: 'Enrollment Number (if known)', type: 'text', required: false },
    { name: 'address', label: 'Current Mailing Address', type: 'textarea', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'requestType', label: 'Request Type', type: 'select', required: true, options: ['New Enrollment', 'Update Information', 'Request ID Card', 'Enrollment Verification'] },
    { name: 'details', label: 'Additional Details', type: 'textarea', required: false },
  ],
  housing: [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'enrollmentNumber', label: 'Enrollment Number', type: 'text', required: true },
    { name: 'currentAddress', label: 'Current Address', type: 'textarea', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'requestType', label: 'Housing Request Type', type: 'select', required: true, options: ['New Housing Application', 'Maintenance Request', 'Emergency Repair', 'Housing Transfer'] },
    { name: 'urgency', label: 'Urgency Level', type: 'select', required: true, options: ['Low', 'Medium', 'High', 'Emergency'] },
    { name: 'description', label: 'Describe Your Request', type: 'textarea', required: true },
  ],
  education: [
    { name: 'studentName', label: 'Student Full Name', type: 'text', required: true },
    { name: 'enrollmentNumber', label: 'Enrollment Number', type: 'text', required: true },
    { name: 'institution', label: 'School/Institution Name', type: 'text', required: true },
    { name: 'gradeLevel', label: 'Grade/Year Level', type: 'text', required: true },
    { name: 'gpa', label: 'Current GPA', type: 'text', required: false },
    { name: 'programType', label: 'Program Type', type: 'select', required: true, options: ['Scholarship', 'Tutoring', 'School Supplies', 'College Prep', 'Vocational Training'] },
    { name: 'amount', label: 'Funding Amount Requested ($)', type: 'text', required: false },
    { name: 'statement', label: 'Personal Statement', type: 'textarea', required: true },
  ],
  health: [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
    { name: 'enrollmentNumber', label: 'Enrollment Number', type: 'text', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'serviceType', label: 'Service Type', type: 'select', required: true, options: ['Appointment Scheduling', 'Medical Records', 'Prescription Refill', 'Wellness Program', 'Mental Health Services'] },
    { name: 'preferredDate', label: 'Preferred Date', type: 'date', required: false },
    { name: 'notes', label: 'Additional Notes', type: 'textarea', required: false },
  ],
  eldercare: [
    { name: 'elderName', label: 'Elder Full Name', type: 'text', required: true },
    { name: 'enrollmentNumber', label: 'Enrollment Number', type: 'text', required: true },
    { name: 'contactName', label: 'Contact Person Name', type: 'text', required: true },
    { name: 'contactPhone', label: 'Contact Phone', type: 'tel', required: true },
    { name: 'serviceType', label: 'Service Needed', type: 'select', required: true, options: ['Meal Delivery', 'Transportation', 'Home Care', 'Activity Registration', 'Wellness Check'] },
    { name: 'frequency', label: 'Frequency Needed', type: 'select', required: false, options: ['One-time', 'Weekly', 'Bi-weekly', 'Monthly', 'Daily'] },
    { name: 'notes', label: 'Special Requirements', type: 'textarea', required: false },
  ],
  cultural: [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'enrollmentNumber', label: 'Enrollment Number', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'programType', label: 'Program Interest', type: 'select', required: true, options: ['Language Classes', 'Cultural Events', 'Heritage Preservation', 'Art Programs', 'Youth Culture Camp'] },
    { name: 'experience', label: 'Prior Experience', type: 'textarea', required: false },
    { name: 'availability', label: 'Availability', type: 'text', required: false },
  ],
  economic: [
    { name: 'applicantName', label: 'Applicant Name', type: 'text', required: true },
    { name: 'enrollmentNumber', label: 'Enrollment Number', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
    { name: 'businessName', label: 'Business Name (if applicable)', type: 'text', required: false },
    { name: 'requestType', label: 'Request Type', type: 'select', required: true, options: ['Small Business Grant', 'Employment Assistance', 'Job Training', 'Business Mentorship', 'Microenterprise Loan'] },
    { name: 'amount', label: 'Funding Amount Requested ($)', type: 'text', required: false },
    { name: 'proposal', label: 'Brief Proposal/Description', type: 'textarea', required: true },
  ],
  general: [
    { name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { name: 'email', label: 'Email Address', type: 'email', required: true },
    { name: 'phone', label: 'Phone Number', type: 'tel', required: false },
    { name: 'department', label: 'Department', type: 'select', required: false, options: ['Administration', 'Finance', 'Legal', 'IT', 'Other'] },
    { name: 'subject', label: 'Subject', type: 'text', required: true },
    { name: 'message', label: 'Your Message', type: 'textarea', required: true },
  ],
};

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = {
  // Root
  root: {
    minHeight: '100vh',
    background: '#0a0a0f',
    color: '#e0e0e0',
    fontFamily: 'Tahoma, "Segoe UI", Geneva, Verdana, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },

  // Background elements
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

  // Layout
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '40px 24px',
    position: 'relative',
    zIndex: 1,
  },

  // Header
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

  // Progress bar
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

  // Service cards grid
  serviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: 16,
    marginBottom: 32,
  },

  serviceCard: (selected) => ({
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.3s ease',
    transform: selected ? 'scale(1.02)' : 'scale(1)',
    boxShadow: selected ? `0 0 24px ${NHBP.turquoiseGlow}` : 'none',
  }),

  serviceCardContent: {
    padding: 24,
  },

  serviceIcon: {
    fontSize: 32,
    marginBottom: 12,
    display: 'block',
  },

  serviceTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 8,
  },

  serviceDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.5,
  },

  // Form elements
  formGroup: {
    marginBottom: 20,
  },

  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },

  requiredStar: {
    color: NHBP.red,
    marginLeft: 4,
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

  select: {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box',
  },

  // Buttons
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

  // Navigation bar
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
  },

  // Review section
  reviewSection: {
    marginBottom: 20,
  },

  reviewLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 4,
  },

  reviewValue: {
    fontSize: 15,
    color: '#fff',
  },

  // Success state
  successContainer: {
    textAlign: 'center',
    padding: '60px 20px',
  },

  successIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${NHBP.turquoise}, ${NHBP.turquoiseDark})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    fontSize: 36,
    boxShadow: `0 0 40px ${NHBP.turquoiseGlow}`,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 12,
  },

  successSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.6,
    maxWidth: 480,
    margin: '0 auto',
  },

  // Welcome screen
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

  // Mouse follow gradient
  mouseGradient: (x, y) => ({
    position: 'fixed',
    inset: 0,
    background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(20, 169, 162, 0.06), transparent 60%)`,
    pointerEvents: 'none',
    zIndex: 0,
    transition: 'background 0.3s ease',
  }),
};

// ─── Keyframe Animations ────────────────────────────────────────────────────

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
  const stepLabels = ['Welcome', 'Service', 'Form', 'Review', 'Done'];
  return (
    <div style={styles.progressContainer}>
      {stepLabels.map((label, i) => (
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

function FormField({ field, value, onChange }) {
  const [focused, setFocused] = useState(false);

  const inputStyle = {
    ...(field.type === 'textarea' ? styles.textarea : field.type === 'select' ? styles.select : styles.input),
    ...(focused ? styles.inputFocus : {}),
  };

  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>
        {field.label}
        {field.required && <span style={styles.requiredStar}>*</span>}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          style={inputStyle}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
        />
      ) : field.type === 'select' ? (
        <select
          style={inputStyle}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <option value="" style={{ background: '#1a1a2e' }}>Select...</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt} style={{ background: '#1a1a2e' }}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          style={inputStyle}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
        />
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function CompletedPortal() {
  const [step, setStep] = useState(STEPS.WELCOME);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Liquid glass engine
  const { svgDefsRef, registerPanel, rebuild } = useLiquidGlass(DARK_MODE_PARAMS);

  // Rebuild glass on step changes
  useEffect(() => {
    const timer = setTimeout(rebuild, 100);
    return () => clearTimeout(timer);
  }, [step, rebuild]);

  // Mouse follow gradient
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleServiceSelect = useCallback((serviceId) => {
    setSelectedService(serviceId);
    setFormData({});
  }, []);

  const handleFormChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleNext = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, STEPS.SUBMITTED));
  }, []);

  const handleBack = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, STEPS.WELCOME));
  }, []);

  const handleSubmit = useCallback(() => {
    // In real app, submit to API
    setStep(STEPS.SUBMITTED);
  }, []);

  const handleReset = useCallback(() => {
    setStep(STEPS.WELCOME);
    setSelectedService(null);
    setFormData({});
  }, []);

  const selectedServiceData = useMemo(
    () => SERVICES.find((s) => s.id === selectedService),
    [selectedService]
  );

  const formFields = useMemo(
    () => (selectedService ? SERVICE_FORMS[selectedService] || [] : []),
    [selectedService]
  );

  const isFormValid = useMemo(() => {
    return formFields
      .filter((f) => f.required)
      .every((f) => formData[f.name] && formData[f.name].trim() !== '');
  }, [formFields, formData]);

  // ─── Render Steps ───────────────────────────────────────────────────────

  function renderWelcome() {
    return (
      <LiquidGlassPanel
        radius={28}
        registerRef={registerPanel}
        style={{ animation: 'fadeInUp 0.6s ease forwards' }}
      >
        <div style={styles.welcomeContent}>
          <h1 style={styles.welcomeTitle}>
            Nottawaseppi Huron Band
            <br />
            <span style={{ color: NHBP.turquoise }}>Communications Portal</span>
          </h1>
          <p style={styles.welcomeDesc}>
            Welcome to the NHBP tribal services portal. Submit requests, access
            programs, and connect with your tribal government — all in one place.
          </p>
          <button
            style={styles.primaryButton}
            onClick={handleNext}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            Get Started
          </button>
        </div>
      </LiquidGlassPanel>
    );
  }

  function renderServiceSelection() {
    return (
      <div style={{ animation: 'fadeInUp 0.6s ease forwards' }}>
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
              Select a Service
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.45)',
                marginBottom: 24,
              }}
            >
              Choose the department or service area for your request
            </p>

            <div style={styles.serviceGrid}>
              {SERVICES.map((service) => (
                <SimpleGlassPanel
                  key={service.id}
                  radius={18}
                  className={selectedService === service.id ? 'selected' : ''}
                  style={styles.serviceCard(selectedService === service.id)}
                  onClick={() => handleServiceSelect(service.id)}
                >
                  <div style={styles.serviceCardContent}>
                    <span style={styles.serviceIcon}>{service.icon}</span>
                    <div style={styles.serviceTitle}>{service.title}</div>
                    <div style={styles.serviceDesc}>{service.description}</div>
                  </div>
                </SimpleGlassPanel>
              ))}
            </div>
          </div>
        </LiquidGlassPanel>

        {/* Navigation */}
        <LiquidGlassPanel
          radius={18}
          registerRef={registerPanel}
          style={{ marginTop: 16 }}
        >
          <div style={{ ...styles.navBar, padding: '16px 24px' }}>
            <button style={styles.secondaryButton} onClick={handleBack}>
              Back
            </button>
            <button
              style={{
                ...styles.primaryButton,
                opacity: selectedService ? 1 : 0.4,
                pointerEvents: selectedService ? 'auto' : 'none',
              }}
              onClick={handleNext}
            >
              Continue
            </button>
          </div>
        </LiquidGlassPanel>
      </div>
    );
  }

  function renderForm() {
    return (
      <div style={{ animation: 'fadeInUp 0.6s ease forwards' }}>
        <LiquidGlassPanel radius={24} registerRef={registerPanel}>
          <div style={{ padding: 32 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: 28 }}>{selectedServiceData?.icon}</span>
              <div>
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#fff',
                    margin: 0,
                  }}
                >
                  {selectedServiceData?.title}
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.4)',
                    margin: 0,
                  }}
                >
                  Fill in all required fields to submit your request
                </p>
              </div>
            </div>

            {formFields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={handleFormChange}
              />
            ))}
          </div>
        </LiquidGlassPanel>

        <LiquidGlassPanel
          radius={18}
          registerRef={registerPanel}
          style={{ marginTop: 16 }}
        >
          <div style={{ ...styles.navBar, padding: '16px 24px' }}>
            <button style={styles.secondaryButton} onClick={handleBack}>
              Back
            </button>
            <button
              style={{
                ...styles.primaryButton,
                opacity: isFormValid ? 1 : 0.4,
                pointerEvents: isFormValid ? 'auto' : 'none',
              }}
              onClick={handleNext}
            >
              Review Submission
            </button>
          </div>
        </LiquidGlassPanel>
      </div>
    );
  }

  function renderReview() {
    return (
      <div style={{ animation: 'fadeInUp 0.6s ease forwards' }}>
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
              Review Your Submission
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.45)',
                marginBottom: 24,
              }}
            >
              Please verify all information before submitting
            </p>

            <SimpleGlassPanel radius={14} style={{ marginBottom: 20 }}>
              <div style={{ padding: 20 }}>
                <div style={styles.reviewLabel}>Service</div>
                <div style={{ ...styles.reviewValue, color: NHBP.turquoise, fontWeight: 600 }}>
                  {selectedServiceData?.icon} {selectedServiceData?.title}
                </div>
              </div>
            </SimpleGlassPanel>

            {formFields.map((field) => {
              const val = formData[field.name];
              if (!val) return null;
              return (
                <div key={field.name} style={styles.reviewSection}>
                  <div style={styles.reviewLabel}>{field.label}</div>
                  <div style={styles.reviewValue}>{val}</div>
                </div>
              );
            })}
          </div>
        </LiquidGlassPanel>

        <LiquidGlassPanel
          radius={18}
          registerRef={registerPanel}
          style={{ marginTop: 16 }}
        >
          <div style={{ ...styles.navBar, padding: '16px 24px' }}>
            <button style={styles.secondaryButton} onClick={handleBack}>
              Edit
            </button>
            <button
              style={styles.primaryButton}
              onClick={handleSubmit}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              Submit Request
            </button>
          </div>
        </LiquidGlassPanel>
      </div>
    );
  }

  function renderSubmitted() {
    return (
      <LiquidGlassPanel
        radius={28}
        registerRef={registerPanel}
        style={{ animation: 'fadeInUp 0.6s ease forwards' }}
      >
        <div style={styles.successContainer}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>Request Submitted</h2>
          <p style={styles.successSubtitle}>
            Your {selectedServiceData?.title?.toLowerCase()} request has been
            received. You will receive a confirmation email and our team will
            follow up within 2-3 business days.
          </p>
          <div style={{ marginTop: 32 }}>
            <button
              style={styles.primaryButton}
              onClick={handleReset}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </LiquidGlassPanel>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────────────

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
          <h1 style={styles.headerTitle}>NHBP Portal</h1>
          <p style={styles.headerSubtitle}>
            Nottawaseppi Huron Band of the Potawatomi
          </p>
        </div>

        {/* Progress */}
        <ProgressBar currentStep={step} />

        {/* Step content */}
        {step === STEPS.WELCOME && renderWelcome()}
        {step === STEPS.SERVICE_SELECT && renderServiceSelection()}
        {step === STEPS.FORM && renderForm()}
        {step === STEPS.REVIEW && renderReview()}
        {step === STEPS.SUBMITTED && renderSubmitted()}
      </div>
    </div>
  );
}
