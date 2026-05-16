import { Button, Dialog, Field, Fieldset, Input, Portal } from '@chakra-ui/react'
import React from 'react'

type SpotlightData = {
  title: string
  subtitle: string
  listen_link: string
  buy_link: string
}

interface AddSpotlightDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (data: SpotlightData) => void
}

export default function AddSpotlightDialog({ open, onClose, onAdd }: AddSpotlightDialogProps) {
  const [formData, setFormData] = React.useState({
    title: '',
    subtitle: '',
    listen_link: '',
    buy_link: ''
  })

  const handleSubmit = () => {
    onAdd(formData)
    setFormData({
      title: '',
      subtitle: '',
      listen_link: '',
      buy_link: ''
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
              <Dialog.Title color={'black'}>Ajouter un Spotlight</Dialog.Title>
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
                    <Field.Label>Sous-Titre</Field.Label>
                    <Input
                      title='Sous-Titre'
                      placeholder='Sous-Titre'
                      value={formData.subtitle}
                      onChange={(e) => updateField('subtitle', e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Lien d'écoute</Field.Label>
                    <Input
                      title="Lien d'écoute"
                      placeholder="Lien d'écoute"
                      value={formData.listen_link}
                      onChange={(e) => updateField('listen_link', e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Lien d'achat</Field.Label>
                    <Input
                      title="Lien d'achat"
                      placeholder="Lien d'achat"
                      value={formData.buy_link}
                      onChange={(e) => updateField('buy_link', e.target.value)}
                    />
                  </Field.Root>
                </Fieldset.Content>

                <Button variant={'subtle'} colorPalette={'green'} onClick={handleSubmit}>
                  Ajouter le Spotlight
                </Button>
              </Fieldset.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
