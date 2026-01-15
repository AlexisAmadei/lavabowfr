import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export interface MenuItem {
  name: string;
  link: string;
  variant: 'filled' | 'outlined';
  subItems?: MenuItem[];
  icon?: React.ComponentType<{ strokeWidth?: number; size?: number }>;
}

const menuItems: MenuItem[] = [
  {
    name: 'À propos',
    link: '#about',
    variant: 'outlined',
    subItems: [
      { name: 'À propos', link: '#about', variant: 'outlined' },
      { name: 'Musique', link: '#music', variant: 'outlined' },
      { name: 'Évènements', link: '#events', variant: 'outlined' },
      { name: 'Vidéos', link: '#videos', variant: 'outlined' },
      { name: 'Photos', link: '#photos', variant: 'outlined' },
    ]
  },
  {
    name: 'Contact',
    link: '#contact',
    variant: 'filled',
    icon: () => <FontAwesomeIcon icon={faArrowRightLong} />
  },
]

export default menuItems