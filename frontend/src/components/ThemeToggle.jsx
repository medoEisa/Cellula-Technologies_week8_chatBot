export default function ThemeToggle({ theme, setTheme }) {
    const toggle = () => setTheme(theme === "light" ? "dark" : "light");
    return (
      <button
        onClick={toggle}
        className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    );
  }
  