import { Box, Flex } from '@chakra-ui/react';
import AdminSpotlight from './Content/AdminSpotlight';
import AdminEvents from './Content/AdminEvents';
import AdminPictures from './Content/AdminPictures';
import AdminClicks from './Content/AdminClicks';
import AdminVideos from './Content/AdminVideos';
import LavaTypo from '@/components/Design/LavaTypo';
import LavaButton from '@/components/Design/LavaButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

export default function AdminContent() {
  const [openDialog, setOpenDialog] = React.useState<string | null>(null);

  const ELEMENTS = [
    { id: 'spotlight', name: 'Spotlight', element: <AdminSpotlight open={openDialog === 'spotlight'} setOpen={(open) => setOpenDialog(open ? 'spotlight' : null)} /> },
    { id: 'events', name: 'Événements', element: <AdminEvents open={openDialog === 'events'} setOpen={(open) => setOpenDialog(open ? 'events' : null)} /> },
    { id: 'pictures', name: 'Photos', element: <AdminPictures open={openDialog === 'pictures'} setOpen={(open) => setOpenDialog(open ? 'pictures' : null)} /> },
    { id: 'clicks', name: 'Clics', element: <AdminClicks open={openDialog === 'clicks'} setOpen={(open) => setOpenDialog(open ? 'clicks' : null)} /> },
    { id: 'videos', name: 'Vidéos', element: <AdminVideos open={openDialog === 'videos'} setOpen={(open) => setOpenDialog(open ? 'videos' : null)} /> },
  ]

  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
      {ELEMENTS.map(el => (
        <Box direction={'column'} key={el.id}>
          <Flex mb={4} justifyContent={'space-between'} alignItems={'center'}>
            <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '8px', textAlign: 'left' }}>{el.name}</LavaTypo>
            <LavaButton variant={'filled'} onClick={() => setOpenDialog(el.id)}>
              <FontAwesomeIcon icon={faPlusCircle} /> Ajouter un élément
            </LavaButton>
          </Flex>

          <React.Fragment>
            {el.element}
          </React.Fragment>
        </Box>
      ))}
    </Box>
  )
}