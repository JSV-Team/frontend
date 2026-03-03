import { useMemo, useState } from "react";
import "./Login.css";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return identifier.trim().length > 0 && password.length > 0 && !isSubmitting;
  }, [identifier, password, isSubmitting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);

      // TODO: Gọi API login ở đây (axios/fetch)
      // Ví dụ:
      // await authService.login({ identifier, password });

      // Demo:
      await new Promise((r) => setTimeout(r, 600));
      alert("Đăng nhập (demo) thành công!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="login-card" role="dialog" aria-label="Đăng nhập">
        <h1 className="title">Đăng nhập</h1>

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="sr-only">Email hoặc số điện thoại</span>
            <input
              className="input"
              type="text"
              inputMode="email"
              autoComplete="username"
              placeholder="Email hoặc số điện thoại"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="sr-only">Mật khẩu</span>
            <div className="password-wrap">
              <input
                className="input"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                title={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPwd ? (
                  // eye-off icon (SVG)
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2.1 3.51 3.51 2.1 21.9 20.49l-1.41 1.41-3.14-3.14A12.7 12.7 0 0 1 12 20C7 20 2.73 16.89 1 12c.74-2.09 2.09-3.98 3.87-5.44L2.1 3.51Zm7.24 7.24a3 3 0 0 0 3.15 3.15l-3.15-3.15Zm8.5 6.38-2.2-2.2A5.98 5.98 0 0 0 9 8.36L6.8 6.16A8.92 8.92 0 0 1 12 4c5 0 9.27 3.11 11 8-.62 1.76-1.62 3.37-2.96 4.73ZM14.66 12.2l-2.86-2.86c.07-.01.14-.02.2-.02a3 3 0 0 1 2.66 2.88Z" />
                  </svg>
                ) : (
                  // eye icon (SVG)
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 5c5 0 9.27 3.11 11 8-1.73 4.89-6 8-11 8S2.73 17.89 1 13c1.73-4.89 6-8 11-8Zm0 2C8.1 7 4.65 9.33 3.18 13 4.65 16.67 8.1 19 12 19s7.35-2.33 8.82-6C19.35 9.33 15.9 7 12 7Zm0 2.5A3.5 3.5 0 1 1 12 16.5 3.5 3.5 0 0 1 12 9.5Zm0 2A1.5 1.5 0 1 0 12 14.5 1.5 1.5 0 0 0 12 11.5Z" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          <button className="submit" type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <a className="forgot" href="#" onClick={(e) => e.preventDefault()}>
            Quên mật khẩu
          </a>
        </form>
      </div>
    </div>
  );
}
