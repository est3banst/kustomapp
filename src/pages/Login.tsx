import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signIn, fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";

// ── Reusable field ──────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}> = ({ label, type, value, onChange, placeholder, autoComplete, error }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-4 py-3 bg-violet-950/20 border rounded text-sm text-gray-200 placeholder-gray-600 focus:outline-none transition-colors ${
            error
              ? "border-red-500/60 focus:border-red-400"
              : "border-violet-900/50 focus:border-violet-500/70"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {show ? (
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1={1} y1={1} x2={23} y2={23} />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx={12} cy={12} r={3} />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className="text-[10px] text-red-400 tracking-wide">{error}</span>}
    </div>
  );
};

// ── Login page ──────────────────────────────────────────────────────
const Login: React.FC = () => {
  const { setUser } = useUser();
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from?.pathname ?? null;

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors]     = useState<{ email?: string; password?: string; global?: string }>({});
  const [loading, setLoading]   = useState(false);

  const t = {
    title:       lang === "en" ? "Welcome back"       : "Bienvenido",
    sub:         lang === "en" ? "Sign in to your account" : "Ingresá a tu cuenta",
    emailLabel:  lang === "en" ? "Email"              : "Correo electrónico",
    passLabel:   lang === "en" ? "Password"           : "Contraseña",
    forgot:      lang === "en" ? "Forgot password?"   : "¿Olvidaste tu contraseña?",
    submit:      lang === "en" ? "Sign in"            : "Ingresar",
    loading:     lang === "en" ? "Signing in..."      : "Ingresando...",
    noAccount:   lang === "en" ? "No account yet?"   : "¿No tenés cuenta?",
    register:    lang === "en" ? "Create one"         : "Creá una",
    errEmail:    lang === "en" ? "Enter a valid email"    : "Ingresá un email válido",
    errPassword: lang === "en" ? "Password is required"  : "La contraseña es requerida",
    errInvalid:  lang === "en" ? "Incorrect email or password" : "Email o contraseña incorrectos",
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!/\S+@\S+\.\S+/.test(email)) e.email = t.errEmail;
    if (!password) e.password = t.errPassword;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password });

      if (isSignedIn) {
        // Resolve role + sub so we can route to the correct dashboard
        const [cognitoUser, attrs] = await Promise.all([
          getCurrentUser(),
          fetchUserAttributes(),
        ]);
        const role = (attrs["custom:userRole"] ?? "business") as "developer" | "business";
        const sub  = cognitoUser.userId;

        setUser({
          username:    attrs.preferred_username ?? cognitoUser.username,
          email:       attrs.email ?? email,
          role,
          sub,
          displayName: attrs.preferred_username ?? cognitoUser.username,
        });

        // If there was a specific protected page they tried to reach, go there.
        // Otherwise fall back to their role-specific dashboard.
        const destination =
          from ??
          (role === "developer" ? `/user/developer/${sub}` : "/user/business");

        navigate(destination, { replace: true });
        return;
      }

      // Handle Cognito challenge steps
      if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
        navigate("/confirmar", { state: { email } });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("UserNotConfirmed")) {
        navigate("/confirmar", { state: { email } });
      } else {
        setErrors({ global: t.errInvalid });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-700 opacity-[0.07] blur-[80px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-10 group w-fit mx-auto">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 bg-violet-500 opacity-20 rounded blur-sm" />
            <div className="relative w-full h-full border border-violet-400/60 rounded flex items-center justify-center">
              <span className="text-violet-300 font-black text-xs">K</span>
            </div>
          </div>
          <span className="text-white font-black text-base tracking-[0.2em] uppercase">KUSTOM</span>
        </Link>

        {/* Card */}
        <div className="relative border border-violet-900/50 rounded-xl bg-violet-950/10 backdrop-blur-sm p-8 overflow-hidden">
          {/* Card top accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/60 to-transparent" />

          <div className="mb-7">
            <h1 className="text-xl font-black text-white tracking-tight">{t.title}</h1>
            <p className="text-xs text-gray-500 mt-1 tracking-wide">{t.sub}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <Field
              label={t.emailLabel}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@email.com"
              autoComplete="email"
              error={errors.email}
            />
            <Field
              label={t.passLabel}
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password}
            />

            {/* Forgot */}
            <div className="flex justify-end -mt-2">
              <Link
                to="/recuperar"
                className="text-[10px] font-semibold tracking-widest uppercase text-gray-500 hover:text-violet-300 transition-colors"
              >
                {t.forgot}
              </Link>
            </div>

            {/* Global error */}
            {errors.global && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-950/30 border border-red-800/50 rounded text-xs text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2={12} y2={16} />
                </svg>
                {errors.global}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="relative mt-1 py-3 px-6 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all duration-200 overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border border-black border-t-transparent rounded-full animate-spin" />
                    {t.loading}
                  </>
                ) : t.submit}
              </span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-600">
            {t.noAccount}{" "}
            <Link to="/registro" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              {t.register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;