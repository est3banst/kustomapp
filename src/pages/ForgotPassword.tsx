import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { useLanguage } from "@/context/LanguageContext";

type Step = "request" | "confirm" | "done";

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
  const isPwd = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">{label}</label>
      <div className="relative">
        <input
          type={isPwd && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-4 py-3 bg-violet-950/20 border rounded text-sm text-gray-200 placeholder-gray-600 focus:outline-none transition-colors ${
            error ? "border-red-500/60 focus:border-red-400" : "border-violet-900/50 focus:border-violet-500/70"
          }`}
        />
        {isPwd && (
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
            {show ? (
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1={1} y1={1} x2={23} y2={23}/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx={12} cy={12} r={3}/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className="text-[10px] text-red-400 tracking-wide">{error}</span>}
    </div>
  );
};

const KustomLogo: React.FC = () => (
  <Link to="/" className="flex items-center gap-2 mb-10 group w-fit mx-auto">
    <div className="relative w-7 h-7">
      <div className="absolute inset-0 bg-violet-500 opacity-20 rounded blur-sm" />
      <div className="relative w-full h-full border border-violet-400/60 rounded flex items-center justify-center">
        <span className="text-violet-300 font-black text-xs">K</span>
      </div>
    </div>
    <span className="text-white font-black text-base tracking-[0.2em] uppercase">KUSTOM</span>
  </Link>
);

const BgGrid: React.FC = () => (
  <>
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }}
    />
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-700 opacity-[0.07] blur-[80px] pointer-events-none" />
  </>
);

const ForgotPassword: React.FC = () => {
  const { lang } = useLanguage();
  const navigate  = useNavigate();

  const [step, setStep]         = useState<Step>("request");
  const [email, setEmail]       = useState("");
  const [code, setCode]         = useState("");
  const [newPwd, setNewPwd]     = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [globalErr, setGlobalErr] = useState("");

  const t = {
    requestTitle: lang === "en" ? "Reset your password"   : "Recuperá tu contraseña",
    requestSub:   lang === "en" ? "Enter your email and we'll send a reset code" : "Ingresá tu email y te enviamos un código",
    confirmTitle: lang === "en" ? "Enter the code"        : "Ingresá el código",
    confirmSub:   lang === "en" ? "Check your inbox"      : "Revisá tu bandeja de entrada",
    doneTitle:    lang === "en" ? "Password updated"      : "Contraseña actualizada",
    doneSub:      lang === "en" ? "You can now sign in with your new password" : "Ya podés ingresar con tu nueva contraseña",
    emailLabel:   lang === "en" ? "Email"                 : "Correo electrónico",
    codeLabel:    lang === "en" ? "Verification code"     : "Código de verificación",
    newPwdLabel:  lang === "en" ? "New password"          : "Nueva contraseña",
    confirmLabel: lang === "en" ? "Confirm new password"  : "Confirmar contraseña",
    sendCode:     lang === "en" ? "Send reset code"       : "Enviar código",
    resetBtn:     lang === "en" ? "Reset password"        : "Cambiar contraseña",
    backToLogin:  lang === "en" ? "Back to sign in"       : "Volver al inicio de sesión",
    goToLogin:    lang === "en" ? "Go to sign in"         : "Ir al inicio de sesión",
    sending:      lang === "en" ? "Sending..."            : "Enviando...",
    resetting:    lang === "en" ? "Resetting..."          : "Cambiando...",
  };

  // ── Step 1: request code ──
  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/\S+@\S+\.\S+/.test(email)) errs.email = lang === "en" ? "Enter a valid email" : "Email inválido";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setGlobalErr("");
    try {
      await resetPassword({ username: email });
      setStep("confirm");
    } catch (err: unknown) {
      setGlobalErr(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: confirm with code + new password ──
  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (code.length < 4)        errs.code       = lang === "en" ? "Enter the code"          : "Ingresá el código";
    if (newPwd.length < 8)      errs.newPwd      = lang === "en" ? "Min 8 characters"        : "Mínimo 8 caracteres";
    if (!/[A-Z]/.test(newPwd))  errs.newPwd      = lang === "en" ? "Must include uppercase"  : "Debe incluir mayúscula";
    if (!/[0-9]/.test(newPwd))  errs.newPwd      = lang === "en" ? "Must include a number"   : "Debe incluir un número";
    if (newPwd !== confirmPwd)  errs.confirmPwd   = lang === "en" ? "Passwords don't match"  : "Las contraseñas no coinciden";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setGlobalErr("");
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword: newPwd });
      setStep("done");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("CodeMismatchException")) {
        setErrors({ code: lang === "en" ? "Invalid code" : "Código inválido" });
      } else if (msg.includes("ExpiredCodeException")) {
        setErrors({ code: lang === "en" ? "Code expired — request a new one" : "Código vencido — pedí uno nuevo" });
      } else {
        setGlobalErr(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <BgGrid />
      <div className="relative z-10 w-full max-w-sm">
        <KustomLogo />

        <div className="relative border border-violet-900/50 rounded-xl bg-violet-950/10 backdrop-blur-sm p-8 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-600/60 to-transparent" />

          {/* ── Step indicators ── */}
          <div className="flex items-center gap-2 mb-7 justify-center">
            {(["request", "confirm", "done"] as Step[]).map((s, i) => {
              const stepIndex = ["request", "confirm", "done"].indexOf(step);
              const thisIndex = i;
              const done      = thisIndex < stepIndex;
              const active    = s === step;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-black transition-all ${
                    active ? "border-violet-500 bg-violet-500/20 text-violet-300"
                    : done  ? "border-violet-700 bg-violet-900/30 text-violet-500"
                    : "border-violet-900/40 text-gray-700"
                  }`}>
                    {done ? "✓" : i + 1}
                  </div>
                  {i < 2 && <div className={`w-8 h-px transition-colors ${thisIndex < stepIndex ? "bg-violet-700" : "bg-violet-900/40"}`} />}
                </div>
              );
            })}
          </div>

          {/* ── Request step ── */}
          {step === "request" && (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-black text-white tracking-tight">{t.requestTitle}</h1>
                <p className="text-xs text-gray-500 mt-1">{t.requestSub}</p>
              </div>
              <form onSubmit={handleRequest} className="flex flex-col gap-5" noValidate>
                <Field label={t.emailLabel} type="email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" error={errors.email} />
                {globalErr && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-950/30 border border-red-800/50 rounded text-xs text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={12}/><line x1={12} y1={16} x2={12} y2={16}/></svg>
                    {globalErr}
                  </div>
                )}
                <button type="submit" disabled={loading} className="py-3 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all flex items-center justify-center gap-2">
                  {loading && <span className="w-3.5 h-3.5 border border-black border-t-transparent rounded-full animate-spin" />}
                  {loading ? t.sending : t.sendCode}
                </button>
              </form>
            </>
          )}

          {/* ── Confirm step ── */}
          {step === "confirm" && (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-black text-white tracking-tight">{t.confirmTitle}</h1>
                <p className="text-xs text-gray-500 mt-1">
                  {t.confirmSub} — <span className="text-violet-400">{email}</span>
                </p>
              </div>
              <form onSubmit={handleConfirm} className="flex flex-col gap-4" noValidate>
                <Field label={t.codeLabel}    type="text"     value={code}       onChange={setCode}       placeholder="123456"   autoComplete="one-time-code" error={errors.code}       />
                <Field label={t.newPwdLabel}  type="password" value={newPwd}     onChange={setNewPwd}     placeholder="••••••••" autoComplete="new-password"  error={errors.newPwd}     />
                <Field label={t.confirmLabel} type="password" value={confirmPwd} onChange={setConfirmPwd} placeholder="••••••••" autoComplete="new-password"  error={errors.confirmPwd} />

                {/* Strength indicators */}
                <div className="flex gap-3">
                  {[
                    { ok: newPwd.length >= 8,   hint: "8+" },
                    { ok: /[A-Z]/.test(newPwd), hint: "Aa" },
                    { ok: /[0-9]/.test(newPwd), hint: "0-9" },
                    { ok: newPwd === confirmPwd && confirmPwd.length > 0, hint: "=" },
                  ].map(({ ok, hint }) => (
                    <div key={hint} className={`flex items-center gap-1 text-[9px] font-bold tracking-widest transition-colors ${ok ? "text-violet-400" : "text-gray-700"}`}>
                      <div className={`w-1.5 h-1.5 rounded-full transition-colors ${ok ? "bg-violet-500" : "bg-gray-700"}`} />
                      {hint}
                    </div>
                  ))}
                </div>

                {globalErr && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-red-950/30 border border-red-800/50 rounded text-xs text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={12}/><line x1={12} y1={16} x2={12} y2={16}/></svg>
                    {globalErr}
                  </div>
                )}
                <button type="submit" disabled={loading} className="py-3 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all flex items-center justify-center gap-2">
                  {loading && <span className="w-3.5 h-3.5 border border-black border-t-transparent rounded-full animate-spin" />}
                  {loading ? t.resetting : t.resetBtn}
                </button>
              </form>
              <button onClick={() => setStep("request")} className="mt-4 w-full text-center text-[10px] font-semibold tracking-widest uppercase text-gray-600 hover:text-violet-300 transition-colors">
                ← {lang === "en" ? "Use a different email" : "Usar otro email"}
              </button>
            </>
          )}

          {/* ── Done step ── */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-6 py-4 text-center">
              <div className="w-14 h-14 rounded-full border border-violet-600/50 bg-violet-950/40 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="text-violet-400">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-black text-white mb-1">{t.doneTitle}</h1>
                <p className="text-xs text-gray-500">{t.doneSub}</p>
              </div>
              <button onClick={() => navigate("/login")} className="w-full py-3 bg-violet-500 hover:bg-violet-400 text-black font-black text-xs tracking-[0.2em] uppercase rounded transition-all">
                {t.goToLogin}
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 hover:text-violet-300 transition-colors">
              ← {t.backToLogin}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;