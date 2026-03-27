import "./style.css";
import heroImage from "./hero-new.jpg";
import thangminhImg from "./thangminh.png";
import giangImg from "./giang.jpg";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// ─── SHOOTING STARS ──────────────────────────────────────────────────────────
function ShootingStars() {
  const canvasRef = useRef(null);
  const meteorsRef = useRef([]);
  const animFrameRef = useRef(0);

  const createMeteor = useCallback((w, h, delay = 0) => {
    const fromLeft = Math.random() > 0.3;
    const angle = fromLeft
      ? Math.PI / 6 + Math.random() * (Math.PI / 6)
      : (Math.PI * 5) / 6 - Math.random() * (Math.PI / 6);
    const startX = fromLeft
      ? -100 + Math.random() * w * 0.3
      : w * 0.7 + Math.random() * w * 0.3 + 100;
    const startY = -100 + Math.random() * h * 0.2;
    return {
      x: startX, y: startY, angle,
      speed: 1.2 + Math.random() * 1.5,
      length: 180 + Math.random() * 220,
      headSize: 4 + Math.random() * 4,
      progress: 0, opacity: 0,
      trail: [], particles: [],
      active: false, delay,
      hueShift: Math.random() * 20 - 10,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const handleResize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener("resize", handleResize);

    meteorsRef.current = [
      createMeteor(w, h, 0),
      createMeteor(w, h, 4000),
      createMeteor(w, h, 9000),
    ];

    let lastTime = performance.now();
    let elapsed = 0;

    const drawGlow = (x, y, radius, opacity, hue) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
      g.addColorStop(0, `hsla(${200 + hue},80%,95%,${opacity * 0.9})`);
      g.addColorStop(0.2, `hsla(${200 + hue},75%,85%,${opacity * 0.5})`);
      g.addColorStop(0.5, `hsla(${207 + hue},68%,72%,${opacity * 0.2})`);
      g.addColorStop(1, `hsla(${207 + hue},68%,72%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawTail = (m) => {
      if (m.trail.length < 2) return;
      for (let layer = 0; layer < 3; layer++) {
        const widths = [8, 4, 1.5];
        const alphas = [0.15, 0.3, 0.7];
        ctx.beginPath();
        ctx.moveTo(m.trail[0].x, m.trail[0].y);
        for (let i = 1; i < m.trail.length; i++) {
          const p = m.trail[i];
          const prev = m.trail[i - 1];
          ctx.quadraticCurveTo(prev.x, prev.y, (prev.x + p.x) / 2, (prev.y + p.y) / 2);
        }
        ctx.strokeStyle = layer === 2
          ? `hsla(${200 + m.hueShift},80%,97%,${m.opacity * alphas[layer]})`
          : `hsla(${207 + m.hueShift},68%,${layer === 0 ? 72 : 82}%,${m.opacity * alphas[layer]})`;
        ctx.lineWidth = widths[layer];
        ctx.lineCap = "round";
        ctx.stroke();
      }
    };

    const animate = (time) => {
      const dt = Math.min(time - lastTime, 50);
      lastTime = time;
      elapsed += dt;
      ctx.clearRect(0, 0, w, h);

      meteorsRef.current.forEach((m, idx) => {
        if (!m.active) { m.delay -= dt; if (m.delay <= 0) { m.active = true; m.opacity = 0; } return; }
        if (m.opacity < 1) m.opacity = Math.min(1, m.opacity + dt * 0.003);
        const dx = Math.cos(m.angle) * m.speed * (dt * 0.06);
        const dy = Math.sin(m.angle) * m.speed * (dt * 0.06);
        m.x += dx; m.y += dy;
        m.trail.push({ x: m.x, y: m.y, opacity: 1 });
        if (m.trail.length > 120) m.trail.shift();
        m.trail.forEach((t, i) => { t.opacity = (i / m.trail.length) * m.opacity; });

        if (Math.random() < 0.4) {
          m.particles.push({
            x: m.x + (Math.random() - 0.5) * 12, y: m.y + (Math.random() - 0.5) * 12,
            size: 1 + Math.random() * 2.5, opacity: 0.5 + Math.random() * 0.5,
            decay: 0.008 + Math.random() * 0.015,
            vx: (Math.random() - 0.5) * 0.5 - dx * 0.2,
            vy: (Math.random() - 0.5) * 0.5 - dy * 0.2 + 0.1,
            hue: m.hueShift + Math.random() * 15,
          });
        }
        m.particles.forEach((p) => { p.x += p.vx; p.y += p.vy; p.opacity -= p.decay; p.size *= 0.995; });
        m.particles = m.particles.filter((p) => p.opacity > 0.01);

        drawGlow(m.x, m.y, 80 + m.headSize * 6, m.opacity * 0.12, m.hueShift);
        drawTail(m);

        m.particles.forEach((p) => {
          ctx.save();
          ctx.globalAlpha = p.opacity * m.opacity;
          const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          pg.addColorStop(0, `hsla(${200 + p.hue},80%,95%,1)`);
          pg.addColorStop(0.5, `hsla(${207 + p.hue},68%,80%,0.5)`);
          pg.addColorStop(1, `hsla(${207 + p.hue},68%,72%,0)`);
          ctx.fillStyle = pg;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        drawGlow(m.x, m.y, m.headSize * 5, m.opacity * 0.35, m.hueShift);
        drawGlow(m.x, m.y, m.headSize * 2.5, m.opacity * 0.6, m.hueShift);

        const cg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.headSize);
        cg.addColorStop(0, `hsla(0,0%,100%,${m.opacity * 0.95})`);
        cg.addColorStop(0.4, `hsla(${200 + m.hueShift},80%,92%,${m.opacity * 0.8})`);
        cg.addColorStop(1, `hsla(${207 + m.hueShift},68%,72%,0)`);
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.headSize, 0, Math.PI * 2);
        ctx.fill();

        if (m.x > w + 300 || m.y > h + 300 || m.x < -300 || m.y < -300) {
          meteorsRef.current[idx] = createMeteor(w, h, 3000 + Math.random() * 8000);
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animFrameRef.current); window.removeEventListener("resize", handleResize); };
  }, [createMeteor]);

  return <canvas ref={canvasRef} className="shooting-stars-canvas" />;
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ onLogin, onRegister, isLoggedIn, onGoHome }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const landingLinks = [
    { label: "Trang chủ", href: "#hero" },
    { label: "Cách hoạt động", href: "#how-it-works" },
    { label: "Câu chuyện", href: "#testimonials" },
  ];

  const appLinks = [
    { label: "Home", path: "/home" },
    { label: "Ghép đôi", path: "/match" },
    { label: "Bạn bè", path: "/friends" },
  ];

  const handleNavLinkClick = (e, path) => {
    if (path.startsWith("#")) return;
    e.preventDefault();
    navigate(path);
  };

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <a href="/" className="navbar__brand" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
          <div className="navbar__logo">
            <img src="/favicon.png" alt="VibeMatch Logo" width="24" height="24" />
          </div>
          <span className="navbar__name">VibeMatch</span>
        </a>

        <div className="navbar__links">
          {isLoggedIn ? (
            appLinks.map((l) => (
              <a key={l.path} href={l.path} className="navbar__link" onClick={(e) => handleNavLinkClick(e, l.path)}>{l.label}</a>
            ))
          ) : (
            landingLinks.map((l) => (
              <a key={l.href} href={l.href} className="navbar__link">{l.label}</a>
            ))
          )}
        </div>

        <div className="navbar__actions">
          {isLoggedIn ? (
            <button className="btn btn--primary" onClick={onGoHome}>Vào ứng dụng</button>
          ) : (
            <>
              <button className="btn btn--ghost" onClick={onLogin}>Đăng nhập</button>
              <button className="btn btn--primary" onClick={onRegister}>Tạo tài khoản</button>
            </>
          )}
        </div>

        <button className="navbar__hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="menu">
          {mobileOpen
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          }
        </button>
      </div>

      {mobileOpen && (
        <div className="navbar__mobile">
          {isLoggedIn ? (
            appLinks.map((l) => (
              <a key={l.path} href={l.path} className="navbar__mobile-link" onClick={(e) => { setMobileOpen(false); handleNavLinkClick(e, l.path); }}>{l.label}</a>
            ))
          ) : (
            landingLinks.map((l) => (
              <a key={l.href} href={l.href} className="navbar__mobile-link" onClick={() => setMobileOpen(false)}>{l.label}</a>
            ))
          )}
          <div className="navbar__mobile-actions">
            {isLoggedIn ? (
              <button className="btn btn--primary btn--full" onClick={onGoHome}>Vào ứng dụng</button>
            ) : (
              <>
                <button className="btn btn--ghost btn--full" onClick={onLogin}>Đăng nhập</button>
                <button className="btn btn--primary btn--full" onClick={onRegister}>Tạo tài khoản</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection({ onRegister, isLoggedIn, onGoHome }) {
  return (
    <section id="hero" className="hero">
      <div className="hero__blob hero__blob--left" />
      <div className="hero__blob hero__blob--right" />

      <div className="hero__inner">
        {/* Left */}
        <div className="hero__content">
          <div className="hero__badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            Nền tảng kết nối hàng đầu Việt Nam
          </div>

          <h1 className="hero__title">
            Tìm kiếm <span className="hero__title--accent">phong cách hoàn hảo</span> của bạn
          </h1>

          <p className="hero__desc">
            Kết nối với những người có chung sở thích và cùng nhau lên kế hoạch cho các hoạt động thực tế.
          </p>

          <div className="hero__cta">
            {isLoggedIn ? (
              <button className="btn btn--accent btn--lg" onClick={onGoHome}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                Về trang chủ ngay
              </button>
            ) : (
              <button className="btn btn--accent btn--lg" onClick={onRegister}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                Bắt đầu ghép đôi ngay
              </button>
            )}
            <a href="#how-it-works" className="btn btn--outline btn--lg">Tìm hiểu thêm</a>
          </div>

          <div className="hero__social-proof">
            <div className="hero__avatars">
              {["A", "B", "C", "D"].map((l) => (
                <div key={l} className="hero__avatar">{l}</div>
              ))}
            </div>
            <p className="hero__social-text">
              <strong>500K+</strong> thành viên tin tưởng
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="hero__visual">
          <div className="hero__img-wrap">
            <img src={heroImage} alt="Hero Friends" className="hero__img" />

            <div className="hero__float hero__float--left">
              <div className="hero__float-avatar hero__float-avatar--gold">T</div>
              <div>
                <p className="hero__float-name">Tú Bà</p>
                <p className="hero__float-match">98% phù hợp ⚡</p>
              </div>
            </div>

            <div className="hero__float hero__float--right">
              <div className="hero__float-avatar hero__float-avatar--blue">H</div>
              <div>
                <p className="hero__float-name">Hoàng Thảo</p>
                <p className="hero__float-match">95% phù hợp 🎯</p>
              </div>
            </div>

            <div className="hero__zap">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
      ),
      title: "Tạo hồ sơ của bạn",
      desc: "Đăng ký miễn phí và hoàn thiện hồ sơ cá nhân với sở thích, hoạt động yêu thích của bạn.",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /><path d="M7 8h10M7 12h6" /></svg>
      ),
      title: "Thuật toán ghép đôi thông minh",
      desc: "AI phân tích hàng trăm tiêu chí để tìm ra người có cùng sở thích và phong cách sống với bạn.",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><polyline points="9 16 11 18 15 14" /></svg>
      ),
      title: "Trò chuyện & lên kế hoạch",
      desc: "Kết nối, nhắn tin và cùng lên lịch hoạt động thực tế. Hành trình kết nối bắt đầu từ đây!",
    },
  ];

  return (
    <section id="how-it-works" className="section how-it-works">
      <div className="section__inner">
        <div className="section__header">
          <p className="section__label">Cách thức hoạt động</p>
          <h2 className="section__title">
            Tìm người phù hợp chỉ trong <span className="text-accent">3 bước đơn giản</span>
          </h2>
        </div>

        <div className="steps">
          {steps.map((step, i) => (
            <div key={i} className="step">
              <div className="step__icon-wrap">
                <div className="step__icon">{step.icon}</div>
                <span className="step__number">{i + 1}</span>
              </div>
              <h3 className="step__title">{step.title}</h3>
              <p className="step__desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
      title: "Hồ sơ đã được xác minh",
      desc: "Mọi hồ sơ đều được xác minh chặt chẽ, đảm bảo bạn kết nối với người thật.",
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" /><circle cx="18" cy="6" r="3" fill="currentColor" fillOpacity=".2" /><path d="M18 3v3h3" /></svg>,
      title: "Thuật toán ghép đôi sở thích",
      desc: "Công nghệ AI phân tích sở thích, hoạt động yêu thích để tìm ra người phù hợp nhất.",
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
      title: "Trò chuyện an toàn",
      desc: "Dữ liệu được mã hóa đầu-cuối. Bạn hoàn toàn kiểm soát quyền riêng tư của mình.",
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
      title: "Lên lịch hoạt động",
      desc: "Dễ dàng lên kế hoạch gặp gỡ, uống cà phê, chơi thể thao hay du lịch cùng bạn mới.",
    },
  ];

  return (
    <section id="features" className="section features">
      <div className="features__bg" />
      <div className="section__inner">
        <div className="section__header">
          <p className="section__label">Tính năng nổi bật</p>
          <h2 className="section__title">
            Tại sao chọn <span className="text-accent">VibeMatch</span>?
          </h2>
        </div>

        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-card__icon">{f.icon}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [current, setCurrent] = useState(0);

  const list = [
    { names: "Hoàng Thảo và Tú Bà", image: heroImage, rating: 5, quote: "Nhờ dùng vibematch nên chúng tôi có những cuộc đi chơi vui vẻ với nhau và sau cuộc hẹn đó thì không biết còn cuộc hẹn nào không nhưng mọi người hãy dùng vibematch nhé!" },
    { names: "Thắng và Minh", image: thangminhImg, rating: 5, quote: "Chúng mình gặp nhau trên VibeMatch nhờ cùng yêu thích chạy bộ buổi sáng. Giờ đây, mỗi ngày đều là một cuộc chạy đua với deadline mà mentor team tôi dí." },
    { names: "Giang và ai đó", image: giangImg, rating: 5, quote: "Sau khi dùng Vibematch tôi đã gặp được chân ái của đời mình,dùng Vibematch mình đã được gặp gỡ rất nhiều người,nhất là anh Minh đẹp trai(Sau mỗi anh techlead lại là 1 anh đẹp trai khác đẹp hơn anh Minh) đã bị em lừa vào đời." },
  ];

  const prev = () => setCurrent((c) => (c === 0 ? list.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === list.length - 1 ? 0 : c + 1));
  const t = list[current];

  return (
    <section id="testimonials" className="section testimonials">
      <div className="section__inner">
        <div className="section__header">
          <p className="section__label">Lời chứng thực</p>
          <h2 className="section__title">
            Những Câu Chuyện Có Thật, <span className="text-accent">Những Kết Nối Thật</span>
          </h2>
        </div>

        <div className="testimonial-card">
          <svg className="testimonial-card__quote" width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg>

          <div className="testimonial-card__avatar">
            {t.image ? (
              <img src={t.image} alt={t.names} className="testimonial-card__img" />
            ) : (
              t.initials
            )}
          </div>


          <div className="testimonial-card__stars">
            {Array.from({ length: t.rating }).map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            ))}
          </div>

          <p className="testimonial-card__text">"{t.quote}"</p>
          <p className="testimonial-card__name">{t.names}</p>
        </div>

        <div className="testimonial-nav">
          <button className="testimonial-nav__btn" onClick={prev} aria-label="previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          <div className="testimonial-nav__dots">
            {list.map((_, i) => (
              <button key={i} className={`testimonial-nav__dot${i === current ? " testimonial-nav__dot--active" : ""}`} onClick={() => setCurrent(i)} aria-label={`slide ${i + 1}`} />
            ))}
          </div>

          <button className="testimonial-nav__btn" onClick={next} aria-label="next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── CTA SECTION ──────────────────────────────────────────────────────────────
function CTASection({ onRegister, isLoggedIn, onGoHome }) {
  return (
    <section className="cta-section">
      <div className="cta-section__inner">
        <h2 className="cta-section__title">Sẵn sàng tìm người phù hợp?</h2>
        <p className="cta-section__desc">Tham gia cùng 500K+ thành viên đang kết nối mỗi ngày trên VibeMatch.</p>
        <button className="btn btn--accent btn--lg" onClick={isLoggedIn ? onGoHome : onRegister}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {isLoggedIn ? (
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            ) : (
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            )}
            {isLoggedIn && <polyline points="9 22 9 12 15 12 15 22" />}
          </svg>
          {isLoggedIn ? "Về trang chủ ngay" : "Bắt đầu miễn phí ngay"}
        </button>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const [email, setEmail] = useState("");

  const footerLinks = {
    "Về chúng tôi": ["Giới thiệu", "Đội ngũ", "Tuyển dụng", "Liên hệ"],
    "Hỗ trợ": ["Trung tâm trợ giúp", "Điều khoản sử dụng", "Chính sách bảo mật", "An toàn"],
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo-row">
            <div className="footer__logo">
              <img src="/favicon.png" alt="VibeMatch Logo" width="22" height="22" />
            </div>
            <span className="footer__brand-name">VibeMatch</span>
          </div>
          <p className="footer__brand-desc">
            Nền tảng kết nối xã hội hàng đầu Việt Nam — giúp bạn tìm người có cùng sở thích và lên kế hoạch hoạt động cùng nhau.
          </p>
          <div className="footer__socials">
            {["Fb", "Ig", "Tw", "Yt"].map((s) => (
              <div key={s} className="footer__social">{s}</div>
            ))}
          </div>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title} className="footer__col">
            <h4 className="footer__col-title">{title}</h4>
            <ul className="footer__col-list">
              {links.map((link) => (
                <li key={link}><a href="#" className="footer__col-link">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer__newsletter">
          <h4 className="footer__col-title">Nhận bản tin</h4>
          <p className="footer__newsletter-desc">Cập nhật tin tức và sự kiện mới nhất từ VibeMatch.</p>
          <div className="footer__newsletter-form">
            <input
              type="email"
              placeholder="Email của bạn"
              className="footer__newsletter-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn--accent btn--sm">Đăng ký</button>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2024 VibeMatch. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
}

// ─── LANDING (MAIN EXPORT) ────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleRegister = () => navigate("/register");
  const handleLogin = () => navigate("/login");
  const handleGoHome = () => navigate("/home");

  return (
    <div className="landing-page">
      <ShootingStars />
      <Navbar onLogin={handleLogin} onRegister={handleRegister} isLoggedIn={isLoggedIn} onGoHome={handleGoHome} />
      <HeroSection onRegister={handleRegister} isLoggedIn={isLoggedIn} onGoHome={handleGoHome} />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTASection onRegister={handleRegister} isLoggedIn={isLoggedIn} onGoHome={handleGoHome} />
      <Footer />
    </div>
  );
}
