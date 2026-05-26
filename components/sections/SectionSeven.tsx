"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import styles from "./section-seven.module.css";

interface Props {
  isActive: boolean;
  antonClass: string;
  fontClass: string;
}

const SERVICE_OPTIONS = ["Website", "AI System", "Content", "All three"] as const;

const STATS = [
  { label: "AVAILABILITY", value: "Open worldwide" },
  { label: "RESPONSE", value: "Within 24 hours" },
  { label: "FIRST CALL", value: "Always free" },
  { label: "BASED IN", value: "Birmingham, UK" },
];

const NAV_LINKS = [
  { label: "BOOK A FREE CALL ↗", action: "form" as const },
  { label: "SEND AN EMAIL ↗", action: "mailto" as const, href: "mailto:hello@studiofx.co" },
  { label: "INSTAGRAM ↗", action: "link" as const, href: "https://instagram.com" },
  { label: "LINKEDIN ↗", action: "link" as const, href: "https://linkedin.com" },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  isCircle: boolean;
}

export default function SectionSeven({ isActive, antonClass, fontClass }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const frameRef = useRef(0);

  const [visible, setVisible] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Website");
  const [message, setMessage] = useState("");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setVisible(true), 80);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [isActive]);

  useEffect(() => {
    document.body.style.overflow = formOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [formOpen]);

  // Physics particle system
  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = section.offsetWidth;
      canvas.height = section.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const getOrigin = () => ({
      x: canvas.width * 0.54,
      y: canvas.height * 0.38,
    });

    const spawnParticle = (): Particle => {
      const origin = getOrigin();
      const maxDist = Math.min(canvas.width, canvas.height) * 0.48;
      // Fan upward-right like the reference burst
      const angle = -Math.PI * 0.75 + Math.random() * Math.PI * 1.15;
      const dist = 30 + Math.random() * maxDist;
      const isCircle = Math.random() > 0.45;
      return {
        x: origin.x + Math.cos(angle) * dist,
        y: origin.y + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        life: 0,
        maxLife: 400 + Math.random() * 400,
        radius: isCircle ? 1.5 + Math.random() * 3.5 : 0.5,
        isCircle,
      };
    };

    particlesRef.current = [];
    for (let i = 0; i < 320; i++) {
      const p = spawnParticle();
      p.life = Math.random() * p.maxLife * 0.6;
      particlesRef.current.push(p);
    }

    const draw = () => {
      frameRef.current++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const origin = getOrigin();

      for (let i = 0; i < 4 && particlesRef.current.length < 550; i++) {
        particlesRef.current.push(spawnParticle());
      }

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const progress = p.life / p.maxLife;
        const alpha = 0.25 + (1 - Math.abs(progress - 0.5) * 2) * 0.35;

        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(12, 12, 12, ${alpha * 0.42})`;
        ctx.lineWidth = 0.35;
        ctx.stroke();

        if (p.isCircle) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(10, 10, 10, ${alpha * 0.85})`;
          ctx.fill();
        }

        if (p.life >= p.maxLife) {
          Object.assign(p, spawnParticle());
        }
      }

      const cornerX = canvas.width * 0.97;
      const cornerY = canvas.height * 0.06;
      const circleX = canvas.width * 0.685;
      const circleY = canvas.height * 0.24;

      ctx.beginPath();
      ctx.moveTo(cornerX, cornerY);
      ctx.lineTo(circleX, circleY);
      ctx.lineTo(origin.x, origin.y);
      ctx.strokeStyle = "rgba(8, 8, 8, 0.85)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      particlesRef.current = [];
    };
  }, [isActive]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting || submitted) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, service, message }),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section ref={sectionRef} className={`${styles.section} ${fontClass}`}>

        {/* Physics particle canvas */}
        <canvas ref={canvasRef} className={styles.canvas} />

        <nav
          className={fontClass}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            padding: "24px 32px",
            zIndex: 5,
          }}
        >
          {["BOOK A FREE CALL", "STUDIO FX · 2024", "WORLDWIDE"].map((label) => (
            <span
              key={label}
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "rgba(0,0,0,0.35)",
              }}
            >
              {label}
            </span>
          ))}
        </nav>

        {/* Left sidebar navigation */}
        <nav className={styles.leftNav}>
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.label}
              type="button"
              className={`${styles.navItem} ${i === activeNav ? styles.navItemActive : ""}`}
              onClick={() => {
                setActiveNav(i);
                if (link.action === "form") setFormOpen(true);
                else if (link.action === "mailto" && link.href) window.location.href = link.href;
                else if (link.action === "link" && link.href) window.open(link.href, "_blank", "noopener,noreferrer");
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Red geometric shape behind headline */}
        <div className={styles.redShape} />

        {/* Main headline — Space Grotesk bold, NOT Anton */}
        <div className={`${styles.headline} ${visible ? styles.headlineVisible : ""}`}>
          <span className={styles.headlineLine1} style={{ fontFamily: "inherit", fontWeight: 700 }}>
            Get In
          </span>
          <span className={styles.headlineLine2} style={{ fontFamily: "inherit", fontWeight: 700 }}>
            Touch.
          </span>
        </div>

        {/* Red circle button — positioned where the line leads */}
        <button
          type="button"
          className={styles.redCircle}
          onClick={() => setFormOpen(true)}
        >
          <span className={styles.redCircleText}>START<br />PROJECT</span>
        </button>

        {/* Bottom left */}
        <div className={`${styles.bottomLeft} ${visible ? styles.bottomLeftVisible : ""}`}>
          <p className={styles.bottomLeftText}>
            Tell us your vision. We&apos;ll show you exactly what&apos;s possible — and what it
            takes to make your business look like it belongs in a completely different league.
          </p>
          <button
            type="button"
            className={styles.bottomLeftLink}
            onClick={() => setFormOpen(true)}
          >
            Book a free call →
          </button>
        </div>

        {/* Bottom right stats */}
        <div className={`${styles.bottomRight} ${visible ? styles.bottomRightVisible : ""}`}>
          {STATS.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          ))}
        </div>

      </section>

      {/* Form overlay */}
      {mounted && createPortal(
        <div className={`${styles.overlay} ${fontClass} ${formOpen ? styles.overlayOpen : ""}`}>
          <button
            type="button"
            onClick={() => setFormOpen(false)}
            style={{
              position: "absolute",
              top: 32,
              right: 48,
              fontSize: 11,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
              background: "none",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.08em",
              fontFamily: "inherit",
            }}
          >
            ✕ CLOSE
          </button>

          <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 24px" }}>
            <div style={{ width: "100%", maxWidth: 560 }}>
              {submitted ? (
                <p style={{ fontSize: 14, color: "#fff", textAlign: "center" }}>
                  ✓ Received. We&apos;ll be in touch.
                </p>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", marginBottom: 48 }}>
                    START A PROJECT
                  </p>
                  <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className={styles.fieldInput} />
                  <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.fieldInput} style={{ marginTop: 8 }} />
                  <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {SERVICE_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={`${styles.pill} ${service === option ? styles.pillSelected : ""}`}
                        onClick={() => setService(option)}
                        style={{ fontSize: 12, textTransform: "uppercase", color: service === option ? "#0a0a0a" : "rgba(255,255,255,0.5)" }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  <textarea placeholder="Tell us about your project" value={message} onChange={(e) => setMessage(e.target.value)} className={styles.fieldInput} style={{ marginTop: 32, minHeight: 80, resize: "none" }} />
                  <button
                    type="submit"
                    disabled={submitting}
                    className={styles.submitBtn}
                    style={{ width: "100%", height: 52, background: "#fff", color: "#0a0a0a", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", border: "none", borderRadius: 0, marginTop: 40, cursor: submitting ? "wait" : "pointer", fontFamily: "inherit" }}
                  >
                    {submitting ? "SENDING..." : "SEND IT OVER →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
