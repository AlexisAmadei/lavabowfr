import { useTranslation } from '@/i18n/useTranslation';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useTranslation();
  const next = language === 'fr' ? 'EN' : 'FR';

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={`Switch language to ${next}`}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 1100,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        border: '2px solid white',
        background: 'var(--main-accent, #ED00E1)',
        color: 'white',
        fontWeight: 800,
        fontSize: '16px',
        letterSpacing: '0.5px',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {next}
    </button>
  );
}
