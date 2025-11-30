import { toaster } from '@/components/ui/toaster'
import { Button, Dialog, Field, Fieldset, FileUpload, Input, Portal, Textarea } from '@chakra-ui/react'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import type { PictureItem } from '@/types/types'

const INITIAL_FORM_STATE = {
  title: '',
  description: '',
  date: '',
  link: '',
  place: '',
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

interface AddPictureDialogProps {
  open: boolean
  onClose: () => void
  onAdd: (data: Partial<PictureItem> & { img?: File | null }) => void
}

export default function AddPictureDialog({ open, onClose, onAdd }: AddPictureDialogProps) {
  const [formData, setFormData] = React.useState(INITIAL_FORM_STATE)
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null)

  const handleSubmit = async () => {
    if (uploadedFile) {
      onAdd({ ...formData, img: uploadedFile })
    } else {
      onAdd({ ...formData })
    }
    setFormData(INITIAL_FORM_STATE)
    setUploadedFile(null)
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (details: { acceptedFiles: File[] }) => {
    const file = details.acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleFileReject = () => {
    toaster.create({
      type: 'error',
      title: 'File too large ! (max 5MB)',
      duration: 10000
    })
  }

  const handleFileAccept = () => {
    toaster.create({
      type: 'success',
      title: 'Image sélectionnée',
      duration: 3000,
    })
  }

  const handleFileDelete = () => {
    setUploadedFile(null)
  }

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => !e.open && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title color="black">Ajouter une photo</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body color="black">
              <Fieldset.Root>
                <Fieldset.Content gap={1}>
                  <Field.Root>
                    <Field.Label>Titre</Field.Label>
                    <Input
                      placeholder="Titre"
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Textarea
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Date</Field.Label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Lieu</Field.Label>
                    <Input
                      placeholder="Lieu"
                      value={formData.place}
                      onChange={(e) => updateField('place', e.target.value)}
                    />
                  </Field.Root>

                  <FileUpload.Root
                    accept={["image/jpeg", "image/png", "image/webp"]}
                    maxFiles={1}
                    maxFileSize={MAX_FILE_SIZE}
                    onFileChange={handleFileChange}
                    onFileReject={handleFileReject}
                    onFileAccept={handleFileAccept}
                  >
                    <FileUpload.HiddenInput />
                    <FileUpload.Label>Image</FileUpload.Label>
                    <FileUpload.Trigger asChild>
                      <Button variant="subtle" size="sm" backgroundColor="blue.50">
                        <FontAwesomeIcon icon={faUpload} /> Télécharger une image
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
                          <FileUpload.ItemDeleteTrigger onClick={handleFileDelete} />
                        </FileUpload.Item>
                      </FileUpload.ItemGroup>
                    )}
                  </FileUpload.Root>
                </Fieldset.Content>

                <Button variant="subtle" colorPalette="green" onClick={handleSubmit}>
                  Ajouter la photo
                </Button>
              </Fieldset.Root>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
