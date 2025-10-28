import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo';
import { fetchSpotlightContent, insertSpotlightItem, supabase, updateSpotlightItem } from '@/utils/supabase';
import { Box, Button, CloseButton, DataList, Dialog, Editable, Field, Fieldset, Flex, Grid, GridItem, IconButton, Input, Portal } from '@chakra-ui/react';
import React, { useEffect } from 'react'

import { BsPlusCircleFill } from 'react-icons/bs';
import { LuCheck, LuPencilLine, LuX } from 'react-icons/lu';

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

  useEffect(() => {
    fetchSpotlightContent(setSpotlightContent);
  }, []);

  return (
    <Box direction={'column'}>
      <Flex mb={4} justifyContent={'space-between'} alignItems={'center'}>
        <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '16px', textAlign: 'left' }}>Spotlight</LavaTypo>
        <LavaButton variant={'filled'} onClick={() => setOpen(true)}>Ajouter un élément</LavaButton>
      </Flex>

      <Flex
        direction={'row'}
        gap={2}
        flexWrap={'wrap'}
        textAlign={'left'}
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
          >
            <React.Fragment key={item.id}>

              <DataList.Item>
                <DataList.ItemLabel>Titre</DataList.ItemLabel>
                <DataList.ItemValue>
                  <Editable.Root
                    defaultValue={item.title}
                    onValueCommit={(e) => handleUpdateField(item.id, 'title', e.value)}
                    placeholder="Titre"
                    submitMode="both"
                  >
                    <Editable.Preview />
                    <Editable.Input />
                    <Editable.Control>
                      <Editable.EditTrigger asChild>
                        <IconButton variant="ghost" size="xs" aria-label="Edit">
                          <LuPencilLine />
                        </IconButton>
                      </Editable.EditTrigger>
                      <Editable.CancelTrigger asChild>
                        <IconButton variant="outline" size="xs" aria-label="Cancel">
                          <LuX />
                        </IconButton>
                      </Editable.CancelTrigger>
                      <Editable.SubmitTrigger asChild>
                        <IconButton variant="outline" size="xs" aria-label="Submit" colorPalette="green">
                          <LuCheck />
                        </IconButton>
                      </Editable.SubmitTrigger>
                    </Editable.Control>
                  </Editable.Root>
                </DataList.ItemValue>
              </DataList.Item>

              <DataList.Item>
                <DataList.ItemLabel>Sous-Titre</DataList.ItemLabel>
                <DataList.ItemValue>
                  <Editable.Root
                    defaultValue={item.subtitle}
                    onValueCommit={(e) => handleUpdateField(item.id, 'subtitle', e.value)}
                    placeholder="Sous-titre"
                    submitMode="both"
                  >
                    <Editable.Preview />
                    <Editable.Input />
                    <Editable.Control>
                      <Editable.EditTrigger asChild>
                        <IconButton variant="ghost" size="xs" aria-label="Edit">
                          <LuPencilLine />
                        </IconButton>
                      </Editable.EditTrigger>
                      <Editable.CancelTrigger asChild>
                        <IconButton variant="outline" size="xs" aria-label="Cancel">
                          <LuX />
                        </IconButton>
                      </Editable.CancelTrigger>
                      <Editable.SubmitTrigger asChild>
                        <IconButton variant="outline" size="xs" aria-label="Submit" colorPalette="green">
                          <LuCheck />
                        </IconButton>
                      </Editable.SubmitTrigger>
                    </Editable.Control>
                  </Editable.Root>
                </DataList.ItemValue>
              </DataList.Item>

              <DataList.Item>
                <DataList.ItemLabel>Lien d'écoute</DataList.ItemLabel>
                <DataList.ItemValue>
                  <Editable.Root
                    defaultValue={item.listen_link}
                    onValueCommit={(e) => handleUpdateField(item.id, 'listen_link', e.value)}
                    placeholder="Lien d'écoute"
                    submitMode="both"
                  >
                    <Editable.Preview />
                    <Editable.Input />
                    <Editable.Control>
                      <Editable.EditTrigger asChild>
                        <IconButton variant="ghost" size="xs" aria-label="Edit">
                          <LuPencilLine />
                        </IconButton>
                      </Editable.EditTrigger>
                      <Editable.CancelTrigger asChild>
                        <IconButton variant="outline" size="xs" aria-label="Cancel">
                          <LuX />
                        </IconButton>
                      </Editable.CancelTrigger>
                      <Editable.SubmitTrigger asChild>
                        <IconButton variant="outline" size="xs" aria-label="Submit" colorPalette="green">
                          <LuCheck />
                        </IconButton>
                      </Editable.SubmitTrigger>
                    </Editable.Control>
                  </Editable.Root>
                </DataList.ItemValue>
              </DataList.Item>

              <DataList.Item>
                <DataList.ItemLabel>Lien d'achat</DataList.ItemLabel>
                <DataList.ItemValue>
                  <Editable.Root
                    defaultValue={item.buy_link}
                    onValueCommit={(e) => handleUpdateField(item.id, 'buy_link', e.value)}
                    placeholder="Lien d'achat"
                    submitMode="both"
                  >
                    <Editable.Preview />
                    <Editable.Input />
                    <Editable.Control>
                      <Editable.EditTrigger asChild>
                        <IconButton variant="ghost" size="xs" aria-label="Edit">
                          <LuPencilLine />
                        </IconButton>
                      </Editable.EditTrigger>
                      <Editable.CancelTrigger asChild>
                        <IconButton variant="outline" size="xs" aria-label="Cancel">
                          <LuX />
                        </IconButton>
                      </Editable.CancelTrigger>
                      <Editable.SubmitTrigger asChild>
                        <IconButton variant="outline" size="xs" aria-label="Submit" colorPalette="green">
                          <LuCheck />
                        </IconButton>
                      </Editable.SubmitTrigger>
                    </Editable.Control>
                  </Editable.Root>
                </DataList.ItemValue>
              </DataList.Item>
            </React.Fragment>
          </DataList.Root>
        ))}
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
    </Box>
  )
}