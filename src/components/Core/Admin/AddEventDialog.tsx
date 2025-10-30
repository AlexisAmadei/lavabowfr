import { EventItem } from '@/types/types'
import { Button, Dialog, Field, Fieldset, Input, Portal } from '@chakra-ui/react'
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
  })

  const handleSubmit = () => {
    onAdd(formData)
    setFormData({
      title: '',
      description: '',
      price: 0,
      date: '',
      place: '',
      link: '',
    })
  }

  const updateField = (field: keyof EventItem, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
