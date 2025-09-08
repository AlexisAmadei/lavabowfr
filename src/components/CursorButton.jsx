import React from 'react'
import LavaButton from './Design/LavaButton'
import LavaTypo from './Design/LavaTypo'
import { FaPlay } from 'react-icons/fa';

export default function CursorButton() {
    return (
    <LavaButton variant={'classic'}>
        <FaPlay />
        <LavaTypo>Voir le clip</LavaTypo>
    </LavaButton>
  )
}
