import React from 'react'
import TypoL from '../../assets/typo/filled/L.svg'
import TypoA from '../../assets/typo/filled/A.svg'
import TypoV from '../../assets/typo/filled/V.svg'
import TypoB from '../../assets/typo/filled/B.svg'
import TypoO from '../../assets/typo/filled/O.svg'
import TypoW from '../../assets/typo/filled/W.svg'
import './styles/HeroTypo.css'

export default function HeroTypo() {
    return (
        <div className='hero-typo'>
            <img src={TypoL} alt="L" />
            <img src={TypoA} alt="A" />
            <img src={TypoV} alt="V" />
            <img src={TypoA} alt="A" />
            <img src={TypoB} alt="B" />
            <img src={TypoO} alt="O" />
            <img src={TypoW} alt="W" />
        </div>
    )
}
