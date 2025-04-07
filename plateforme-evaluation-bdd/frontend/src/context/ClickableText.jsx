import { useTheme } from "../context/ThemeContext";

export default function ClickableText({ 
  id,
  text, 
  effect = "✓", 
  effectDuration = 500,
  className = "",
  children 
}) {
  const { darkMode, registerClickEffect } = useTheme();

  const effectClasses = {
    base: `inline-block ml-1 animate-click-pulse`,
    primary: darkMode ? 'text-primary-light' : 'text-primary-dark',
    secondary: darkMode ? 'text-secondary-light' : 'text-secondary-dark',
    accent: darkMode ? 'text-accent-dark' : 'text-accent-DEFAULT'
  };

  return (
    <span
      className={`text-click-effect ${className} ${
        darkMode ? 'text-dark' : 'text-light'
      } cursor-pointer select-none`}
      onClick={() => registerClickEffect(id, effectDuration)}
    >
      {children || text}
      <span className={`${effectClasses.base} ${effectClasses.accent}`}>
        {effect}
      </span>
    </span>
  );
}