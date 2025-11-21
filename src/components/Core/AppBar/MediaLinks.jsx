import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faBandcamp, faDeezer, faFacebook, faInstagram, faSpotify, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Flex } from "@chakra-ui/react";

export default function MediaLinks({ content = 'all', size = '1x', color = 'var(--Background-bg-brand)', padding = '12px' }) {
  const links = [
    { name: 'instagram', url: 'https://www.instagram.com/lava_bow/', icon: () => <FontAwesomeIcon icon={faInstagram} size={size} color={color} />, content: 'social' },
    { name: 'facebook', url: 'https://www.facebook.com/lavabow', icon: () => <FontAwesomeIcon icon={faFacebook} size={size} color={color} />, content: 'social' },
    { name: 'youtube', url: 'https://www.youtube.com/@lavabow', icon: () => <FontAwesomeIcon icon={faYoutube} size={size} color={color} />, content: 'media' },
    { name: 'bandcamp', url: '#', icon: () => <FontAwesomeIcon icon={faBandcamp} size={size} color={color} />, content: 'media' },
    { name: 'apple', url: '#', icon: () => <FontAwesomeIcon icon={faApple} size={size} color={color} />, content: 'media' },
    { name: 'deezer', url: '#', icon: () => <FontAwesomeIcon icon={faDeezer} size={size} color={color} />, content: 'media' },
    { name: 'spotify', url: 'https://open.spotify.com/artist/54Y8JDIfmIb2zlHrB2ZoVF', icon: () => <FontAwesomeIcon icon={faSpotify} size={size} color={color} />, content: 'media' },
  ]
  const filteredLinks = content === 'all' ? links : links.filter(link => link.content === content);

  return (
    <Flex direction={'row'} gap={3} alignItems={'center'}>
      {filteredLinks.map((item) => (
        <div key={item.name}
          style={{
            backgroundColor: 'white',
            padding: padding,
            borderRadius: '50px',
            cursor: 'pointer',
            color: 'var(--Background-bg-brand)',
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease',
            height: 'fit-content',
            width: 'fit-content',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onClick={() => window.open(item.url, '_blank')}
        >
          <item.icon />
        </div>
      ))}
    </Flex>
  )
}