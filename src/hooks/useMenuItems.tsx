import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import type { MenuItem } from '@/lib/menuItems';

export default function useMenuItems(): MenuItem[] {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        name: t.menu.contact,
        link: '#contact',
        variant: 'filled',
        icon: () => <FontAwesomeIcon icon={faArrowRightLong} />,
      },
      {
        name: t.menu.home,
        link: '/',
        variant: 'outlined',
      },
      {
        name: t.menu.shop,
        link: 'shop',
        variant: 'outlined',
      },
      {
        name: t.menu.menuLabel,
        link: '#about',
        variant: 'outlined',
        subItems: [
          { name: t.menu.about, link: '#about', variant: 'outlined' },
          { name: t.menu.music, link: '#music', variant: 'outlined' },
          { name: t.menu.events, link: '#events', variant: 'outlined' },
          { name: t.menu.videos, link: '#videos', variant: 'outlined' },
          { name: t.menu.photos, link: '#photos', variant: 'outlined' },
        ],
      },
    ],
    [t]
  );
}
