import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
import LavaTypo from '@/components/Design/LavaTypo'
import aboutSection from '@/assets/about-section.webp'
import './styles/AboutSection.css'

export default function AboutSection() {
    return (
        <Flex
            className='about-section'
            paddingX={16}
            paddingY={'100px'}
            direction={'column'}
            alignItems={'flex-start'}
            textAlign={'center'}
            maxWidth={1400}
        >
            <LavaTypo variant='h1'>All is about THA Pink Poney</LavaTypo>
            <Flex gap={16}>
                <LavaTypo variant='text'>
                    Lava Bow, c’est un <LavaTypo variant={'accent'}>trio alternatif</LavaTypo> né à Asnières-sur-Seine, aux frontières du chaos sonore et de l’intime viscéral. Composé de Côme (guitare/chant), Sam (violoncelle/chant) et Alexis (batterie), le groupe <LavaTypo variant={'accent'}>casse les codes du rock traditionnel</LavaTypo> avec une formule audacieuse : <LavaTypo variant={'accent'}>pas de basse, mais un violoncelle amplifié et malmené</LavaTypo>, qui tient autant le groove que les envolées lyriques.
                    <br /><br />

                    Naviguant entre <LavaTypo variant={'bold'}>punk progressif, grunge poétique et rock abrasif</LavaTypo>, Lava Bow construit un univers brut, presque scénique, où chaque morceau est une montée en tension. Influencés par Nirvana, The Clash, les Red Hot Chili Peppers ou encore System of a Down, le groupe développe une <LavaTypo variant={'accent'}>signature unique mêlant riffs rageurs, chant habité, rythmiques puissantes et textures inattendues</LavaTypo>. Lava Bow se définit aujourd’hui comme un groupe de Post Alternative Progressive Punk Experimental Blues (globalement, ils ont beaucoup d’inspiration).
                    <br /><br />

                    Depuis leur début en 2017, ils ont sorti <LavaTypo variant='accent'>trois projets</LavaTypo>, un premier album encore enregistré dans leur chambre d’ado. Puis ensuite leur <LavaTypo variant='accent'>premier album studio “Mirrors”</LavaTypo>. Leur dernier projet date de 2020 avec leur <LavaTypo variant='accent'>EP “Attention aux raccourcis”</LavaTypo>.
                    <br /><br />
                    Depuis 2020, Lava Bow enchaîne les scènes indépendantes de la région parisienne avec une énergie communicative, des shows intenses et une relation directe avec le public. Leurs titres, souvent composés à trois voix, traitent de l’aliénation contemporaine, des rêves bizarres et de l’absurde quotidien, le tout avec une bonne dose d’autodérision.
                    <br /><br />

                    En 2025, ils sortent une live session (“LAVA SESSION #1”), enregistré en conditions réelles, qui capture toute l’urgence et la sincérité du trio. On y retrouve notamment “Big Fish”, “Horse Pink Poney?!” et une reprise grinçante de “I Shot the Sheriff”.
                    Plus tard, ils sortiront la version studio de <LavaTypo variant='accent'>Big Fish leur dernier single sortie à ce jour</LavaTypo>.
                    <br /><br />

                    Lava Bow, c’est une proposition live radicale et libre, à contre-courant des formats policés. Leur mot d’ordre : <LavaTypo variant={'accent'}>“All is about tha pink poney”</LavaTypo>.
                </LavaTypo>
                <Box className='about-section-image'>
                    <img src={aboutSection} alt="About Lava Bow" />
                </Box>
            </Flex>
        </Flex>
    )
}
