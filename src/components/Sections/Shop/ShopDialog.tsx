import LavaTypo from '@/components/Design/LavaTypo'
import { addMerchItem, MerchItem } from '@/utils/supabase/shop'
import { Button, Checkbox, Dialog, Field, Flex, Input, Stack } from '@chakra-ui/react'
import React from 'react'

export default function ShopDialog({
  editDialogOpen,
  handleOpenDialog,
  formData,
  setFormData,
  handleFormUpdate,
  formValidation,
  dialogType,
  itemIdToEdit,
  onClose
}: {
  editDialogOpen: { open: boolean, type: 'edit' | 'add' },
  handleOpenDialog: () => void,
  formData: MerchItem,
  setFormData: React.Dispatch<React.SetStateAction<MerchItem>>,
  handleFormUpdate: (itemId: number) => Promise<void>,
  formValidation: () => boolean,
  dialogType?: 'edit' | 'add',
  itemIdToEdit?: number,
  onClose: () => void
}) {

  async function handleSubmitAction() {
    if (editDialogOpen.type === 'edit') {
      await handleFormUpdate(itemIdToEdit!);
    } else {
      await addMerchItem({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        tags: formData.tags,
        stripe_paylink: formData.stripe_paylink,
        out_of_stock: formData.out_of_stock
      });
      handleOpenDialog();
    }
    onClose();
  }

  return (
    <Dialog.Root open={editDialogOpen.open} onOpenChange={() => handleOpenDialog()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>

        <Dialog.Content>
          <Flex direction={'column'} backgroundColor={'white'} padding={6} borderRadius={8} minWidth={'400px'}>
            <LavaTypo variant='h3'>
              {dialogType === 'add' ? 'Add Merch Item' : 'Edit Merch Item'}
            </LavaTypo>

            <Stack gap="4" align="flex-start" maxW="sm">
              <Field.Root>
                <Field.Label>First name</Field.Label>
                <Input placeholder="Titre de l'article" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Description</Field.Label>
                <Input placeholder="Description de l'article" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Prix</Field.Label>
                <Input placeholder="Prix de l'article €" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} type="number" />
              </Field.Root>

              <Field.Root>
                <Field.Label>Tags</Field.Label>
                <Input placeholder="Tags" value={formData.tags?.join(', ') ?? ''} onChange={(e) => setFormData({ ...formData, tags: e.target.value.trim() === '' ? [] : e.target.value.split(',').map(tag => tag.trim()) })} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Stripe Payment Link</Field.Label>
                <Input placeholder="Stripe Payment Link" value={formData.stripe_paylink} onChange={(e) => setFormData({ ...formData, stripe_paylink: e.target.value })} />
              </Field.Root>

              <Checkbox.Root
                display={'flex'}
                alignItems={'center'}
                checked={formData.out_of_stock}
                onCheckedChange={(details) => setFormData({ ...formData, out_of_stock: !!details.checked })}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>Out of Stock</Checkbox.Label>
              </Checkbox.Root>

              <Button onClick={handleSubmitAction} disabled={!formValidation()}>{editDialogOpen.type === 'add' ? 'Add' : 'Submit'}</Button>
            </Stack>
          </Flex>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
