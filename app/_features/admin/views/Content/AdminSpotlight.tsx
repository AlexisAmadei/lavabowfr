import DeleteDialog from '@/components/Core/Admin/DeleteDialog';
import EditableDataListItem from '@/components/Core/Admin/EditableDataListItem';
import LavaTypo from '@/components/Design/LavaTypo';
import { Box, Button, DataList, Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import AddSpotlightDialog from '@/components/Core/Admin/AddSpotlightDialog';
import { deleteSpotlightItem, fetchSpotlightContent, insertSpotlightItem, updateSpotlightItem } from '@/utils/supabase/spotlight';
import { SpotlightItem } from '@/types/types';
import { toaster } from '@/components/ui/toaster';
import StatusChip from '@/components/ui/StatusChip';
import AdminItemMenu from '@/components/Core/Admin/AdminItemMenu';
import { updateItemStatus } from '@/utils/supabase/updateItemStatus';

export default function AdminSpotlight({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const [spotlightContent, setSpotlightContent] = React.useState<SpotlightItem[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<number | undefined>(undefined);

  const handleAddSpotlightItem = async (newSpotlightItem: SpotlightItem) => {
    setOpen(false);
    await insertSpotlightItem(newSpotlightItem).then(() => {
      toaster.create({
        title: "Élément Spotlight ajouté avec succès",
        description: `L'élément "${newSpotlightItem.title}" a été ajouté.`,
        type: "success",
        duration: 5000,
      }
      );
    });
    await fetchSpotlightContent(setSpotlightContent);
  };

  const handleUpdateField = async (itemId: number, field: keyof SpotlightItem, value: string) => {
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
    await updateSpotlightItem(itemId, updatedItem).then(async () => {
      toaster.create({
        title: "Élément Spotlight mis à jour avec succès",
        description: `L'élément "${updatedItem.title}" a été mis à jour.`,
        type: "success",
        duration: 5000,
      });
      await fetchSpotlightContent(setSpotlightContent);
    });
  };

  const handleDeleteSpotlightItem = async (itemId: number) => {
    setOpenDeleteDialog(false);
    setItemToDelete(undefined);
    await deleteSpotlightItem(itemId);
    await fetchSpotlightContent(setSpotlightContent);
  };

  const handleUpdateStatus = async (itemId: number) => {
    const currentItem = spotlightContent.find(item => item.id === itemId);
    if (!currentItem) return;

    await updateItemStatus('section_spotlight', itemId, currentItem.status || '').then(async () => {
      toaster.create({
        title: "Statut de l'élément Spotlight mis à jour avec succès",
        description: `Le statut de l'élément "${currentItem.title}" a été mis à jour.`,
        type: "success",
        duration: 5000,
      });
      await fetchSpotlightContent(setSpotlightContent);
    });
  };

  const testLink = (link: string | URL | undefined) => {
    window.open(link, '_blank');
  };

  useEffect(() => {
    fetchSpotlightContent(setSpotlightContent);
  }, []);

  return (
    <Box direction={'column'}>
      <Flex
        direction={'row'}
        gap={4}
        flexWrap={'wrap'}
        textAlign={'left'}
        justifyContent={'space-between'}
      >
        {spotlightContent.length === 0 ? (
          <LavaTypo variant={'p'} styles={{ color: 'black' }} size={'16px'}>
            Aucun event disponible. Ajoutez-en un en cliquant sur "Ajouter un élément".
          </LavaTypo>
        ) : (
          spotlightContent.map((item) => (
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
                onValueCommit={(value: string) => item.id && handleUpdateField(item.id, 'title', value)}
              />

              <EditableDataListItem
                label="Sous-Titre"
                value={item.subtitle}
                placeholder="Sous-titre"
                onValueCommit={(value: string) => item.id && handleUpdateField(item.id, 'subtitle', value)}
              />

              <Flex direction={'row'} alignItems={'center'} gap={2}>
                <EditableDataListItem
                  label="Lien d'écoute"
                  value={item.listen_link}
                  placeholder="Lien d'écoute"
                  onValueCommit={(value: string) => item.id && handleUpdateField(item.id, 'listen_link', value)}
                />
                <Button height={'fit-content'} py={1} px={2} colorPalette={'blue'} variant='subtle' onClick={() => testLink(item.listen_link)}>Tester le lien</Button>
              </Flex>

              <Flex direction={'row'} alignItems={'center'} gap={2}>
                <EditableDataListItem
                  label="Lien d'achat"
                  value={item.buy_link}
                  placeholder="Lien d'achat"
                  onValueCommit={(value: string) => item.id && handleUpdateField(item.id, 'buy_link', value)}
                />
                <Button height={'fit-content'} py={1} px={2} colorPalette={'blue'} variant='subtle' onClick={() => testLink(item.buy_link)}>Tester le lien</Button>
              </Flex>

              <StatusChip status={item.status || ''} />

              <Box position={'absolute'} top={2} right={2}>
                <AdminItemMenu
                  key={item.id}
                  itemId={item.id!}
                  itemStatus={item.status || ''}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={(id: number) => {
                    setItemToDelete(id);
                    setOpenDeleteDialog(true);
                  }}
                />
              </Box>
            </DataList.Root>
          )))}
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
