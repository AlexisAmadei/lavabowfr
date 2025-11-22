import { EventItem } from '@/types/types'
import { Button, Dialog, Field, Fieldset, FileUpload, Input, Portal, Image, Box } from '@chakra-ui/react'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface EditEventDialogProps {
  open: boolean
  onClose: () => void
  onUpdate: (event: EventItem) => void
  event: EventItem
}

export default function EditEventDialog({ open, onClose, onUpdate, event }: EditEventDialogProps) {
  const [formData, setFormData] = React.useState<EventItem>(event)
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)

  // Update formData when event prop changes
  React.useEffect(() => {
    // Convert ISO date to datetime-local format (YYYY-MM-DDTHH:mm)
    const formattedEvent = {
      ...event,
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : ''
    }
    setFormData(formattedEvent)
    setUploadedFile(null)
  }, [event])

  const handleSubmit = () => {
    // Convert datetime-local format to ISO string for database
    const eventToUpdate = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : ''
    }
    onUpdate(eventToUpdate)
    setUploadedFile(null)
  }

  const updateField = (field: keyof EventItem, value: string | number | File) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const UploadImageComponent = () => {
    return (
      <Box>
        {/* Show current image if exists and no new file is uploaded */}
        {formData.img && typeof formData.img === 'string' && !uploadedFile && (
          <Box mb={4}>
            <Field.Root>

              <Field.Label>Image actuelle</Field.Label>
              <Image
                src={formData.img}
                alt="Event image"
                maxH="200px"
                objectFit="cover"
                borderRadius="md"
              />
            </Field.Root>
          </Box>
        )}


        <FileUpload.Root
          accept={["image/heic", "image/jpeg", "image/png", "image/webp"]}
          maxFiles={1}
          onFileChange={(details) => {
            const file = details.acceptedFiles[0];
            if (file) {
              setUploadedFile(file);
              updateField('img', file);
            }
          }}
        >
          <FileUpload.HiddenInput />
          <FileUpload.Label>
            {uploadedFile ? 'Nouvelle image' : 'Changer l\'image de l\'événement'}
          </FileUpload.Label>
          <FileUpload.Trigger asChild>
            <Button variant="subtle" size="sm" backgroundColor={'blue.50'}>
              <FontAwesomeIcon icon={faUpload} /> {uploadedFile ? 'Changer l\'image' : 'Télécharger une nouvelle cover'}
            </Button>
          </FileUpload.Trigger>
          {uploadedFile && (
            <FileUpload.ItemGroup>
              <FileUpload.Item file={uploadedFile}>
                <FileUpload.ItemPreview asChild>
                  <FileUpload.ItemPreviewImage />
                </FileUpload.ItemPreview>
                <FileUpload.ItemContent>
                  <FileUpload.ItemName />
                  <FileUpload.ItemSizeText />
                </FileUpload.ItemContent>
                <FileUpload.ItemDeleteTrigger
                  onClick={() => {
                    setUploadedFile(null);
                    // Restore original image URL if it existed
                    updateField('img', event.img || '');
                  }}
                />
              </FileUpload.Item>
            </FileUpload.ItemGroup>
          )}
        </FileUpload.Root>

      </Box>
    )
  }

  return (
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
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Input
                      title='Description'
                      placeholder='Description'
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Prix</Field.Label>
                    <Input
                      title="Prix"
                      placeholder="Prix"
                      type="number"
                      value={formData.price}
                      onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Date</Field.Label>
                    <Input
                      title="Date"
                      placeholder="Date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Lieu</Field.Label>
                    <Input
                      title="Lieu"
                      placeholder="Lieu"
                      value={formData.place}
                      onChange={(e) => updateField('place', e.target.value)}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Lien</Field.Label>
                    <Input
                      title="Lien"
                      placeholder="Lien"
                      value={formData.link}
                      onChange={(e) => updateField('link', e.target.value)}
                    />
                  </Field.Root>
                </Fieldset.Content>

                <UploadImageComponent />

                <Button variant={'subtle'} colorPalette={'blue'} onClick={handleSubmit}>
                  Sauvegarder
                </Button>
              </Fieldset.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
