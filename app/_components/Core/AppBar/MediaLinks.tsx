import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faApple, faBandcamp, faDeezer, faFacebook, faInstagram, faSpotify, faTidal, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { Flex } from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";

type MediaLinksProps = {
  content?: string;
  size?: SizeProp;
  color?: string;
  padding?: string;
}

export default function MediaLinks({ content = 'all', size = '1x', color = 'var(--Background-bg-brand)', padding = '12px' }: MediaLinksProps) {
  const links = [
    { name: 'instagram', url: 'https://www.instagram.com/lava_bow/', icon: () => <FontAwesomeIcon icon={faInstagram} size={size} color={color} />, content: 'social' },
    { name: 'facebook', url: 'https://www.facebook.com/lavabow', icon: () => <FontAwesomeIcon icon={faFacebook} size={size} color={color} />, content: 'social' },
    { name: 'bandcamp', url: 'https://lavabow.bandcamp.com/', icon: () => <FontAwesomeIcon icon={faBandcamp} size={size} color={color} />, content: 'media' },
    { name: 'tidal', url: 'https://tidal.com/artist/19816420', icon: () => <FontAwesomeIcon icon={faTidal} size={size} color={color} />, content: 'media' },
    { name: 'deezer', url: 'https://link.deezer.com/s/31FDlb4MIPSBsH6Nfnxdl', icon: () => <FontAwesomeIcon icon={faDeezer} size={size} color={color} />, content: 'media' },
    { name: 'apple', url: 'https://music.apple.com/fr/artist/lava-bow/1516017856', icon: () => <FontAwesomeIcon icon={faApple} size={size} color={color} />, content: 'media' },
    { name: 'youtube', url: 'https://www.youtube.com/@LavaBow', icon: () => <FontAwesomeIcon icon={faYoutube} size={size} color={color} />, content: 'media' },
    { name: "Slopify", url: 'https://open.spotify.com/artist/54Y8JDIfmIb2zlHrB2ZoVF', icon: () => <FontAwesomeIcon icon={faSpotify} size={size} color={'gray'} />, content: 'media' },
  ]
  const filteredLinks = content === 'all' ? links : links.filter(link => link.content === content);

  return (
    <Flex direction={'row'} gap={3} alignItems={'center'}>
      {filteredLinks.map((item) => (
        <Tooltip content={item.name.charAt(0).toUpperCase() + item.name.slice(1)} key={item.name} lazyMount openDelay={0}>
          <a key={item.name}
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
          </a>
        </Tooltip>
      ))}
    </Flex>
  )
}