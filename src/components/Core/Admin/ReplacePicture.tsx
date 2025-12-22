import { Dialog, Portal, Button, Input, Stack, Image, Text, VStack } from '@chakra-ui/react'
import { useState, type ChangeEvent } from 'react'
import { replacePictureFile } from '@/utils/supabase/pictures'
import { toaster } from '@/components/ui/toaster'

type ReplacePictureProps = {
  isOpen: boolean
  onClose: () => void
  item?: {
    id?: string | number
    title?: string | null
    link?: string | null
  } | null
  onReplaced?: () => void
}

export default function ReplacePicture({ isOpen, onClose, item, onReplaced }: ReplacePictureProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreviewUrl(reader.result)
        } else {
          setPreviewUrl(null)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReplace = async () => {
    if (!selectedFile || !item?.id) return

    setIsLoading(true)
    try {
      const idNumber = Number(item.id)
      if (Number.isNaN(idNumber)) {
        throw new Error('Invalid picture id')
      }
      await replacePictureFile(idNumber, selectedFile)
      setSelectedFile(null)
      setPreviewUrl(null)
      onReplaced?.()
      onClose()
      toaster.success({
        title: 'Photo remplacée',
        description: 'La photo a été remplacée avec succès',
      })
    } catch (error) {
      console.error('Error replacing picture:', error)
      toaster.error({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de remplacer la photo. Veuillez réessayer.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    onClose()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Remplacer l'image</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack gap={4} align="stretch">
                <Text fontSize="sm" color="gray.600">
                  Image actuelle: {item?.title}
                </Text>

                {item?.link && (
                  <Image
                    src={item.link}
                    alt="Current picture"
                    maxH="150px"
                    objectFit="contain"
                    borderRadius="md"
                    title='Image actuelle'
                  />
                )}

                <Stack gap={2}>
                  <Text fontWeight="medium">Nouvelle image:</Text>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    p={1}
                  />
                </Stack>

                {previewUrl && (
                  <VStack gap={2} align="stretch">
                    <Text fontSize="sm" fontWeight="medium">Aperçu:</Text>
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      maxH="150px"
                      objectFit="contain"
                      borderRadius="md"
                      title='Aperçu de la nouvelle image'
                    />
                  </VStack>
                )}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={handleClose}>
                  Annuler
                </Button>
              </Dialog.ActionTrigger>
              <Button
                variant="solid"
                onClick={handleReplace}
                disabled={!selectedFile || isLoading}
              >
                Remplacer
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
