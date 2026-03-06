import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserAttributes,
  updatePassword,
  deleteUser,
  signOut,
} from "aws-amplify/auth";
import { useUser, type User } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import Nav from "@/components/Nav";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Tab = "profile" | "security" | "notifications" | "danger";
type SaveState = "idle" | "saving" | "saved" | "error";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function passwordStrength(p: string): { score: number; label_en: string; label_es: string; color: string } {
  let score = 0;
  if (p.length >= 8)           score++;
  if (/[A-Z]/.test(p))         score++;
  if (/[0-9]/.test(p))         score++;
  if (/[^A-Za-z0-9]/.test(p))  score++;
  const map = [
    { label_en: "Too short",  label_es: "Muy corta",  color: "bg-red-600"    },
    { label_en: "Weak",       label_es: "Débil",       color: "bg-red-500"    },
    { label_en: "Fair",       label_es: "Regular",     color: "bg-amber-500"  },
    { label_en: "Good",       label_es: "Buena",       color: "bg-blue-500"   },
    { label_en: "Strong",     label_es: "Fuerte",      color: "bg-emerald-500"},
  ];
  return { score, ...map[score] };
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────
const SectionCard: React.FC<{ title: string; sub?: string; children: React.ReactNode }> = ({
  title, sub, children,
}) => (
  <div className="relative border border-violet-900/40 bg-violet-950/10 rounded-xl overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-700/40 to-transparent" />
    <div className="px-6 pt-5 pb-4 border-b border-violet-900/30">
      <h2 className="text-sm font-black text-white tracking-tight">{title}</h2>
      {sub && <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">{sub}</p>}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const FieldLabel: React.FC<{ label: string; required?: boolean; hint?: string }> = ({ label, required, hint }) => (
  <div className="flex items-center justify-between mb-1.5">
    <label className="text-[10px] font-bold tracking-[0.25em] uppercase text-gray-500">
      {label}{required && <span className="text-violet-500 ml-1">*</span>}
    </label>
    {hint && <span className="text-[10px] text-gray-600">{hint}</span>}
  </div>
);

const TextInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  error?: string;
  maxLength?: number;
}> = ({ value, onChange, placeholder, type = "text", disabled, error, maxLength }) => (
  <div>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      className={`w-full px-4 py-3 bg-violet-950/20 border rounded text-sm placeholder-gray-600 focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        error
          ? "border-red-500/60 text-red-200 focus:border-red-500"
          : "border-violet-900/50 text-gray-200 focus:border-violet-500/70"
      }`}
    />
    {error && <p className="mt-1 text-[10px] text-red-400">{error}</p>}
  </div>
);

const SaveButton: React.FC<{
  state: SaveState;
  label_idle: string;
  label_saving: string;
  label_saved: string;
  label_error: string;
}> = ({ state, label_idle, label_saving, label_saved, label_error }) => {
  const cfg = {
    idle:   { text: label_idle,   cls: "bg-violet-500 hover:bg-violet-400 text-black" },
    saving: { text: label_saving, cls: "bg-violet-700 text-violet-300 opacity-70 cursor-wait" },
    saved:  { text: label_saved,  cls: "bg-emerald-600 text-white cursor-default" },
    error:  { text: label_error,  cls: "bg-red-700 text-white cursor-default" },
  }[state];

  return (
    <button
      type="submit"
      disabled={state === "saving" || state === "saved"}
      className={`flex items-center gap-2 px-5 py-2.5 rounded font-black text-xs tracking-[0.2em] uppercase transition-all ${cfg.cls}`}
    >
      {state === "saving" && <span className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />}
      {state === "saved"  && <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12"/></svg>}
      {cfg.text}
    </button>
  );
};

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string }> = ({
  checked, onChange, label, sub,
}) => (
  <label className="flex items-start justify-between gap-4 cursor-pointer group">
    <div>
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
      {sub && <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed">{sub}</p>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative shrink-0 mt-0.5 w-9 h-5 rounded-full border transition-all duration-200 ${
        checked ? "bg-violet-600 border-violet-500" : "bg-violet-950/40 border-violet-900/50"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  </label>
);

// ─────────────────────────────────────────────────────────────────────────────
// Settings page
// ─────────────────────────────────────────────────────────────────────────────
const Settings: React.FC = () => {
  const { user, setUser } = useUser();
  const { lang }          = useLanguage();
  const navigate          = useNavigate();

  const [tab, setTab] = useState<Tab>("profile");

  // ── Profile state ──
  const [displayName,  setDisplayName]  = useState(user?.displayName ?? "");
  const [username,     setUsername]     = useState(user?.username    ?? "");
  const [avatarUrl,    setAvatarUrl]    = useState(user?.avatarUrl   ?? "");
  const [avatarFile,   setAvatarFile]   = useState<File | null>(null);
  const [avatarPreview,setAvatarPreview]= useState<string | null>(null);
  const [profileErrors,setProfileErrors]= useState<Record<string, string>>({});
  const [profileSave,  setProfileSave]  = useState<SaveState>("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Security state ──
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showPws,    setShowPws]    = useState(false);
  const [secErrors,  setSecErrors]  = useState<Record<string, string>>({});
  const [secSave,    setSecSave]    = useState<SaveState>("idle");

  // ── Notification prefs ──
  const [notifProposals, setNotifProposals] = useState(true);
  const [notifMessages,  setNotifMessages]  = useState(true);
  const [notifUpdates,   setNotifUpdates]   = useState(false);
  const [notifNewsletter,setNotifNewsletter]= useState(false);
  const [notifSave,      setNotifSave]      = useState<SaveState>("idle");

  // ── Danger zone ──
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting,      setDeleting]      = useState(false);
  const [deleteError,   setDeleteError]   = useState("");

  const isDev = user?.role === "developer";

  // ── Avatar handling ─────────────────────────────────────────────
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setProfileErrors((prev) => ({
        ...prev,
        avatar: lang === "en" ? "Image must be under 5 MB" : "La imagen debe ser menor a 5 MB",
      }));
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setProfileErrors((prev) => ({
        ...prev,
        avatar: lang === "en" ? "Only JPG, PNG or WebP accepted" : "Solo JPG, PNG o WebP",
      }));
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setProfileErrors((prev) => { const e = { ...prev }; delete e.avatar; return e; });
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setAvatarUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Save profile ────────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!username.trim())
      errors.username = lang === "en" ? "Username is required" : "El nombre de usuario es requerido";
    if (username.trim().length < 3)
      errors.username = lang === "en" ? "At least 3 characters" : "Al menos 3 caracteres";
    if (Object.keys(errors).length) { setProfileErrors(errors); return; }
    setProfileSave("saving");

    try {
      // TODO: if avatarFile, upload to S3 and get the URL back first
      // const uploadedUrl = await uploadAvatar(avatarFile);

      await updateUserAttributes({
        userAttributes: {
          preferred_username: username.trim(),
          ...(displayName.trim() && { name: displayName.trim() }),
          // ...(uploadedUrl && { picture: uploadedUrl }),
        },
      });

      setUser((prev : User | null ) => prev ? {
        ...prev,
        username:    username.trim(),
        displayName: displayName.trim() || username.trim(),
        avatarUrl:   avatarPreview ?? avatarUrl,
      } : prev);

      setProfileSave("saved");
      setTimeout(() => setProfileSave("idle"), 2500);
    } catch (err: any) {
      console.error(err);
      setProfileSave("error");
      setTimeout(() => setProfileSave("idle"), 2500);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!currentPw)
      errors.currentPw = lang === "en" ? "Enter your current password" : "Ingresá tu contraseña actual";
    if (newPw.length < 8)
      errors.newPw     = lang === "en" ? "Minimum 8 characters"        : "Mínimo 8 caracteres";
    if (newPw !== confirmPw)
      errors.confirmPw = lang === "en" ? "Passwords don't match"       : "Las contraseñas no coinciden";
    if (Object.keys(errors).length) { setSecErrors(errors); return; }
    setSecSave("saving");

    try {
      await updatePassword({ oldPassword: currentPw, newPassword: newPw });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setSecSave("saved");
      setTimeout(() => setSecSave("idle"), 2500);
    } catch (err: any) {
      setSecErrors({ currentPw: err.message ?? (lang === "en" ? "Incorrect password" : "Contraseña incorrecta") });
      setSecSave("error");
      setTimeout(() => setSecSave("idle"), 2500);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotifSave("saving");
    // TODO: PATCH /api/user/notifications with prefs
    await new Promise((r) => setTimeout(r, 800));
    setNotifSave("saved");
    setTimeout(() => setNotifSave("idle"), 2500);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== (user?.username ?? "")) {
      setDeleteError(lang === "en" ? "Username doesn't match" : "El nombre de usuario no coincide");
      return;
    }
    setDeleting(true);
    try {
      await deleteUser();
      setUser(null);
      navigate("/");
    } catch (err: any) {
      setDeleteError(err.message ?? (lang === "en" ? "Could not delete account" : "No se pudo eliminar la cuenta"));
      setDeleting(false);
    }
  };

  const strength = passwordStrength(newPw);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile",       label: lang === "en" ? "Profile"       : "Perfil",           icon: <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx={12} cy={7} r={4}/></svg> },
    { id: "security",      label: lang === "en" ? "Security"      : "Seguridad",        icon: <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x={3} y={11} width={18} height={11} rx={2}/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
    { id: "notifications", label: lang === "en" ? "Notifications" : "Notificaciones",   icon: <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
    { id: "danger",        label: lang === "en" ? "Account"       : "Cuenta",           icon: <svg xmlns="http://www.w3.org/2000/svg" width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx={12} cy={12} r={10}/><line x1={12} y1={8} x2={12} y2={12}/><line x1={12} y1={16} x2={12} y2={16}/></svg> },
  ];

  const displayAvatar = avatarPreview ?? avatarUrl;
  const initial       = (user?.displayName ?? user?.username ?? "U")[0].toUpperCase();

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-black pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(167,139,250,1) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-700 opacity-[0.04] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6">

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <Link to={isDev ? `/user/developer/${user?.sub}` : "/user/business"} className="text-[10px] font-black tracking-widest uppercase text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="15 18 9 12 15 6"/></svg>
                {lang === "en" ? "Dashboard" : "Panel"}
              </Link>
              <span className="text-gray-700 text-[10px]">/</span>
              <span className="text-[10px] font-black tracking-widest uppercase text-gray-600">
                {lang === "en" ? "Settings" : "Ajustes"}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {lang === "en" ? "Account settings" : "Configuración de cuenta"}
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">

            <div className="flex lg:flex-col gap-1 flex-wrap lg:flex-nowrap">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase text-left transition-all border ${
                    tab === t.id
                      ? `border-violet-600/50 bg-violet-950/30 text-violet-300 ${t.id === "danger" ? "border-red-800/50 bg-red-950/20 text-red-400" : ""}`
                      : `border-transparent text-gray-600 hover:text-gray-300 hover:bg-violet-950/10 ${t.id === "danger" ? "hover:text-red-400" : ""}`
                  }`}
                >
                  <span className={tab === t.id ? (t.id === "danger" ? "text-red-400" : "text-violet-400") : "text-gray-700"}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-6">

              {tab === "profile" && (
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-6" noValidate>
                  <SectionCard
                    title={lang === "en" ? "Public profile" : "Perfil público"}
                    sub={lang === "en" ? "This is how you appear to other users on the platform." : "Así aparecés ante otros usuarios de la plataforma."}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                      <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-xl border border-violet-700/50 bg-violet-900/30 overflow-hidden flex items-center justify-center text-2xl font-black text-violet-300">
                          {displayAvatar ? (
                            <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : initial}
                        </div>
                        {displayAvatar && (
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-600 hover:bg-red-500 border border-red-500 flex items-center justify-center transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width={9} height={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}><line x1={18} y1={6} x2={6} y2={18}/><line x1={6} y1={6} x2={18} y2={18}/></svg>
                          </button>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 border border-violet-700/50 hover:border-violet-500 text-violet-300 font-black text-xs tracking-widest uppercase rounded transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1={12} y1={3} x2={12} y2={15}/></svg>
                          {lang === "en" ? "Upload photo" : "Subir foto"}
                        </button>
                        <p className="text-[10px] text-gray-600">
                          {lang === "en" ? "JPG, PNG or WebP · Max 5 MB · Recommended 400×400px" : "JPG, PNG o WebP · Máx 5 MB · Recomendado 400×400px"}
                        </p>
                        {profileErrors.avatar && <p className="text-[10px] text-red-400">{profileErrors.avatar}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <FieldLabel label={lang === "en" ? "Username" : "Nombre de usuario"} required />
                        <TextInput
                          value={username}
                          onChange={setUsername}
                          placeholder="@handle"
                          maxLength={30}
                          error={profileErrors.username}
                        />
                        <p className="mt-1 text-[10px] text-gray-600">
                          {lang === "en" ? "Visible in your public profile URL" : "Visible en la URL de tu perfil público"}
                        </p>
                      </div>
                      <div>
                        <FieldLabel label={lang === "en" ? "Display name" : "Nombre para mostrar"} hint={lang === "en" ? "Optional" : "Opcional"} />
                        <TextInput
                          value={displayName}
                          onChange={setDisplayName}
                          placeholder={lang === "en" ? "Your full name or alias" : "Tu nombre completo o alias"}
                          maxLength={50}
                        />
                      </div>
                    </div>

                    <div className="mt-5">
                      <FieldLabel label="Email" />
                      <TextInput
                        value={user?.email ?? ""}
                        onChange={() => {}}
                        disabled
                        placeholder="email@example.com"
                      />
                      <p className="mt-1 text-[10px] text-gray-600">
                        {lang === "en" ? "Email cannot be changed here. Contact support to update it." : "El email no se puede cambiar aquí. Contactá soporte para actualizarlo."}
                      </p>
                    </div>
                  </SectionCard>

                  <div className="flex justify-end">
                    <SaveButton
                      state={profileSave}
                      label_idle={lang === "en" ? "Save profile"  : "Guardar perfil"}
                      label_saving={lang === "en" ? "Saving…"     : "Guardando…"}
                      label_saved={lang === "en" ? "Saved!"       : "¡Guardado!"}
                      label_error={lang === "en" ? "Error"        : "Error"}
                    />
                  </div>
                </form>
              )}

              {tab === "security" && (
                <form onSubmit={handleSavePassword} className="flex flex-col gap-6" noValidate>
                  <SectionCard
                    title={lang === "en" ? "Change password" : "Cambiar contraseña"}
                    sub={lang === "en" ? "Choose a strong password that you don't use anywhere else." : "Elegí una contraseña fuerte que no uses en ningún otro lado."}
                  >
                    <div className="flex flex-col gap-5">
                      <div>
                        <FieldLabel label={lang === "en" ? "Current password" : "Contraseña actual"} required />
                        <div className="relative">
                          <TextInput
                            type={showPws ? "text" : "password"}
                            value={currentPw}
                            onChange={setCurrentPw}
                            placeholder="••••••••"
                            error={secErrors.currentPw}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPws(!showPws)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors"
                          >
                            {showPws
                              ? <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1={1} y1={1} x2={23} y2={23}/></svg>
                              : <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx={12} cy={12} r={3}/></svg>
                            }
                          </button>
                        </div>
                      </div>

                      <div>
                        <FieldLabel label={lang === "en" ? "New password" : "Nueva contraseña"} required />
                        <TextInput
                          type={showPws ? "text" : "password"}
                          value={newPw}
                          onChange={setNewPw}
                          placeholder="••••••••"
                          error={secErrors.newPw}
                        />
                        {newPw.length > 0 && (
                          <div className="mt-2 flex flex-col gap-1.5">
                            <div className="flex gap-1">
                              {[0, 1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                    i < strength.score ? strength.color : "bg-violet-900/40"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-600">
                              {lang === "en" ? strength.label_en : strength.label_es}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <FieldLabel label={lang === "en" ? "Confirm new password" : "Confirmar nueva contraseña"} required />
                        <TextInput
                          type={showPws ? "text" : "password"}
                          value={confirmPw}
                          onChange={setConfirmPw}
                          placeholder="••••••••"
                          error={secErrors.confirmPw}
                        />
                      </div>

                      <ul className="text-[10px] text-gray-600 flex flex-col gap-1 leading-relaxed">
                        {[
                          lang === "en" ? "At least 8 characters" : "Al menos 8 caracteres",
                          lang === "en" ? "One uppercase letter"  : "Una letra mayúscula",
                          lang === "en" ? "One number"            : "Un número",
                          lang === "en" ? "One special character" : "Un carácter especial",
                        ].map((req) => (
                          <li key={req} className="flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-gray-700 shrink-0" />{req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </SectionCard>

                  <div className="flex justify-end">
                    <SaveButton
                      state={secSave}
                      label_idle={lang === "en" ? "Update password"   : "Actualizar contraseña"}
                      label_saving={lang === "en" ? "Updating…"       : "Actualizando…"}
                      label_saved={lang === "en" ? "Password updated" : "Contraseña actualizada"}
                      label_error={lang === "en" ? "Error — try again" : "Error — intentá de nuevo"}
                    />
                  </div>
                </form>
              )}

              {tab === "notifications" && (
                <form onSubmit={handleSaveNotifications} className="flex flex-col gap-6" noValidate>
                  <SectionCard
                    title={lang === "en" ? "Email notifications" : "Notificaciones por email"}
                    sub={lang === "en" ? "Choose which emails you'd like to receive from Kustom." : "Elegí qué emails querés recibir de Kustom."}
                  >
                    <div className="flex flex-col gap-5">
                      <Toggle
                        checked={notifProposals}
                        onChange={setNotifProposals}
                        label={lang === "en" ? "New proposals"   : "Nuevas propuestas"}
                        sub={lang === "en"  ? "When a developer submits a proposal on your project"  : "Cuando un desarrollador envía una propuesta a tu proyecto"}
                      />
                      <div className="h-px bg-violet-900/30" />
                      <Toggle
                        checked={notifMessages}
                        onChange={setNotifMessages}
                        label={lang === "en" ? "Direct messages"  : "Mensajes directos"}
                        sub={lang === "en"  ? "When someone sends you a message on the platform"     : "Cuando alguien te envía un mensaje en la plataforma"}
                      />
                      <div className="h-px bg-violet-900/30" />
                      <Toggle
                        checked={notifUpdates}
                        onChange={setNotifUpdates}
                        label={lang === "en" ? "Project updates"  : "Actualizaciones de proyecto"}
                        sub={lang === "en"  ? "Milestone completions, status changes, and reviews"   : "Hitos completados, cambios de estado y revisiones"}
                      />
                      <div className="h-px bg-violet-900/30" />
                      <Toggle
                        checked={notifNewsletter}
                        onChange={setNotifNewsletter}
                        label={lang === "en" ? "Newsletter & tips" : "Newsletter y consejos"}
                        sub={lang === "en"  ? "Platform updates, best practices, and new features"   : "Actualizaciones de la plataforma, buenas prácticas y nuevas funciones"}
                      />
                    </div>
                  </SectionCard>

                  <div className="flex justify-end">
                    <SaveButton
                      state={notifSave}
                      label_idle={lang === "en" ? "Save preferences" : "Guardar preferencias"}
                      label_saving={lang === "en" ? "Saving…"        : "Guardando…"}
                      label_saved={lang === "en" ? "Saved!"          : "¡Guardado!"}
                      label_error={lang === "en" ? "Error"           : "Error"}
                    />
                  </div>
                </form>
              )}

              {tab === "danger" && (
                <div className="flex flex-col gap-6">
                  {/* Sign out all devices */}
                  <SectionCard title={lang === "en" ? "Sign out everywhere" : "Cerrar sesión en todos lados"}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                        {lang === "en"
                          ? "Sign out of all active sessions across all devices. You'll need to log in again."
                          : "Cerrá sesión en todas las sesiones activas en todos los dispositivos. Tendrás que volver a iniciar sesión."}
                      </p>
                      <button
                        type="button"
                        onClick={async () => {
                          await signOut({ global: true });
                          setUser(null);
                          navigate("/login");
                        }}
                        className="shrink-0 px-4 py-2.5 border border-amber-700/50 hover:border-amber-600 text-amber-400 hover:text-amber-300 font-black text-xs tracking-widest uppercase rounded transition-all"
                      >
                        {lang === "en" ? "Sign out all" : "Cerrar todo"}
                      </button>
                    </div>
                  </SectionCard>

                  <div className="relative border border-red-900/40 bg-red-950/10 rounded-xl overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-700/40 to-transparent" />
                    <div className="px-6 pt-5 pb-4 border-b border-red-900/30">
                      <h2 className="text-sm font-black text-red-300 tracking-tight">
                        {lang === "en" ? "Delete account" : "Eliminar cuenta"}
                      </h2>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        {lang === "en" ? "This action is permanent and cannot be undone." : "Esta acción es permanente y no se puede deshacer."}
                      </p>
                    </div>
                    <div className="p-6 flex flex-col gap-4">
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {lang === "en"
                          ? "Deleting your account will permanently remove all your data, projects, proposals, and messages. Any pending payouts will be processed before deletion."
                          : "Eliminar tu cuenta eliminará permanentemente todos tus datos, proyectos, propuestas y mensajes. Los pagos pendientes serán procesados antes de la eliminación."}
                      </p>
                      <div>
                        <FieldLabel
                          label={lang === "en"
                            ? `Type your username to confirm: "${user?.username ?? ""}"`
                            : `Escribí tu nombre de usuario para confirmar: "${user?.username ?? ""}"`}
                        />
                        <TextInput
                          value={deleteConfirm}
                          onChange={(v) => { setDeleteConfirm(v); setDeleteError(""); }}
                          placeholder={user?.username ?? ""}
                          error={deleteError}
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleDeleteAccount}
                          disabled={deleting || deleteConfirm !== (user?.username ?? "")}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-700 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-xs tracking-[0.2em] uppercase rounded transition-all"
                        >
                          {deleting && <span className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />}
                          {lang === "en" ? "Delete my account" : "Eliminar mi cuenta"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;