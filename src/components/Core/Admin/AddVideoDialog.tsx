import { Button, Checkbox, Dialog, Field, Fieldset, Input, Portal } from '@chakra-ui/react'
import React from 'react'

type VideoData = {
  description?: string
  url?: string
  status: "ACTIVE" | "INACTIVE" | string
  order?: number
}

interface AddVideoDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (data: VideoData) => void
  editingVideo?: VideoData & { id: number }
  onEdit?: (id: number, data: VideoData) => void
}

export default function AddVideoDialog({ open, onClose, onAdd, editingVideo, onEdit }: AddVideoDialogProps) {
  const isEditing = !!editingVideo
  const [formData, setFormData] = React.useState({
    description: '',
    url: '',
    status: 'ACTIVE'
  })

  React.useEffect(() => {
    if (isEditing && editingVideo) {
      setFormData({
        description: editingVideo.description || '',
        url: editingVideo.url || '',
        status: editingVideo.status
      })
    } else if (open) {
      setFormData({
        description: '',
        url: '',
        status: 'ACTIVE'
      })
    }
  }, [open, editingVideo, isEditing])

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
    }

    const formattedData = {
      ...formData,
      url: `https://www.youtube.com/embed/${videoId}`
    };

    if (isEditing && editingVideo && onEdit) {
      onEdit(editingVideo.id, formattedData)
    } else {
      onAdd(formattedData)
    }
    setFormData({
      description: '',
      url: '',
      status: 'ACTIVE'
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
              <Dialog.Title color={'black'}>{isEditing ? 'Modifier la Vidéo' : 'Ajouter une Vidéo'}</Dialog.Title>
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
                      checked={formData.status === 'ACTIVE'}
                      onCheckedChange={(e) => updateField('status', e.checked ? 'ACTIVE' : 'INACTIVE')}
                    >
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>Actif</Checkbox.Label>
                    </Checkbox.Root>
                  </Field.Root>

                </Fieldset.Content>

                <Button variant={'subtle'} colorPalette={'green'} onClick={handleSubmit}>
                  {isEditing ? 'Modifier la Vidéo' : 'Ajouter la Vidéo'}
                </Button>
              </Fieldset.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
