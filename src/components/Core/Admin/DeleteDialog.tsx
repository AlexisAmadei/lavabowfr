import { Button, Dialog, Portal } from '@chakra-ui/react'

interface DeleteDialogProps {
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (open: boolean) => void;
  handleDelete: (item: any) => void;
  itemToDelete?: any;
  dialogTitle?: string;
}

export default function DeleteDialog({
  openDeleteDialog,
  setOpenDeleteDialog,
  handleDelete,
  itemToDelete,
  dialogTitle
}: DeleteDialogProps) {
  return (
    <Dialog.Root lazyMount open={openDeleteDialog} onOpenChange={(e) => setOpenDeleteDialog(e.open)} placement={'center'}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title color={'black'}>{dialogTitle}</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body color={'black'}>
              Êtes-vous sûr de vouloir supprimer cet élément ?
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant={'subtle'} colorPalette={'red'} onClick={() => handleDelete(itemToDelete)}>
                Supprimer
              </Button>
              <Button variant={'subtle'} colorPalette={'gray'} onClick={() => setOpenDeleteDialog(false)}>
                Annuler
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
