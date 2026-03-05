import "./login.css";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: gọi API login sau
    alert("Login click (demo)");
  };

  return (
    <main className="bg">
      <section className="card" aria-label="Login">
        <h1 className="title">LOGIN</h1>


        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="fieldIcon">👤</span>
            <input
              type="text"
              name="Gmail hoặc số điện thoại"
              placeholder="Gmail hoặc số điện thoại"
              autoComplete="Gmail hoặc số điện thoại"
              required
            />
          </label>

          <label className="field">
            <span className="fieldIcon">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="password"
              autoComplete="current-password"
              required
            />
          </label>

          <div className="row">
            <label className="check">
              <input type="checkbox" name="remember" />
              <span>Remember me</span>
            </label>

            <a className="link" href="#">
              Forgot your password?
            </a>
          </div>

          <button className="btn primary" type="submit">
            Login
          </button>

          <p className="foot">
            Not a member? <a className="link" href="#">Sign up now</a>
          </p>
        </form>
      </section>
    </main>
  );
}