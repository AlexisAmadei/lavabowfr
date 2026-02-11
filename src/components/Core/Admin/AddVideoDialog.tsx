import { Button, Checkbox, Dialog, Field, Fieldset, Input, Portal } from '@chakra-ui/react'
import React from 'react'

type VideoData = {
  description?: string
  url?: string
  status: "active" | "inactive" | string
  order?: number
}

interface AddVideoDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (data: VideoData) => void
}

export default function AddVideoDialog({ open, onClose, onAdd }: AddVideoDialogProps) {
  const [formData, setFormData] = React.useState({
    description: '',
    url: '',
    status: 'active'
  })

  function getVideoId(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  const handleSubmit = () => {
    const videoId = getVideoId(formData.url || '');

    if (!videoId) {
      alert('URL de vidéo YouTube invalide. Veuillez entrer une URL valide.');
      return;
    } else {
      console.log('ID de la vidéo extrait :', videoId);
      formData.url = `https://www.youtube.com/embed/${videoId}`;
    }

    onAdd(formData)
    setFormData({
      description: '',
      url: '',
      status: 'active'
    })
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => !e.open && onClose()} placement={'center'}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title color={'black'}>Ajouter une Vidéo</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body color={'black'}>
              <Fieldset.Root>
                <Fieldset.Content gap={1}>
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
                    <Field.Label>URL</Field.Label>
                    <Input
                      title='URL'
                      placeholder='URL'
                      value={formData.url}
                      onChange={(e) => updateField('url', e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Checkbox.Root
                      checked={formData.status === 'active'}
                      onCheckedChange={(e) => updateField('status', e.checked ? 'active' : 'inactive')}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>Actif</Checkbox.Label>
                    </Checkbox.Root>
                  </Field.Root>

                </Fieldset.Content>

                <Button variant={'subtle'} colorPalette={'green'} onClick={handleSubmit}>
                  Ajouter la Vidéo
                </Button>
              </Fieldset.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
