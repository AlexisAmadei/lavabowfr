import { EventItem } from '@/types/types'
import { Button, Dialog, Field, Fieldset, FileUpload, Input, Portal } from '@chakra-ui/react'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

interface AddEventDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (event: EventItem) => void
}

export default function AddEventDialog({ open, onClose, onAdd }: AddEventDialogProps) {
  const [formData, setFormData] = React.useState<EventItem>({
    title: '',
    description: '',
    price: 0,
    date: '',
    place: '',
    link: '',
    img: '',
  })
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)

  const handleSubmit = () => {
    onAdd(formData)
    setFormData({
      title: '',
      description: '',
      price: 0,
      date: '',
      place: '',
      link: '',
      img: '',
    })
    setUploadedFile(null)
  }

  const updateField = (field: keyof EventItem, value: string | number | File) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const UploadImageComponent = () => {
    return (
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
        <FileUpload.Label>Image de l'événement</FileUpload.Label>
        <FileUpload.Trigger asChild>
          <Button variant="subtle" size="sm" backgroundColor={'blue.50'}>
            <FontAwesomeIcon icon={faUpload} /> Télécharger une cover
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
                  updateField('img', '');
                }}
              />
            </FileUpload.Item>
          </FileUpload.ItemGroup>
        )}
      </FileUpload.Root>
    )
  }

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => !e.open && onClose()} placement={'center'}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title color={'black'}>Ajouter un Event</Dialog.Title>
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

                <Button variant={'subtle'} colorPalette={'green'} onClick={handleSubmit}>
                  Ajouter l'Event
                </Button>
              </Fieldset.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
