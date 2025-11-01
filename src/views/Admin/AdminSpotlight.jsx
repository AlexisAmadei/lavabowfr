import DeleteDialog from '@/components/Core/Admin/DeleteDialog';
import EditableDataListItem from '@/components/Core/Admin/EditableDataListItem';
import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo';
import { Box, DataList, Flex, IconButton, Menu, Portal } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { BsPlusCircleFill, BsThreeDotsVertical } from 'react-icons/bs';
import AddSpotlightDialog from '../../components/Core/Admin/AddSpotlightDialog';
import { deleteSpotlightItem, fetchSpotlightContent } from '@/utils/supabase/spotlight';

export default function AdminSpotlight() {
  const [open, setOpen] = React.useState(false);
  const [spotlightContent, setSpotlightContent] = React.useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);

  const handleAddSpotlightItem = async (newSpotlightItem) => {
    setOpen(false);
    await insertSpotlightItem(newSpotlightItem);
    await fetchSpotlightContent(setSpotlightContent);
  };

  const handleUpdateField = async (itemId, field, value) => {
    // Find the current item
    const currentItem = spotlightContent.find(item => item.id === itemId);
    if (!currentItem) return;

    // Check if value actually changed
    if (currentItem[field] === value) {
      return; // No change, skip update
    }

    // Create updated item with the new field value
    const updatedItem = {
      ...currentItem,
      [field]: value
    };

    // Update in Supabase
    const result = await updateSpotlightItem(itemId, updatedItem);

    if (result) {
      // Refetch from database to confirm the update
      await fetchSpotlightContent(setSpotlightContent);
    }
  };

  const handleDeleteSpotlightItem = async (itemId) => {
    setOpenDeleteDialog(false);
    setItemToDelete(null);
    await deleteSpotlightItem(itemId);
    await fetchSpotlightContent(setSpotlightContent);
  };

  const handleUpdateStatus = async (itemId, newStatus) => {
    const currentItem = spotlightContent.find(item => item.id === itemId);
    if (!currentItem) return;

    // Check if status actually changed
    if (currentItem.status === newStatus) {
      return; // No change, skip update
    }

    // Update in Supabase
    const result = await updateSpotlightItem(itemId, { status: newStatus });

    if (result) {
      // Refetch from database to confirm the update
      await fetchSpotlightContent(setSpotlightContent);
    }
  };

  useEffect(() => {
    fetchSpotlightContent(setSpotlightContent);
  }, []);

  return (
    <Box direction={'column'}>
      <Flex mb={4} justifyContent={'space-between'} alignItems={'center'}>
        <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '8px', textAlign: 'left' }}>Spotlight</LavaTypo>
        <LavaButton variant={'filled'} onClick={() => setOpen(true)}>
          <BsPlusCircleFill /> Ajouter un élément
        </LavaButton>
      </Flex>

      <Flex
        direction={'row'}
        gap={4}
        flexWrap={'wrap'}
        textAlign={'left'}
        justifyContent={'space-between'}
      >
        {spotlightContent.map((item) => (
          <DataList.Root
            size={'lg'}
            orientation={'horizontal'}
            color={'black'}
            px={'4'}
            py={'2'}
            gap={1}
            key={item.id}
            borderRadius={'md'}
            borderWidth={'1px'}
            borderColor={'gray.200'}
            width={'full'}
            position={'relative'}
            backgroundColor={'gray.50'}
          >
            <EditableDataListItem
              label="Titre"
              value={item.title}
              placeholder="Titre"
              onValueCommit={(value) => handleUpdateField(item.id, 'title', value)}
            />

            <EditableDataListItem
              label="Sous-Titre"
              value={item.subtitle}
              placeholder="Sous-titre"
              onValueCommit={(value) => handleUpdateField(item.id, 'subtitle', value)}
            />

            <EditableDataListItem
              label="Lien d'écoute"
              value={item.listen_link}
              placeholder="Lien d'écoute"
              onValueCommit={(value) => handleUpdateField(item.id, 'listen_link', value)}
            />

            <EditableDataListItem
              label="Lien d'achat"
              value={item.buy_link}
              placeholder="Lien d'achat"
              onValueCommit={(value) => handleUpdateField(item.id, 'buy_link', value)}
            />

            <Box className='status-chip'
              position={'absolute'}
              top={'-10px'}
              right={12}
              backgroundColor={item.status === 'ACTIVE' ? 'green.100' : item.status === 'INACTIVE' ? 'red.100' : ''}
              paddingX={2}
              borderRadius={'full'}
            >
              <LavaTypo size={'14px'}>{item.status === 'ACTIVE' ? 'Spotlight actif' : item.status === 'INACTIVE' ? 'Spotlight inactif' : ''}</LavaTypo>
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
                      <Menu.Item value={item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'} onSelect={() => handleUpdateStatus(item.id, item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}>
                        {item.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                      </Menu.Item>
                      <Menu.Item
                        value="delete"
                        color="fg.error"
                        _hover={{ bg: "bg.error", color: "fg.error" }}
                        onSelect={() => {
                          setItemToDelete(item.id);
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

      <AddSpotlightDialog
        open={open}
        onClose={() => setOpen(false)}
        onAdd={handleAddSpotlightItem}
      />

      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        handleDelete={handleDeleteSpotlightItem}
        itemToDelete={itemToDelete}
        dialogTitle="Supprimer le Spotlight"
      />
    </Box>
  );
}
