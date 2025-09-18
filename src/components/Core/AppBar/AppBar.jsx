import React from 'react'
import LavaButton from '@/components/Design/LavaButton'
import LavaTypo from '@/components/Design/LavaTypo'
import { AbsoluteCenter, Box, Flex } from '@chakra-ui/react'
import './AppBar.css'
import { ArrowIcon } from '@/components/Design/Icons'
import Logo from '../../Design/Logo'
import useIsMobile from '../../../hooks/useIsMobile'

export default function AppBar() {
    const menuItems = [
        { name: 'About us', link: '#about', variant: 'outlined' },
        { name: 'Music', link: '#music', variant: 'outlined' },
        { name: 'Next events', link: '#events', variant: 'outlined' },
        { name: 'Videos', link: '#videos', variant: 'outlined' },
        { name: 'Photos', link: '#photos', variant: 'outlined' },
        { name: 'Contact', link: '#contact', variant: 'filled', endIcon: ArrowIcon },
    ]
    const isMobile = useIsMobile();

    return (
        <AbsoluteCenter className='app-bar'
            axis={'horizontal'}
            direction={'row'}
            mt={6}
            width={'100%'}
        >
            {!isMobile ? (
                <Flex gap={4}>
                    {menuItems.map(item => (
                        <LavaButton key={item.name} variant={item.variant} className="app-bar__button" onClick={() => {
                            const section = document.querySelector(item.link)
                            section.scrollIntoView({ behavior: 'smooth' })
                        }}>
                            <LavaTypo variant='text'>{item.name}</LavaTypo>
                            {item.endIcon && (
                                <span className="app-bar__icon-on-hover">
                                    <item.endIcon />
                                </span>
                            )}
                        </LavaButton>
                    ))}
                </Flex>
            ) : (
                <Flex
                    direction={'row'}
                    alignItems={'flex-start'}
                    justifyContent={'space-between'}
                    w={'100%'}
                    paddingX={4}
                >
                    <div className="app-bar__logo">
                        <Logo h={50} w={50} />
                    </div>
                    <div className='app-bar__menu-burger'>
                        <LavaTypo variant='h3'>Menu</LavaTypo>
                    </div>
                </Flex>
            )}
        </AbsoluteCenter>
    )
}