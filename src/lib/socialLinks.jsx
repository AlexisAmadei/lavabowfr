import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faBandcamp, faDeezer, faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";
import {
  FaApple,
  FaBandcamp,
  FaInstagram,
  FaSquareFacebook,
  FaYoutube
} from "react-icons/fa6";

export const socialLinks = [
  { name: 'instagram', url: 'https://www.instagram.com/lava_bow/', icon: FaInstagram },
  { name: 'facebook', url: 'https://www.facebook.com/lavabow', icon: FaSquareFacebook },
  { name: 'youtube', url: 'https://www.youtube.com/@lavabow', icon: FaYoutube },
  { name: 'bandcamp', url: '#', icon: FaBandcamp },
  { name: 'apple', url: '#', icon: FaApple },
  { name: 'deezer', url: '#', icon: () => <FontAwesomeIcon icon={faDeezer} /> },
  { name: 'spotify', url: 'https://open.spotify.com/artist/54Y8JDIfmIb2zlHrB2ZoVF', icon: () => <FontAwesomeIcon icon={faSpotify} /> },
];

export const musicLinks = [
  { name: 'youtube', url: 'https://www.youtube.com/@lavabow', icon: () => <FontAwesomeIcon icon={faYoutube} size='2xl' /> },
  { name: 'bandcamp', url: '#', icon: () => <FontAwesomeIcon icon={faBandcamp} size='2xl' /> },
  { name: 'apple', url: '#', icon: () => <FontAwesomeIcon icon={faApple} size='2xl' /> },
  { name: 'deezer', url: '#', icon: () => <FontAwesomeIcon icon={faDeezer} size='2xl' /> },
  { name: 'spotify', url: 'https://open.spotify.com/artist/54Y8JDIfmIb2zlHrB2ZoVF', icon: () => <FontAwesomeIcon icon={faSpotify} size='2xl' /> },
]