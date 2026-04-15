import { Outlet, useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { useLanguageStore } from "@/stores/languageStore";
import { RiTranslate2 } from "react-icons/ri";
import Loading from "@/components/Loading";
import { auth_to_app_navigate } from "@/constant";

export default function AuthLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading, validateToken } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const { languageCode, toggleLanguage, language } = useLanguageStore();

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await validateToken("auth");
      if (valid) {
        if (
          !location.pathname.startsWith(
            "/" + auth_to_app_navigate.split("/")[1],
          )
        ) {
          navigate(auth_to_app_navigate, { replace: true });
        }
      }
    };
    checkAuth();
  }, [validateToken, navigate, location.pathname]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-dark-900 overflow-hidden">
      {/* Language toggle — top right */}
      <button
        onClick={toggleLanguage}
        className="absolute top-5 right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-dark-300 hover:text-foreground hover:bg-dark-700/50 transition-all text-xs font-mono"
        title={language({ id: "Ganti bahasa", en: "Switch language" })}
      >
        <RiTranslate2 className="w-3.5 h-3.5" />
        <span className="uppercase">{languageCode}</span>
      </button>

      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-accent-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-100 h-100 bg-neon-cyan/8 rounded-full blur-[100px]" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <Outlet />
      </div>
    </div>
  );
}
