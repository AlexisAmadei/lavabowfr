import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const menuItems = [
  { name: 'About us', link: '#about', variant: 'outlined' },
  { name: 'Music', link: '#music', variant: 'outlined' },
  { name: 'Next events', link: '#events', variant: 'outlined' },
  { name: 'Videos', link: '#videos', variant: 'outlined' },
  { name: 'Photos', link: '#photos', variant: 'outlined' },
  { name: 'Contact', link: '#contact', variant: 'filled', icon: () => <FontAwesomeIcon icon={faArrowRightLong} /> },
]

export default menuItems