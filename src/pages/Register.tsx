import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, signIn, confirmSignUp, resendSignUpCode, fetchUserAttributes, getCurrentUser } from "aws-amplify/auth";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";

type Role = "business" | "developer";
type Step = "form" | "confirm";


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
      <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">{label}</label>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-4 py-3 bg-violet-950/20 border rounded text-sm text-gray-200 placeholder-gray-600 focus:outline-none transition-colors ${
            error ? "border-red-500/60 focus:border-red-400" : "border-violet-900/50 focus:border-violet-500/70"
          }`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
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

const RoleCard: React.FC<{
  role: Role;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ selected, onClick, icon, title, description }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex-1 p-4 rounded border text-left transition-all duration-200 overflow-hidden group ${
      selected
        ? "border-violet-500/70 bg-violet-950/40"
        : "border-violet-900/40 bg-violet-950/10 hover:border-violet-700/60"
    }`}
  >
    {selected && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />}
    <div className={`mb-2 transition-colors ${selected ? "text-violet-400" : "text-gray-600 group-hover:text-gray-400"}`}>
      {icon}
    </div>
    <div className={`text-xs font-black tracking-widest uppercase mb-1 ${selected ? "text-violet-300" : "text-gray-400"}`}>{title}</div>
    <div className="text-[10px] text-gray-600 leading-relaxed">{description}</div>
    {selected && (
      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    )}
  </button>
);

const ConfirmStep: React.FC<{ email: string; password: string; lang: string; onSuccess: () => void }> = ({
  email, password, lang, onSuccess,
}) => {
  const [code, setCode]         = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [resent, setResent]     = useState(false);

  const handleConfirm = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (code.length < 4) { setError(lang === "en" ? "Enter the code" : "Ingresá el código"); return; }
    setLoading(true);
    setError("");
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const alreadyConfirmed =
        msg.includes("already confirmed") ||
        msg.includes("CONFIRMED") ||
        msg.includes("NotAuthorizedException") ||
        msg.includes("AliasExistsException");
      if (!alreadyConfirmed) {
        setError(msg);
        setLoading(false);
        return;
      }
    }
    try {
      await signIn({ username: email, password });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already signed in") || msg.includes("UserAlreadyAuthenticated")) {
        onSuccess();
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendSignUpCode({ username: email });
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch { /* silent */ }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="px-4 py-3 bg-violet-950/30 border border-violet-800/40 rounded text-xs text-gray-400 leading-relaxed">
        {lang === "en"
          ? `We sent a verification code to `
          : `Enviamos un código de verificación a `}
        <span className="text-violet-300 font-semibold">{email}</span>
      </div>

      <form onSubmit={handleConfirm} className="flex flex-col gap-4" noValidate>
        <Field
          label={lang === "en" ? "Verification code" : "Código de verificación"}
          type="text"
          value={code}
          onChange={setCode}
          placeholder="123456"
          autoComplete="one-time-code"
          error={error}
        />
        <button
          type="submit"
          disabled={loading}
          className="py-3 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all flex items-center justify-center gap-2"
        >
          {loading && <span className="w-3.5 h-3.5 border border-black border-t-transparent rounded-full animate-spin" />}
          {lang === "en" ? "Verify account" : "Verificar cuenta"}
        </button>
      </form>

      <button
        onClick={handleResend}
        className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 hover:text-violet-300 transition-colors text-center"
      >
        {resent
          ? (lang === "en" ? "✓ Code resent" : "✓ Código reenviado")
          : (lang === "en" ? "Resend code" : "Reenviar código")}
      </button>
    </div>
  );
};


const Register: React.FC = () => {
  const { lang } = useLanguage();
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [step, setStep]           = useState<Step>("form");
  const [role, setRole]           = useState<Role>("business");
  const [username, setUsername]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [errors, setErrors]       = useState<Record<string, string>>({});
  const [loading, setLoading]     = useState(false);
  const [globalErr, setGlobalErr] = useState("");

  const t = {
    title:    lang === "en" ? "Create your account"   : "Creá tu cuenta",
    sub:      lang === "en" ? "Join the platform"     : "Unite a la plataforma",
    roleQ:    lang === "en" ? "I am a..."             : "Soy...",
    user:     lang === "en" ? "Username"              : "Nombre de usuario",
    email:    lang === "en" ? "Email"                 : "Correo electrónico",
    pass:     lang === "en" ? "Password"              : "Contraseña",
    confirm:  lang === "en" ? "Confirm password"      : "Confirmar contraseña",
    submit:   lang === "en" ? "Create account"        : "Crear cuenta",
    loading:  lang === "en" ? "Creating account..."   : "Creando cuenta...",
    hasAcc:   lang === "en" ? "Already have an account?" : "¿Ya tenés cuenta?",
    login:    lang === "en" ? "Sign in"               : "Ingresar",
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username || username.length < 3)      e.username = lang === "en" ? "Min 3 characters" : "Mínimo 3 caracteres";
    if (!/\S+@\S+\.\S+/.test(email))           e.email    = lang === "en" ? "Valid email required" : "Email inválido";
    if (password.length < 8)                   e.password = lang === "en" ? "Min 8 characters" : "Mínimo 8 caracteres";
    if (!/[A-Z]/.test(password))               e.password = lang === "en" ? "Must include uppercase" : "Debe incluir mayúscula";
    if (!/[0-9]/.test(password))               e.password = lang === "en" ? "Must include a number" : "Debe incluir un número";
    if (password !== confirm)                  e.confirm  = lang === "en" ? "Passwords don't match" : "Las contraseñas no coinciden";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignUp = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setGlobalErr("");
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            preferred_username: username,
            "custom:userRole": role,
          },
        },
      });
      setStep("confirm");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("UsernameExistsException")) {
        setGlobalErr(lang === "en" ? "Email already registered" : "El email ya está registrado");
      } else {
        setGlobalErr(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-700 opacity-[0.06] blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
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

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {(["form", "confirm"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                step === s
                  ? "border-violet-500 bg-violet-500/20 text-violet-300"
                  : i < ["form", "confirm"].indexOf(step)
                  ? "border-violet-700 bg-violet-900/30 text-violet-500"
                  : "border-violet-900/40 text-gray-600"
              }`}>
                {i < ["form", "confirm"].indexOf(step) ? "✓" : i + 1}
              </div>
              {i < 1 && <div className={`w-12 h-px transition-colors ${step === "confirm" ? "bg-violet-600" : "bg-violet-900/40"}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="relative border border-violet-900/50 rounded-xl bg-violet-950/10 backdrop-blur-sm p-8 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/60 to-transparent" />

          <div className="mb-7">
            <h1 className="text-xl font-black text-white tracking-tight">
              {step === "form" ? t.title : (lang === "en" ? "Verify your email" : "Verificá tu email")}
            </h1>
            <p className="text-xs text-gray-500 mt-1 tracking-wide">
              {step === "form" ? t.sub : (lang === "en" ? "One last step" : "Un paso más")}
            </p>
          </div>

          {step === "confirm" ? (
            <ConfirmStep
              email={email}
              password={password}
              lang={lang}
              onSuccess={async () => {
                // Session is already open from the signIn call inside ConfirmStep.
                // Fetch attributes to resolve role + sub, set context, then navigate.
                try {
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
                  navigate(
                    role === "developer" ? `/user/developer/${sub}` : "/user/business",
                    { replace: true }
                  );
                } catch {
                  // Fallback — shouldn't happen but don't leave the user stuck
                  navigate("/login", { state: { registered: true } });
                }
              }}
            />
          ) : (
            <form onSubmit={handleSignUp} className="flex flex-col gap-5" noValidate>
              {/* Role selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">{t.roleQ}</label>
                <div className="flex gap-3">
                  <RoleCard
                    role="business"
                    selected={role === "business"}
                    onClick={() => setRole("business")}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <rect x={2} y={7} width={20} height={14} rx={2} /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1={12} y1={12} x2={12} y2={16} /><line x1={10} y1={14} x2={14} y2={14} />
                      </svg>
                    }
                    title={lang === "en" ? "Business" : "Negocio"}
                    description={lang === "en" ? "I need digital solutions" : "Necesito soluciones digitales"}
                  />
                  <RoleCard
                    role="developer"
                    selected={role === "developer"}
                    onClick={() => setRole("developer")}
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                      </svg>
                    }
                    title={lang === "en" ? "Developer" : "Desarrollador"}
                    description={lang === "en" ? "I offer my skills" : "Ofrezco mis habilidades"}
                  />
                </div>
              </div>

              <Field label={t.user}    type="text"     value={username} onChange={setUsername} placeholder="johndoe"          autoComplete="username"      error={errors.username} />
              <Field label={t.email}   type="email"    value={email}    onChange={setEmail}    placeholder="you@email.com"    autoComplete="email"         error={errors.email}    />
              <Field label={t.pass}    type="password" value={password} onChange={setPassword} placeholder="••••••••"         autoComplete="new-password"  error={errors.password} />
              <Field label={t.confirm} type="password" value={confirm}  onChange={setConfirm}  placeholder="••••••••"         autoComplete="new-password"  error={errors.confirm}  />

              {/* Password strength hints */}
              <div className="flex gap-3 -mt-2">
                {[
                  { ok: password.length >= 8,    hint: "8+" },
                  { ok: /[A-Z]/.test(password),  hint: "Aa" },
                  { ok: /[0-9]/.test(password),  hint: "0-9" },
                  { ok: password === confirm && confirm.length > 0, hint: "=" },
                ].map(({ ok, hint }) => (
                  <div key={hint} className={`flex items-center gap-1 text-[9px] font-bold tracking-widest transition-colors ${ok ? "text-violet-400" : "text-gray-700"}`}>
                    <div className={`w-1.5 h-1.5 rounded-full transition-colors ${ok ? "bg-violet-500" : "bg-gray-700"}`} />
                    {hint}
                  </div>
                ))}
              </div>

              {globalErr && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-950/30 border border-red-800/50 rounded text-xs text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2={12} y2={16} />
                  </svg>
                  {globalErr}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 py-3 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all flex items-center justify-center gap-2"
              >
                {loading && <span className="w-3.5 h-3.5 border border-black border-t-transparent rounded-full animate-spin" />}
                {loading ? t.loading : t.submit}
              </button>
            </form>
          )}

          {step === "form" && (
            <p className="mt-6 text-center text-xs text-gray-600">
              {t.hasAcc}{" "}
              <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                {t.login}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;