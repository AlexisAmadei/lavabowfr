import { Box, Flex } from '@chakra-ui/react'
import LavaTypo from '@/components/Design/LavaTypo'
import aboutSection from '@/assets/img/about-section.webp'
import './styles/AboutSection.css'
import useIsMobile from '../../hooks/useIsMobile'
import Section from '../Design/Section'

export default function AboutSection() {
  const isMobile = useIsMobile();

  return (
    <Section id='about' contained={true} title={'“All is about THA Pink Poney”'}>
      <Flex
        className='about-section'
        direction={'column'}
        alignItems={'flex-start'}
        textAlign={'center'}
        width={'100%'}
      >

        <Flex gap={16} direction={isMobile ? 'column' : 'row'} width={'100%'}>
          <Box flexBasis={'2/3'}>
            <LavaTypo variant='p' textAlign={isMobile ? 'center' : 'left'}>
              Lava Bow, c’est un <LavaTypo variant={'accent'}>trio de rock alternatif</LavaTypo> né à Asnières-sur-Seine, aux frontières du chaos sonore et de l’intime viscéral. Composé de Côme (guitare/chant), Sam (violoncelle/chant) et Alexis (batterie). Le groupe décide de <LavaTypo variant={'accent'}>casser les codes du rock traditionnel</LavaTypo> avec une formule audacieuse : <LavaTypo variant={'accent'}>pas de basse, mais un violoncelle amplifié et malmené</LavaTypo>, qui tient autant le groove que les envolées lyriques.
              <br /><br />

              Naviguant entre <LavaTypo variant={'bold'}>punk progressif, grunge poétique et rock abrasif</LavaTypo>, Lava Bow construit un univers brut et fantaisiste influencé par Nirvana, les Beatles, Red Hot Chili Peppers ou encore Slift. Le groupe développe sa <LavaTypo variant={'accent'}>signature unique mêlant riffs rageurs, chant habité, rythmiques puissantes et textures inattendues</LavaTypo>. Lava Bow se définit aujourd’hui comme un groupe de Post Alternative Progressive Punk (globalement, ils ont beaucoup d’inspiration).
              <br /><br />

              Depuis leur début en 2017, ils ont sorti <LavaTypo variant='accent'>trois projets</LavaTypo>, une demo DIY enregistrée dans leur chambre d’ado, puis ensuite leur <LavaTypo variant='accent'>premier album studio “Mirrors”</LavaTypo>. Leur dernier projet date de 2020 avec leur <LavaTypo variant='accent'>EP “Attention aux raccourcis”</LavaTypo>.
              <br /><br />

              Depuis 2020, Lava Bow enchaîne les concerts en région parisienne avec une énergie communicative, des shows intenses et une <LavaTypo variant={'accent'}>proximité désinhibée</LavaTypo> avec le public. Leurs compositions traitent de l’aliénation contemporaine, des rêves bizarres et de l’absurde quotidien, le tout avec une bonne dose d’autodérision.
              <br /><br />

              En 2025, ils sortent une live session (<LavaTypo variant={'accent'}>“LAVA SESSION #1”</LavaTypo>) qui capture leur volonté de se réinventer sans cesse. On y retrouve notamment leur nouveau single <LavaTypo variant={'accent'}>“Big Fish”</LavaTypo>, annonciateur d'un album pour le printemps 2026, un revival de leur première sortie studio <LavaTypo variant={'accent'}>“Horse Pink Poney?!”</LavaTypo> et une reprise grinçante de <LavaTypo variant={'accent'}>“I Shot the Sheriff”</LavaTypo>.
              <br /><br />

              En bref, Lava Bow, c’est une proposition live radicale et libre, à contre-courant des formats policés. Leur mot d’ordre : <LavaTypo variant={'accent'}>“All is about tha pink poney”</LavaTypo>.
            </LavaTypo>
          </Box>

          <Box className='about-section-image' border={'none'} overflow={'hidden'} flexBasis={'1/3'}>
            <img src={aboutSection} alt="About Lava Bow" />
          </Box>
        </Flex>
      </Flex>
    </Section>
  )
}
