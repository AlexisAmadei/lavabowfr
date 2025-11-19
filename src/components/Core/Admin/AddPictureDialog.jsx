import { Button, Dialog, Field, Fieldset, FileUpload, Input, Portal, Textarea } from '@chakra-ui/react'
import React from 'react'
import { HiUpload } from 'react-icons/hi'

export default function AddPictureDialog({ open, onClose, onAdd }) {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    date: '',
    link: '',
    place: '',
  })
  const [uploadedFile, setUploadedFile] = React.useState(null)

  const handleSubmit = async () => {
    let s3Link = formData.link;

    // If a file is uploaded, generate the S3 URL
    if (uploadedFile) {
      const timestamp = Date.now();
      const sanitizedFileName = uploadedFile.name
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_{2,}/g, '_');
      s3Link = `https://igssfxppazjwwrnouxfj.supabase.co/storage/v1/object/public/lavabowfr/pictures/${timestamp}_${sanitizedFileName}`;
    }

    onAdd({ ...formData, link: s3Link, img: uploadedFile })
    setFormData({
      title: '',
      description: '',
      date: '',
      link: '',
      place: '',
    })
    setUploadedFile(null)
  }

  const updateField = (field, value) => {
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
          }
        }}
      >
        <FileUpload.HiddenInput />
        <FileUpload.Label>Image</FileUpload.Label>
        <FileUpload.Trigger asChild>
          <Button variant="subtle" size="sm" backgroundColor={'blue.50'}>
            <HiUpload /> Télécharger une image
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
              <Dialog.Title color={'black'}>Ajouter une photo</Dialog.Title>
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
                    <Textarea
                      title='Description'
                      placeholder='Description'
                      value={formData.description}
                      onChange={(e) => updateField('description', e.target.value)}
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Date</Field.Label>
                    <Input
                      title="Date"
                      placeholder="Date"
                      type="date"
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

                </Fieldset.Content>

                <UploadImageComponent />

                <Button variant={'subtle'} colorPalette={'green'} onClick={handleSubmit}>
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
