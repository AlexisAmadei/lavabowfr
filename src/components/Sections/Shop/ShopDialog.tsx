import LavaTypo from '@/components/Design/LavaTypo'
import { addMerchItem, MerchItem } from '@/utils/supabase/shop'
import { Button, Dialog, Field, Flex, Input, Stack } from '@chakra-ui/react'
import React from 'react'

export default function ShopDialog({
  editDialogOpen,
  handleOpenDialog,
  formData,
  setFormData,
  handleFormUpdate,
  formValidation,
  dialogType,
  itemIdToEdit
}: {
  editDialogOpen: { open: boolean, type: 'edit' | 'add' },
  handleOpenDialog: () => void,
  formData: MerchItem,
  setFormData: React.Dispatch<React.SetStateAction<MerchItem>>,
  handleFormUpdate: (itemId: number) => Promise<void>,
  formValidation: () => boolean,
  dialogType?: 'edit' | 'add',
  itemIdToEdit?: number
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
        stock: formData.stock
      });
      handleOpenDialog();
    }
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
                {/* <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText> */}
              </Field.Root>

              <Field.Root>
                <Field.Label>Description</Field.Label>
                <Input placeholder="Description de l'article" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                {/* <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText> */}
              </Field.Root>

              <Field.Root>
                <Field.Label>Prix</Field.Label>
                <Input placeholder="Prix de l'article €" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} type="number" />
                {/* <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText> */}
              </Field.Root>

              <Field.Root>
                <Field.Label>Tags</Field.Label>
                <Input placeholder="Tags" value={formData.tags?.join(', ') ?? ''} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })} />
                {/* <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText> */}
              </Field.Root>

              <Field.Root>
                <Field.Label>Stock</Field.Label>
                <Input placeholder="Stock" value={formData.stock ?? ''} onChange={(e) => setFormData({ ...formData, stock: e.target.value === '' ? null : Number(e.target.value) })} type="number" />
                {/* <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText> */}
              </Field.Root>

              <Button onClick={handleSubmitAction} disabled={!formValidation()}>{editDialogOpen.type === 'add' ? 'Add' : 'Submit'}</Button>
            </Stack>
          </Flex>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
