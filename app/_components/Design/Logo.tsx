// import logo from '@/assets/icons/logo.svg'
import logo from '@/assets/icons/logo_lcb.png'
import { Box } from '@chakra-ui/react';

export default function Logo({ h, w }: { h?: string; w?: string }) {
  return (
    <Box borderRadius={'50%'} overflow={'hidden'} display={'inline-flex'} alignItems={'center'} justifyContent={'center'}>
      <img className='lvb-logo' src={logo.src} alt="Logo" height={h} width={w} title="Logo" />
    </Box>
  )
}
