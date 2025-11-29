import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const menuItems = [
  { name: 'À propos', link: '#about', variant: 'outlined' },
  { name: 'Musique', link: '#music', variant: 'outlined' },
  { name: 'Concerts', link: '#events', variant: 'outlined' },
  { name: 'Vidéos', link: '#videos', variant: 'outlined' },
  { name: 'Photos', link: '#photos', variant: 'outlined' },
  { name: 'Contact', link: '#contact', variant: 'filled', icon: () => <FontAwesomeIcon icon={faArrowRightLong} /> },
]

export default menuItems