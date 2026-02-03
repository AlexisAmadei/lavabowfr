import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo'
import { ClicksItem } from '@/types/types';
import { fetchClicksContent, insertClicksItem, updateClicksItem } from '@/utils/supabase/click_palier'
import { Box, Button, Dialog, Field, Fieldset, Flex, Input, Portal } from '@chakra-ui/react'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react'

export default function AdminClicks() {
  const [clicksContent, setClicksContent] = useState<ClicksItem[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ClicksItem>({
    id: 0,
    name: '',
    target: 0
  });

  const onClose = () => {
    setOpen(false);
    setFormData({
      id: 0,
      name: '',
      target: 0
    });
  }

  const fetchClicksItems = async () => {
    await fetchClicksContent(setClicksContent);
  }

  const updateField = (field: keyof ClicksItem, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    await insertClicksItem(formData);
    await fetchClicksItems();
    onClose();
  };

  useEffect(() => {
    fetchClicksItems();
  }, []);

  return (
    <Box direction={'column'}>
      <Flex mb={4} justifyContent={'space-between'} alignItems={'center'}>
        <LavaTypo variant={'h3'} styles={{ color: 'black', marginBottom: '8px', textAlign: 'left' }}>Clicks</LavaTypo>
        <LavaButton variant={'filled'} onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faPlusCircle} /> Ajouter un élément
        </LavaButton>
      </Flex>

      {clicksContent.length === 0 ? (
        <LavaTypo variant={'p'} styles={{ color: 'black' }} size={'16px'}>
          Aucun event disponible. Ajoutez-en un en cliquant sur "Ajouter un élément".
        </LavaTypo>
      ) : (
        clicksContent.map((item) => (
          <Flex key={item.id} mb={4} p={4} borderRadius={8} border={'1px solid #E2E8F0'} justifyContent={'space-between'}>
            <Flex justifyContent='space-between' direction={'column'}>
              <LavaTypo color='black'>Click item: {item.name}</LavaTypo>
              <LavaTypo variant={'p'} color='black'>Target: {item.target}</LavaTypo>
            </Flex>

            <Button variant='subtle' colorPalette={'blue'}
              onClick={() => {
                setFormData(item);
                setOpen(true);
              }}
            >
              Modifier
            </Button>
          </Flex>
        ))
      )}

      <Dialog.Root lazyMount open={open} onOpenChange={(e) => !e.open && onClose()} placement={'center'}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title color={'black'}>Modifier l'événement</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body color={'black'}>
                <Fieldset.Root>
                  <Fieldset.Content gap={1}>
                    <Field.Root>
                      <Field.Label>Titre</Field.Label>
                      <Input
                        title='Titre'
                        placeholder='Titre'
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Target</Field.Label>
                      <Input
                        title='Target'
                        placeholder='Target'
                        value={formData.target}
                        onChange={(e) => updateField('target', Number(e.target.value))}
                      />
                    </Field.Root>
                  </Fieldset.Content>

                  <Button variant={'subtle'} colorPalette={'blue'} onClick={handleSubmit}>
                    Sauvegarder
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
