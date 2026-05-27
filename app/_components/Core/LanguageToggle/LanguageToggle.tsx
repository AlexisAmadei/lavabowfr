import 'flag-icons/css/flag-icons.min.css';
import { useTranslation } from '@/i18n/useTranslation';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useTranslation();
  const nextCode = language === 'fr' ? 'gb' : 'fr';
  const nextLabel = language === 'fr' ? 'EN' : 'FR';

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={`Switch language to ${nextLabel}`}
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 1100,
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        border: '2px solid white',
        background: 'var(--main-accent, #ED00E1)',
        padding: 0,
        overflow: 'hidden',
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
      <span
        className={`fi fi-${nextCode}`}
        style={{
          width: '100%',
          height: '100%',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%',
        }}
      />
    </button>
  );
}
