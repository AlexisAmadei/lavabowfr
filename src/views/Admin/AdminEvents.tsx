import LavaButton from '@/components/Design/LavaButton'
// @ts-ignore
import LavaTypo from '@/components/Design/LavaTypo'
import { EventItem } from '@/types/types'
import { fetchEventsContent, insertEventItem } from '@/utils/supabase'
import { Box, Button, Dialog, Field, Fieldset, Flex, Input, Portal } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { BsPlusCircleFill } from 'react-icons/bs'

export default function AdminEvents() {
  const [events, setEvents] = React.useState<EventItem[]>([])
  const [open, setOpen] = React.useState(false)
  const [newEventItem, setNewEventItem] = React.useState<EventItem>({
    title: '',
    description: '',
    price: 0,
    date: '',
    place: '',
    link: '',
  });

  const handleAddEventItem = async () => {
    setOpen(false);
    await insertEventItem(newEventItem);
    fetchEventsContent(setEvents);

    // Reset form
    setNewEventItem({
      title: '',
      description: '',
      price: 0,
      date: '',
      place: '',
      link: '',
    });
  };

  useEffect(() => {
    fetchEventsContent(setEvents);
  }, [])

  return (
    <Box direction={'column'}>
      <Flex mb={4} justifyContent={'space-between'} alignItems={'center'}>
        <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '16px', textAlign: 'left' }}>Events</LavaTypo>
        <LavaButton variant={'filled'} onClick={() => setOpen(true)}>
          <BsPlusCircleFill /> Ajouter un élément
        </LavaButton>
      </Flex>

      <Flex
        direction={'row'}
        gap={2}
        flexWrap={'wrap'}
        textAlign={'left'}
        justifyContent={'space-between'}
      >
        {events.length === 0 && (
          <LavaTypo variant={'body'} styles={{ color: 'black' }} size={'16px'}>
            Aucun event disponible. Ajoutez-en un en cliquant sur "Ajouter un élément".
          </LavaTypo>
        )}
      </Flex>

      <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)} placement={'center'}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title color={'black'}>Ajouter un Event</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body color={'black'}>
                <Fieldset.Root>
                  <Fieldset.Content gap={1}>
                    <Field.Root>
                      <Field.Label>Titre</Field.Label>
                      <Input
                        title='Titre'
                        placeholder='Titre'
                        value={newEventItem.title}
                        onChange={(e) => setNewEventItem({ ...newEventItem, title: e.target.value })}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Description</Field.Label>
                      <Input
                        title='Description'
                        placeholder='Description'
                        value={newEventItem.description}
                        onChange={(e) => setNewEventItem({ ...newEventItem, description: e.target.value })}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Prix</Field.Label>
                      <Input
                        title="Prix"
                        placeholder="Prix"
                        type="number"
                        value={newEventItem.price}
                        onChange={(e) => setNewEventItem({ ...newEventItem, price: parseFloat(e.target.value) || 0 })}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Date</Field.Label>
                      <Input
                        title="Date"
                        placeholder="Date"
                        type="datetime-local"
                        value={newEventItem.date}
                        onChange={(e) => setNewEventItem({ ...newEventItem, date: e.target.value })}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Lieu</Field.Label>
                      <Input
                        title="Lieu"
                        placeholder="Lieu"
                        value={newEventItem.place}
                        onChange={(e) => setNewEventItem({ ...newEventItem, place: e.target.value })}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Lien</Field.Label>
                      <Input
                        title="Lien"
                        placeholder="Lien"
                        value={newEventItem.link}
                        onChange={(e) => setNewEventItem({ ...newEventItem, link: e.target.value })}
                      />
                    </Field.Root>
                  </Fieldset.Content>

                  <Button variant={'subtle'} colorPalette={'green'} onClick={handleAddEventItem}>
                    Ajouter l'Event
                  </Button>
                </Fieldset.Root>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  )
}
