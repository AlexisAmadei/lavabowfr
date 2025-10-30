import LavaButton from '@/components/Design/LavaButton'
// @ts-ignore
import LavaTypo from '@/components/Design/LavaTypo'
import { EventItem } from '@/types/types'
import { fetchEventsContent, insertEventItem, updateEventItem } from '@/utils/supabase'
import { Box, DataList, Flex, IconButton, Menu, Portal } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { BsPlusCircleFill, BsThreeDotsVertical } from 'react-icons/bs'
// @ts-ignore
import EditableDataListItem from '@/components/Core/Admin/EditableDataListItem'
import AddEventDialog from '../../components/Core/Admin/AddEventDialog'
// @ts-ignore
import DeleteDialog from '@/components/Core/Admin/DeleteDialog'

export default function AdminEvents() {
  const [events, setEvents] = React.useState<EventItem[]>([])
  const [open, setOpen] = React.useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
  const [itemToDelete, setItemToDelete] = React.useState<number | null>(null);

  const handleAddEventItem = async (newEventItem: EventItem) => {
    setOpen(false);
    await insertEventItem(newEventItem);
    fetchEventsContent(setEvents);
  };

  const handleUpdateField = async (id: number, field: keyof EventItem, value: string | number) => {
    const eventToUpdate = events.find(event => event.id === id);
    if (!eventToUpdate) return;
    const updatedEvent = { ...eventToUpdate, [field]: value };
    await updateEventItem(id, updatedEvent);
    fetchEventsContent(setEvents);
  }

  const handleUpdateStatus = async (id: number, newStatus: 'ACTIVE' | 'INACTIVE') => {
    const eventToUpdate = events.find(event => event.id === id);
    if (!eventToUpdate) return;
    const updatedEvent = { ...eventToUpdate, status: newStatus };
    await updateEventItem(id, updatedEvent);
    fetchEventsContent(setEvents);
  }

  const handleDeleteEventItem = async () => {
    if (itemToDelete === null) return;
    await updateEventItem(itemToDelete, { status: 'DELETED' } as EventItem);
    fetchEventsContent(setEvents);
    setItemToDelete(null);
    setOpenDeleteDialog(false);
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
        {events.length === 0 ? (
          <LavaTypo variant={'body'} styles={{ color: 'black' }} size={'16px'}>
            Aucun event disponible. Ajoutez-en un en cliquant sur "Ajouter un élément".
          </LavaTypo>
        ) : (
          <Flex
            width={'full'}
            direction={'row'}
            gap={4}
            flexWrap={'wrap'}
            textAlign={'left'}
            justifyContent={'space-between'}
          >
            {events.map((event) => (
              <DataList.Root
                size={'lg'}
                orientation={'horizontal'}
                color={'black'}
                px={'4'}
                py={'2'}
                gap={1}
                key={event.id}
                borderRadius={'md'}
                borderWidth={'1px'}
                borderColor={'gray.200'}
                width={'full'}
                backgroundColor={'gray.50'}
                position={'relative'}
              >
                <EditableDataListItem
                  label="Titre"
                  value={event.title}
                  placeholder="Titre"
                  onValueCommit={(value: string) => event.id && handleUpdateField(event.id, 'title', value)}
                />

                <EditableDataListItem
                  label="Description"
                  value={event.description}
                  placeholder="Description"
                  onValueCommit={(value: string) => event.id && handleUpdateField(event.id, 'description', value)}
                />

                <EditableDataListItem
                  label="Prix"
                  value={event.price.toString()}
                  placeholder="Prix"
                  type="number"
                  onValueCommit={(value: string) => event.id && handleUpdateField(event.id, 'price', parseFloat(value) || 0)}
                />

                <EditableDataListItem
                  label="Date"
                  value={event.date}
                  placeholder="Date"
                  onValueCommit={(value: string) => event.id && handleUpdateField(event.id, 'date', value)}
                />

                <EditableDataListItem
                  label="Lieu"
                  value={event.place}
                  placeholder="Lieu"
                  onValueCommit={(value: string) => event.id && handleUpdateField(event.id, 'place', value)}
                />
                <EditableDataListItem
                  label="Lien"
                  value={event.link}
                  placeholder="Lien"
                  onValueCommit={(value: string) => event.id && handleUpdateField(event.id, 'link', value)}
                />

                <Box className='status-chip'
                  position={'absolute'}
                  top={'-10px'}
                  right={12}
                  backgroundColor={event.status === 'ACTIVE' ? 'green.100' : event.status === 'INACTIVE' ? 'red.100' : ''}
                  paddingX={2}
                  borderRadius={'full'}
                >
                  <LavaTypo size={'14px'}>{event.status === 'ACTIVE' ? 'Event actif' : event.status === 'INACTIVE' ? 'Event inactif' : ''}</LavaTypo>
                </Box>

                <Box position={'absolute'} top={2} right={2}>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <IconButton
                        variant={'ghost'}
                        size={'xs'}
                        py={1}
                      >
                        <BsThreeDotsVertical />
                      </IconButton>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item value={event.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'} onSelect={() => event.id && handleUpdateStatus(event.id, event.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}>
                            {event.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                          </Menu.Item>
                          <Menu.Item
                            value="delete"
                            color="fg.error"
                            _hover={{ bg: "bg.error", color: "fg.error" }}
                            onSelect={() => {
                              setItemToDelete(event.id ?? null);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            Delete...
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                </Box>
              </DataList.Root>
            ))}
            </Flex>
        )}
      </Flex>

      <AddEventDialog
        open={open}
        onClose={() => setOpen(false)}
        onAdd={handleAddEventItem}
      />

      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        handleDelete={handleDeleteEventItem}
        itemToDelete={itemToDelete}
        dialogTitle="Supprimer l'événement"
      />
    </Box>
  )
}
