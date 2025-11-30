import { Button, Dialog, Portal } from '@chakra-ui/react'

interface DeleteDialogProps<T = unknown> {
  openDeleteDialog: boolean;
  setOpenDeleteDialog: (open: boolean) => void;
  handleDelete: (item: T) => void;
  itemToDelete?: T;
  dialogTitle?: string;
}

export default function DeleteDialog<T = unknown>({
  openDeleteDialog,
  setOpenDeleteDialog,
  handleDelete,
  itemToDelete,
  dialogTitle
}: DeleteDialogProps<T>) {
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
              <Button
                variant={'subtle'}
                colorPalette={'red'}
                onClick={() => {
                  if (typeof itemToDelete !== 'undefined') {
                    handleDelete(itemToDelete)
                  }
                }}
              >
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
