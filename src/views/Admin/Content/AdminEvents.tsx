import LavaTypo from '@/components/Design/LavaTypo'
import { EventItem } from '@/types/types'
import { Box, DataList, Flex, IconButton, Image, Menu, Portal } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import EditableDataListItem from '@/components/Core/Admin/EditableDataListItem'
import AddEventDialog from '../../../components/Core/Admin/AddEventDialog'
import EditEventDialog from '../../../components/Core/Admin/EditEventDialog'
import DeleteDialog from '@/components/Core/Admin/DeleteDialog'
import { fetchEventsContent, insertEventItem, updateEventItem } from '@/utils/supabase/events'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

export default function AdminEvents({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const [events, setEvents] = React.useState<EventItem[]>([])
  const [openEditDialog, setOpenEditDialog] = React.useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
  const [itemToDelete, setItemToDelete] = React.useState<number | null>(null);
  const [itemToEdit, setItemToEdit] = React.useState<EventItem | null>(null);

  const handleAddEventItem = async (newEventItem: EventItem) => {
    setOpen(false);
    await insertEventItem(newEventItem);
    fetchEventsContent(setEvents);
  };

  const handleUpdateEvent = async (updatedEvent: EventItem) => {
    setOpenEditDialog(false);
    if (updatedEvent.id) {
      await updateEventItem(updatedEvent.id, updatedEvent);
      fetchEventsContent(setEvents);
    }
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
      <Flex
        direction={'row'}
        gap={2}
        flexWrap={'wrap'}
        textAlign={'left'}
        justifyContent={'space-between'}
      >
        {events.length === 0 ? (
          <LavaTypo variant={'p'} styles={{ color: 'black' }} size={'16px'}>
            Aucun event disponible. Ajoutez-en un en cliquant sur "Ajouter un élément".
          </LavaTypo>
        ) : (
          <Flex
            width={'full'}
            direction={'row'}
            gap={2}
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
                {/* Display event image if it exists */}
                {event.img && typeof event.img === 'string' && (
                  <DataList.Item>
                    <DataList.ItemLabel>Image</DataList.ItemLabel>
                    <DataList.ItemValue>
                      <Image
                        src={event.img}
                        alt={event.title}
                        maxH="100px"
                        maxW="150px"
                        objectFit="cover"
                        borderRadius="md"
                        title={event.title}
                      />
                    </DataList.ItemValue>
                  </DataList.Item>
                )}

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
                  onValueCommit={(value: string) => event.id && handleUpdateField(event.id, 'price', parseFloat(value) || 0)}
                />

                <EditableDataListItem
                  label="Date"
                  value={event.date ? (() => {
                    const date = new Date(event.date);
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    return `${day}/${month}/${year} - ${hours}:${minutes}`;
                  })() : ''}
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
                  value={event.link ?? ''}
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
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </IconButton>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item
                            value="edit"
                            onSelect={() => {
                              setItemToEdit(event);
                              setOpenEditDialog(true);
                            }}
                          >
                            Modifier
                          </Menu.Item>
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

      {itemToEdit && (
        <EditEventDialog
          open={openEditDialog}
          onClose={() => {
            setOpenEditDialog(false);
            setItemToEdit(null);
          }}
          onUpdate={handleUpdateEvent}
          event={itemToEdit}
        />
      )}

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
