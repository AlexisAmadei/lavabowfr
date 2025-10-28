import DeleteDialog from '@/components/Core/Admin/DeleteDialog';
import EditableDataListItem from '@/components/Core/Admin/EditableDataListItem';
import Divider from '@/components/Design/Divider';
import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo';
import { deleteSpotlightItem, fetchSpotlightContent, insertSpotlightItem, updateSpotlightItem } from '@/utils/supabase';
import { Box, Button, DataList, Dialog, Field, Fieldset, Flex, Input, Portal } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { BsPlusCircleFill, BsTrashFill } from 'react-icons/bs';

export default function AdminContent() {
  const [open, setOpen] = React.useState(false);
  const [spotlightContent, setSpotlightContent] = React.useState([]);
  const [newSpotlightItem, setNewSpotlightItem] = React.useState({
    id: null,
    title: '',
    subtitle: '',
    listen_link: '',
    buy_link: ''
  });
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);

  const handleAddSpotlightItem = async () => {
    setOpen(false);
    await insertSpotlightItem(newSpotlightItem);
    await fetchSpotlightContent(setSpotlightContent);
    // Reset form
    setNewSpotlightItem({
      id: null,
      title: '',
      subtitle: '',
      listen_link: '',
      buy_link: ''
    });
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
    console.log('Deleting item with ID:', itemId);
    await deleteSpotlightItem(itemId);
    await fetchSpotlightContent(setSpotlightContent);
  };

  useEffect(() => {
    fetchSpotlightContent(setSpotlightContent);
  }, []);

  return (
    <Box direction={'column'}>
      <Flex mb={4} justifyContent={'space-between'} alignItems={'center'}>
        <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '16px', textAlign: 'left' }}>Spotlight</LavaTypo>
        <LavaButton variant={'filled'} onClick={() => setOpen(true)}><BsPlusCircleFill/> Ajouter un élément</LavaButton>
      </Flex>

      <Flex
        direction={'row'}
        gap={2}
        flexWrap={'wrap'}
        textAlign={'left'}
        justifyContent={'space-between'}
        mb={8}
      >
        {spotlightContent.map((item) => (
          <DataList.Root size={'lg'} orientation={'horizontal'} color={'black'}
            px={'4'}
            py={'2'}
            gap={1}
            key={item.id}
            borderRadius={'md'}
            borderWidth={'1px'}
            borderColor={'gray.300'}
            width={'full'}
            position={'relative'}
          >
            <React.Fragment key={item.id}>

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
            </React.Fragment>
            <Box position={'absolute'} top={2} right={2}>
              <Button
                variant={'subtle'} colorPalette={'red'} size={'sm'} py={1} leftIcon={<BsTrashFill />}
                onClick={() => {
                  setItemToDelete(item.id);
                  setOpenDeleteDialog(true);
                }}
              >
                Supprimer
              </Button>
            </Box>
          </DataList.Root>
        ))}
      </Flex>

      <Flex mb={4} justifyContent={'space-between'} alignItems={'center'}>
        <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '16px', textAlign: 'left' }}>Events</LavaTypo>
        <LavaButton variant={'filled'} onClick={() => setOpen(true)}><BsPlusCircleFill /> Ajouter un élément</LavaButton>
      </Flex>

      <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)} placement={'center'}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>

              <Dialog.Header>
                <Dialog.Title color={'black'}>Ajouter un Spotlight</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body color={'black'}>
                <Fieldset.Root>
                  <Fieldset.Content gap={1}>

                    <Field.Root>
                      <Field.Label>Titre</Field.Label>
                      <Input
                        title='Titre'
                        placeholder='Titre'
                        value={newSpotlightItem.title}
                        onChange={(e) => setNewSpotlightItem({ ...newSpotlightItem, title: e.target.value })}
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Sous-Titre</Field.Label>
                      <Input
                        title='Sous-Titre'
                        placeholder='Sous-Titre'
                        value={newSpotlightItem.subtitle}
                        onChange={(e) => setNewSpotlightItem({ ...newSpotlightItem, subtitle: e.target.value })}
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Lien d'écoute</Field.Label>
                      <Input
                        title="Lien d'écoute"
                        placeholder="Lien d'écoute"
                        value={newSpotlightItem.listen_link}
                        onChange={(e) => setNewSpotlightItem({ ...newSpotlightItem, listen_link: e.target.value })}
                      />
                    </Field.Root>

                    <Field.Root>
                      <Field.Label>Lien d'achat</Field.Label>
                      <Input
                        title="Lien d'achat"
                        placeholder="Lien d'achat"
                        value={newSpotlightItem.buy_link}
                        onChange={(e) => setNewSpotlightItem({ ...newSpotlightItem, buy_link: e.target.value })}
                      />
                    </Field.Root>
                  </Fieldset.Content>

                  <Button variant={'subtle'} colorPalette={'green'} onClick={handleAddSpotlightItem}>
                    Ajouter le Spotlight
                  </Button>
                </Fieldset.Root>
              </Dialog.Body>

            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        handleDelete={handleDeleteSpotlightItem}
        itemToDelete={itemToDelete}
        dialogTitle="Supprimer le Spotlight"
      />
    </Box>
  )
}