import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence, useAnimation } from 'framer-motion';
import { useAuth } from '../lib/auth-context';
import { Mail, Lock, ArrowRight, KeyRound, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import staykaroLogo from '../assets/staykaro-logo.png';

const PRIMARY = 'var(--color-primary, #1A56DB)';
const PRIMARY_LIGHT = 'var(--color-primary-light, #3B82F6)';

export function SignIn() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [lampOn, setLampOn] = useState(false);

  const cordY = useMotionValue(0);
  const springCordY = useSpring(cordY, { stiffness: 280, damping: 24 });
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const hasFired = useRef(false);
  const PULL_THRESHOLD = 52;

  const lampControls = useAnimation();

  const toggleLamp = useCallback(async () => {
    const turningOn = !lampOn;
    setLampOn(turningOn);
    await lampControls.start({
      rotate: [0, turningOn ? -7 : 7, turningOn ? 4 : -4, 0],
      transition: { duration: 0.5, ease: 'easeInOut' },
    });
  }, [lampOn, lampControls]);

  const onBdPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    isDragging.current = true;
    hasFired.current = false;
    dragStartY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onBdPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const delta = Math.max(0, e.clientY - dragStartY.current);
      cordY.set(Math.min(delta, 88));
      if (delta >= PULL_THRESHOLD && !hasFired.current) {
        hasFired.current = true;
      }
    },
    [cordY],
  );

  const onBdPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      const delta = e.clientY - dragStartY.current;
      cordY.set(0);
      if (delta >= PULL_THRESHOLD) {
        void toggleLamp();
      }
    },
    [cordY, toggleLamp],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lampOn) {
      toast.error('Turn on the lamp first', {
        description: 'Pull the cord on the lamp downward to light the room.',
      });
      return;
    }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) toast.success('Welcome back!');
    else toast.error('Invalid credentials — please try again.');
  };

  const shadeColor = lampOn ? '#c07c08' : '#2a2a38';
  const shadeInner = lampOn ? '#d9900e' : '#222230';
  const brass = lampOn
    ? 'linear-gradient(90deg,#7a5208,#c88a12,#7a5208)'
    : 'linear-gradient(90deg,#2c2c3a,#3a3a4a,#2c2c3a)';
  const baseGradient = lampOn
    ? 'linear-gradient(180deg,#8a5c0a,#5c3d08)'
    : 'linear-gradient(180deg,#2c2c3a,#1a1a24)';

  return (
    <div
      className="signin-root"
      style={{
        position: 'fixed',
        inset: 0,
        fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
        background: lampOn
          ? 'radial-gradient(ellipse 70% 50% at 22% 18%, rgba(255, 195, 55, 0.18) 0%, #0a0a10 55%)'
          : '#08080f',
        transition: 'background 0.85s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: '#fff',
      }}
    >
      <style>{`
        .signin-root * { box-sizing: border-box; }
        .signin-root input::placeholder { color: rgba(255,255,255,0.38); }
        .signin-root .cord-bead { touch-action: none; user-select: none; cursor: grab; }
        .signin-root .cord-bead:active { cursor: grabbing; }
        .signin-body { display: flex; flex: 1; min-height: 0; width: 100%; }
        @media (max-width: 900px) {
          .signin-body { flex-direction: column; }
          .signin-lamp-col { width: 100% !important; min-height: 42vh; flex: 0 0 auto; }
          .signin-form-col { width: 100% !important; flex: 1; padding: 24px 20px 32px !important; }
          .signin-divider { display: none; }
        }
      `}</style>

      {/* Brand bar — always visible */}
      <header
        style={{
          flexShrink: 0,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 24px',
          borderBottom: lampOn ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(255,255,255,0.06)',
          background: lampOn ? 'rgba(26, 86, 219, 0.12)' : 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <img src={staykaroLogo} alt="StayKaro logo" style={{ width: 54, height: 54, objectFit: 'contain', borderRadius: 8, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px', color: '#fff' }}>StayKaro Pvt Ltd</div>
          <div style={{ fontSize: 11, color: lampOn ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.45)' }}>
            Premium Student Living Platform
          </div>
        </div>
      </header>

      <div className="signin-body">
        {/* Left — lamp */}
        <div
          className="signin-lamp-col"
          style={{
            width: '46%',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 56px, rgba(255,255,255,0.004) 56px, rgba(255,255,255,0.004) 57px)',
              pointerEvents: 'none',
            }}
          />

          <AnimatePresence>
            {lampOn && (
              <motion.div
                key="cone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  translateX: '-50%',
                  width: 0,
                  height: 0,
                  borderLeft: '190px solid transparent',
                  borderRight: '190px solid transparent',
                  borderBottom: '480px solid rgba(255, 210, 60, 0.045)',
                  transformOrigin: 'top center',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {lampOn && (
              <motion.div
                key="floor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  translateX: '-50%',
                  width: 280,
                  height: 80,
                  background: 'radial-gradient(ellipse at center bottom, rgba(255, 190, 50, 0.12) 0%, transparent 72%)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
            )}
          </AnimatePresence>

          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '26%',
              right: '26%',
              height: 6,
              background:
                'linear-gradient(90deg, transparent, rgba(130,130,155,0.4) 25%, rgba(170,170,195,0.55) 50%, rgba(130,130,155,0.4) 75%, transparent)',
              borderRadius: '0 0 4px 4px',
            }}
          />

          <motion.div
            animate={lampControls}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              translateX: '-50%',
              transformOrigin: 'top center',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 3,
                height: 48,
                background: 'linear-gradient(180deg, rgba(150,150,170,0.9), rgba(100,100,120,0.45))',
                borderRadius: 2,
              }}
            />

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 86,
                  height: 12,
                  background: lampOn
                    ? 'linear-gradient(180deg, #6a4406, #a0680e)'
                    : 'linear-gradient(180deg, #252530, #1c1c28)',
                  borderRadius: '6px 6px 0 0',
                  boxShadow: lampOn ? '0 -2px 10px rgba(255, 170, 0, 0.35)' : 'none',
                  transition: 'all 0.6s ease',
                }}
              />

              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '76px solid transparent',
                  borderRight: '76px solid transparent',
                  borderBottom: `92px solid ${shadeColor}`,
                  filter: lampOn
                    ? 'drop-shadow(0 0 22px rgba(255, 175, 0, 0.85)) drop-shadow(0 0 48px rgba(255, 150, 0, 0.35))'
                    : 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))',
                  transition: 'border-bottom-color 0.65s ease, filter 0.65s ease',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: -92,
                    left: -60,
                    width: 0,
                    height: 0,
                    borderLeft: '60px solid transparent',
                    borderRight: '60px solid transparent',
                    borderBottom: `74px solid ${shadeInner}`,
                    transition: 'border-bottom-color 0.65s ease',
                  }}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: -8,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: lampOn
                    ? 'radial-gradient(circle, #fffef5 0%, #ffd54a 45%, #e65100 100%)'
                    : 'radial-gradient(circle, #3a3a48 0%, #22222e 100%)',
                  boxShadow: lampOn ? '0 0 16px 8px rgba(255, 200, 60, 0.55), 0 0 40px 18px rgba(255, 150, 0, 0.22)' : 'none',
                  transition: 'all 0.65s ease',
                  zIndex: 3,
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  top: 82,
                  right: -20,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 30,
                }}
              >
                <motion.div
                  style={{
                    width: 2,
                    height: 68,
                    background: 'linear-gradient(180deg, rgba(200,175,120,0.75), rgba(220,195,140,0.95))',
                    borderRadius: 1,
                    y: springCordY,
                    transformOrigin: 'top center',
                  }}
                />
                <motion.div
                  className="cord-bead"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: lampOn
                      ? 'radial-gradient(circle, #ffe082 0%, #b8860b 100%)'
                      : 'radial-gradient(circle, #777 0%, #3d3d3d 100%)',
                    boxShadow: lampOn ? '0 0 10px rgba(255, 200, 55, 0.7), 0 2px 8px rgba(0,0,0,0.4)' : '0 2px 6px rgba(0,0,0,0.5)',
                    border: '1.5px solid rgba(255,255,255,0.2)',
                    y: springCordY,
                    transition: 'background 0.65s ease, box-shadow 0.65s ease',
                  }}
                  onPointerDown={onBdPointerDown}
                  onPointerMove={onBdPointerMove}
                  onPointerUp={onBdPointerUp}
                  onPointerCancel={onBdPointerUp}
                />
              </div>
            </div>
          </motion.div>

          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 10,
                height: 320,
                background: brass,
                borderRadius: 5,
                boxShadow: lampOn ? '2px 0 18px rgba(255, 175, 0, 0.14)' : 'none',
                transition: 'background 0.65s ease, box-shadow 0.65s ease',
              }}
            />
            <div
              style={{
                width: 112,
                height: 18,
                background: baseGradient,
                borderRadius: '0 0 55% 55% / 0 0 12px 12px',
                boxShadow: lampOn ? '0 4px 20px rgba(255, 160, 0, 0.2), 0 8px 28px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.55)',
                transition: 'all 0.65s ease',
              }}
            />
          </div>

          {!lampOn && (
            <div
              style={{
                position: 'absolute',
                bottom: '12%',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                maxWidth: 280,
                pointerEvents: 'none',
              }}
            >
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>
                Pull the lamp cord downward to turn on the light and open sign-in.
              </p>
            </div>
          )}
        </div>

        <div
          className="signin-divider"
          style={{
            position: 'absolute',
            top: '12%',
            bottom: '10%',
            left: '46%',
            width: 1,
            background: lampOn
              ? `linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.25) 45%, rgba(255, 200, 80, 0.12) 55%, transparent)`
              : 'linear-gradient(180deg, transparent, rgba(255,255,255,0.05) 50%, transparent)',
            transition: 'background 0.7s ease',
            zIndex: 3,
          }}
        />

        {/* Right — login */}
        <div
          className="signin-form-col"
          style={{
            width: '54%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '36px 48px',
            position: 'relative',
            zIndex: 3,
          }}
        >
          <AnimatePresence mode="wait">
            {!lampOn && (
              <motion.div
                key="dark"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  padding: '48px 36px',
                  borderRadius: 24,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.72)', margin: '0 0 10px' }}>
                  The room is dark
                </p>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.48)', margin: 0, lineHeight: 1.6 }}>
                  Use the pull cord on the lamp to the left, then the sign-in panel will appear here.
                </p>
              </motion.div>
            )}

            {lampOn && (
              <motion.div
                key="lit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                style={{
                  width: '100%',
                  maxWidth: 440,
                  padding: '44px 40px',
                  borderRadius: 24,
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.28)',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  boxShadow: `
                    0 24px 64px rgba(0,0,0,0.5),
                    inset 0 1px 0 rgba(255,255,255,0.12),
                    0 0 0 1px rgba(26, 86, 219, 0.15),
                    0 0 48px -8px rgba(26, 86, 219, 0.25)
                  `,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: -1,
                    borderRadius: 24,
                    background: `linear-gradient(135deg, rgba(26,86,219,0.35), rgba(59,130,246,0.12), rgba(255,200,80,0.08))`,
                    zIndex: -1,
                    opacity: 0.9,
                  }}
                />

                <div style={{ marginBottom: 26 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <img src={staykaroLogo} alt="StayKaro logo" style={{ width: 42, height: 42, objectFit: 'contain', borderRadius: 8, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 17, color: '#fff' }}>StayKaro Pvt Ltd</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>Sign in to your workspace</div>
                    </div>
                  </div>

                  <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
                    Welcome Back
                  </h1>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5 }}>
                    Sign in to continue your learning journey
                  </p>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    marginBottom: 22,
                    background: 'linear-gradient(135deg, rgba(255, 247, 237, 0.12), rgba(255, 251, 235, 0.06))',
                    borderRadius: 14,
                    border: '1px solid rgba(251, 146, 60, 0.35)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <KeyRound size={12} style={{ color: '#fb923c' }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#fb923c', letterSpacing: '0.08em' }}>
                      DEMO CREDENTIALS
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {[
                      { role: 'Admin', email: 'admin01@gmail.com', c: PRIMARY },
                      { role: 'Student', email: 'student01@gmail.com', c: '#22c55e' },
                    ].map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.88)' }}>
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: d.c,
                            flexShrink: 0,
                            boxShadow: `0 0 8px ${d.c}`,
                          }}
                        />
                        <span>
                          <strong>{d.role}:</strong> {d.email}
                        </span>
                      </div>
                    ))}
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', marginTop: 2 }}>
                      Any password works in demo mode
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label
                      htmlFor="email"
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.65)',
                        display: 'block',
                        marginBottom: 6,
                        letterSpacing: '0.04em',
                      }}
                    >
                      EMAIL ADDRESS
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail
                        size={15}
                        style={{
                          position: 'absolute',
                          left: 14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: emailFocused ? PRIMARY_LIGHT : 'rgba(255,255,255,0.35)',
                          pointerEvents: 'none',
                          zIndex: 1,
                        }}
                      />
                      <input
                        id="email"
                        type="email"
                        placeholder="admin01@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setEmailFocused(true)}
                        onBlur={() => setEmailFocused(false)}
                        required
                        style={{
                          width: '100%',
                          height: 48,
                          paddingLeft: 40,
                          paddingRight: 14,
                          borderRadius: 12,
                          background: 'rgba(255,255,255,0.08)',
                          border: `1.5px solid ${emailFocused ? 'rgba(59, 130, 246, 0.85)' : 'rgba(255,255,255,0.14)'}`,
                          color: '#fff',
                          fontSize: 14,
                          outline: 'none',
                          boxShadow: emailFocused ? '0 0 0 3px rgba(26, 86, 219, 0.25), 0 0 20px rgba(59, 130, 246, 0.15)' : 'none',
                          transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.65)',
                        display: 'block',
                        marginBottom: 6,
                        letterSpacing: '0.04em',
                      }}
                    >
                      PASSWORD
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock
                        size={15}
                        style={{
                          position: 'absolute',
                          left: 14,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: passwordFocused ? PRIMARY_LIGHT : 'rgba(255,255,255,0.35)',
                          pointerEvents: 'none',
                          zIndex: 1,
                        }}
                      />
                      <input
                        id="password"
                        type={showPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => setPasswordFocused(false)}
                        required
                        style={{
                          width: '100%',
                          height: 48,
                          paddingLeft: 40,
                          paddingRight: 44,
                          borderRadius: 12,
                          background: 'rgba(255,255,255,0.08)',
                          border: `1.5px solid ${passwordFocused ? 'rgba(59, 130, 246, 0.85)' : 'rgba(255,255,255,0.14)'}`,
                          color: '#fff',
                          fontSize: 14,
                          outline: 'none',
                          boxShadow: passwordFocused ? '0 0 0 3px rgba(26, 86, 219, 0.25), 0 0 20px rgba(59, 130, 246, 0.15)' : 'none',
                          transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((p) => !p)}
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'rgba(255,255,255,0.45)',
                          display: 'flex',
                          padding: 4,
                        }}
                        aria-label={showPass ? 'Hide password' : 'Show password'}
                      >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                      <input type="checkbox" style={{ width: 14, height: 14, accentColor: '#1A56DB', cursor: 'pointer' }} />
                      Remember me
                    </label>
                    <a
                      href="#"
                      style={{ fontSize: 13, color: '#fb923c', textDecoration: 'none', fontWeight: 500 }}
                      onClick={(e) => e.preventDefault()}
                    >
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      height: 50,
                      borderRadius: 12,
                      background: loading ? 'rgba(26, 86, 219, 0.55)' : PRIMARY,
                      color: '#fff',
                      fontSize: 15,
                      fontWeight: 700,
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 4px 20px rgba(26, 86, 219, 0.45)',
                      marginTop: 4,
                    }}
                  >
                    {loading ? 'Signing in…' : (
                      <>
                        Sign in <ArrowRight size={17} />
                      </>
                    )}
                  </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 20, marginBottom: 0 }}>
                  Don&apos;t have an account?{' '}
                  <a href="#" style={{ color: PRIMARY_LIGHT, textDecoration: 'none', fontWeight: 600 }} onClick={(e) => e.preventDefault()}>
                    Request access
                  </a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
