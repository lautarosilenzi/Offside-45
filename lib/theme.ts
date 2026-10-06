// Modo claro u oscuro (components/ThemeToggle.tsx). La clase "dark" de <html> la pone este script, en el <head>,
// antes de pintar la página: así no hay un destello del modo claro.
export const THEME_KEY = "o45-tema";

export const THEME_SCRIPT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;
