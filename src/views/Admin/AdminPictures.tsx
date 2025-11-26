import { Box, Button, DataList, Flex, IconButton, Image, Menu, Portal } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { toaster } from '@/components/ui/toaster'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

// @ts-ignore
import LavaTypo from '@/components/Design/LavaTypo'
import LavaButton from '@/components/Design/LavaButton'
// @ts-ignore
import EditableDataListItem from '@/components/Core/Admin/EditableDataListItem'
// @ts-ignore
import DeleteDialog from '@/components/Core/Admin/DeleteDialog'
// @ts-ignore
import AddPictureDialog from '@/components/Core/Admin/AddPictureDialog'
// @ts-ignore
import ReplacePicture from '@/components/Core/Admin/ReplacePicture'
import { fetchPicturesContent, insertPictureItem, updatePictureItem, deletePictureItem } from '@/utils/supabase/pictures'
import { PictureItem } from '@/types/types'

export default function AdminPictures() {
  const [open, setOpen] = React.useState(false)
  const [picturesContent, setPicturesContent] = React.useState<PictureItem[]>([])
  const [selectedForReplace, setSelectedForReplace] = React.useState<PictureItem | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
  const [itemToDelete, setItemToDelete] = React.useState<number | null>(null)

  useEffect(() => {
    fetchPicturesContent(setPicturesContent)
  }, [])

  const handleAddPictureItem = async (newPictureItem: PictureItem) => {
    setOpen(false)

    const addPromise = insertPictureItem(newPictureItem)
      .then(() => fetchPicturesContent(setPicturesContent))

    toaster.promise(addPromise, {
      loading: { title: 'Uploading...', description: 'Uploading image and saving item' },
      success: { title: 'Photo ajoutée', description: 'La photo a été ajoutée avec succès' },
      error: (err) => ({
        title: 'Erreur',
        description: err instanceof Error ? err.message : "Impossible d'ajouter la photo. Veuillez réessayer.",
      }),
    })
  }

  const handleUpdateField = async (itemId: number, field: keyof PictureItem, value: string | number) => {
    const currentItem = picturesContent.find(item => item.id === itemId)
    if (!currentItem || currentItem[field] === value) return

    const updatedItem = { ...currentItem, [field]: value }
    const result = await updatePictureItem(itemId, updatedItem)

    if (result) {
      await fetchPicturesContent(setPicturesContent)
    }
  }

  const handleDeletePictureItem = async () => {
    if (itemToDelete === null) return
    setOpenDeleteDialog(false)
    setItemToDelete(null)
    await deletePictureItem(itemToDelete)
    await fetchPicturesContent(setPicturesContent)
  }

  const handleUpdateStatus = async (itemId: number, newStatus: 'ACTIVE' | 'INACTIVE') => {
    const currentItem = picturesContent.find(item => item.id === itemId)
    if (!currentItem || currentItem.status === newStatus) return

    const result = await updatePictureItem(itemId, { ...currentItem, status: newStatus })

    if (result) {
      await fetchPicturesContent(setPicturesContent)
    }
  }

  const testLink = (link?: string) => {
    if (link) {
      window.open(link, '_blank')
    }
  }

  return (
    <Box>
      <Flex mb={4} justifyContent="space-between" alignItems="center">
        <LavaTypo variant="h3" styles={{ color: 'black', marginBottom: '8px', textAlign: 'left' }}>
          Lava Bow en photos
        </LavaTypo>
        <LavaButton variant="filled" onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faPlusCircle} />Ajouter un élément
        </LavaButton>
      </Flex>

      <Flex direction="row" gap={4} flexWrap="wrap" textAlign="left" justifyContent="space-between">
        {picturesContent.length === 0 ? (
          <LavaTypo variant="p" styles={{ color: 'black' }} size="16px">
            Aucune photo disponible. Ajoutez-en une en cliquant sur "Ajouter un élément".
          </LavaTypo>
        ) : (
          <Flex width="full" direction="row" gap={4} flexWrap="wrap" textAlign="left" justifyContent="space-between">
            {picturesContent.map((item) => (
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
                  label="Description"
                  value={item.description || ''}
                  placeholder="Description"
                  onValueCommit={(value: string) => item.id && handleUpdateField(item.id, 'description', value)}
                />

                <EditableDataListItem
                  label="Date"
                  value={item.date || ''}
                  placeholder="Date"
                  onValueCommit={(value: string) => item.id && handleUpdateField(item.id, 'date', value)}
                />

                <EditableDataListItem
                  label="Lieu"
                  value={item.place || ''}
                  placeholder="Lieu"
                  onValueCommit={(value: string) => item.id && handleUpdateField(item.id, 'place', value)}
                />

                <Box>
                  <Image
                    src={item.link}
                    alt={item.title}
                    maxH="100px"
                    objectFit="contain"
                    cursor="pointer"
                    onClick={() => testLink(item.link)}
                  />
                  <Button
                    mt={1}
                    height="fit-content"
                    py={1}
                    px={2}
                    colorPalette="blue"
                    variant="subtle"
                    onClick={() => setSelectedForReplace(item)}
                  >
                    Remplacer l'image
                  </Button>
                </Box>

                <Box
                  className="status-chip"
                  position="absolute"
                  top="-10px"
                  right={12}
                  backgroundColor={item.status === 'ACTIVE' ? 'green.100' : 'red.100'}
                  paddingX={2}
                  borderRadius="full"
                >
                  <LavaTypo size="14px">
                    {item.status === 'ACTIVE' ? 'Photo active' : 'Photo inactive'}
                  </LavaTypo>
                </Box>

                <Box position="absolute" top={2} right={2}>
                  <Menu.Root>
                    <Menu.Trigger asChild>
                      <IconButton variant="ghost" size="xs" py={1}>
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </IconButton>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content>
                          <Menu.Item
                            value={item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'}
                            onSelect={() => item.id && handleUpdateStatus(item.id, item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                          >
                            {item.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
                          </Menu.Item>
                          <Menu.Item
                            value="delete"
                            color="fg.error"
                            _hover={{ bg: "bg.error", color: "fg.error" }}
                            onSelect={() => {
                              setItemToDelete(item.id ?? null)
                              setOpenDeleteDialog(true)
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

      <AddPictureDialog
        open={open}
        onClose={() => setOpen(false)}
        onAdd={handleAddPictureItem}
      />

      <ReplacePicture
        isOpen={!!selectedForReplace}
        onClose={() => setSelectedForReplace(null)}
        item={selectedForReplace}
        onReplaced={() => {
          setSelectedForReplace(null)
          fetchPicturesContent(setPicturesContent)
        }}
      />

      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        handleDelete={handleDeletePictureItem}
        itemToDelete={itemToDelete}
        dialogTitle="Supprimer la photo"
      />
    </Box>
  )
}
