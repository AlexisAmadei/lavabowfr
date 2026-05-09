import LavaTypo from '@/components/Design/LavaTypo'
import { addMerchItem, MerchItem, uploadMerchImage, deleteMerchImage, MerchCategory, fetchMerchCategories, SIZE_VALUES, SizeValue, upsertMerchItemSizes } from '@/utils/supabase/shop'
import { Box, Button, Dialog, Field, Flex, Input, Stack, Text, FileUpload, Image, Checkbox, Select, createListCollection, Portal, RadioGroup } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faXmark } from '@fortawesome/free-solid-svg-icons'
import { toaster } from '@/components/ui/toaster'

export default function ShopDialog({
  editDialogOpen,
  handleOpenDialog,
  formData,
  setFormData,
  handleFormUpdate,
  formValidation,
  dialogType,
  itemIdToEdit,
  onClose
}: {
  editDialogOpen: { open: boolean, type: 'edit' | 'add' },
  handleOpenDialog: () => void,
  formData: MerchItem,
  setFormData: React.Dispatch<React.SetStateAction<MerchItem>>,
  handleFormUpdate: (itemId: number, updatedData?: Partial<MerchItem>) => Promise<void>,
  formValidation: () => boolean,
  dialogType?: 'edit' | 'add',
  itemIdToEdit?: number,
  onClose: () => void
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<MerchCategory[]>([]);
  const [bulkSizeStock, setBulkSizeStock] = useState<string>('');
  // Picker between "single article-wide stock" and "stock per clothing size".
  // Initialised from formData on dialog open; user-driven afterwards.
  const [stockMode, setStockMode] = useState<'general' | 'sizes'>(
    (formData.sizes?.length ?? 0) > 0 ? 'sizes' : 'general',
  );

  // Update preview when dialog opens or formData changes
  useEffect(() => {
    if (editDialogOpen.open) {
      setImagePreview(formData.image_url || null);
      setSelectedImage(null);
      // Sync the mode picker to whatever the loaded item already has — opening an
      // edit dialog on a sized article should land on the per-size editor.
      setStockMode((formData.sizes?.length ?? 0) > 0 ? 'sizes' : 'general');
      // Fetch categories when dialog opens
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editDialogOpen.open, formData.image_url]);

  const fetchCategories = async () => {
    const fetchedCategories = await fetchMerchCategories();
    setCategories(fetchedCategories);
  };

  // Validate image file
  const validateImage = (file: File): string | null => {
    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return 'Image must be smaller than 5MB';
    }

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      return 'File must be an image';
    }

    // Check if image is square using Image element
    return new Promise<string | null>((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        if (img.width !== img.height) {
          resolve('Image must be square (same width and height)');
        } else {
          resolve(null);
        }
      };
      img.onerror = () => resolve('Failed to load image');
      img.src = URL.createObjectURL(file);
    }) as any;
  };

  const handleImageChange = async (details: any) => {
    const file = details.files?.[0];
    if (!file) return;

    const error = await validateImage(file);
    if (error) {
      toaster.create({
        title: 'Invalid Image',
        description: error,
        type: 'error',
      });
      return;
    }

    setSelectedImage(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleRemoveImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
    setFormData({ ...formData, image_url: undefined });
  };

  async function handleDeleteAction() {
    if (editDialogOpen.type !== 'edit' || !itemIdToEdit) return;

    setIsUploading(true);
    try {
      await handleFormUpdate(itemIdToEdit, { status: 'DELETED' });
      toaster.create({
        title: 'Article supprimé',
        description: 'L\'article a été marqué comme supprimé.',
        type: 'success',
      });
      onClose();
    } catch {
      toaster.create({
        title: 'Suppression impossible',
        description: 'Une erreur est survenue pendant la suppression.',
        type: 'error',
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmitAction() {
    setIsUploading(true);
    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (selectedImage) {
        // Delete old image if updating
        if (editDialogOpen.type === 'edit' && formData.image_url) {
          await deleteMerchImage(formData.image_url);
        }

        // Upload new image
        const uploadedUrl = await uploadMerchImage(selectedImage, formData.name);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          toaster.create({
            title: 'Upload Failed',
            description: 'Failed to upload image. Please try again.',
            type: 'error',
          });
          setIsUploading(false);
          return;
        }
      }

      const sizesPayload = formData.sizes ?? [];

      if (editDialogOpen.type === 'edit') {
        // Pass the imageUrl to handleFormUpdate so it uses the correct value
        await handleFormUpdate(itemIdToEdit!, { image_url: imageUrl });
        // Update local state so parent has the new value
        setFormData({ ...formData, image_url: imageUrl });
        if (itemIdToEdit) {
          await upsertMerchItemSizes(itemIdToEdit, sizesPayload);
        }
      } else {
        const newId = await addMerchItem({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          stock: formData.stock,
          tags: formData.tags,
          stripe_paylink: formData.stripe_paylink,
          status: formData.status,
          image_url: imageUrl,
          category: formData.category
        });
        if (newId !== null && sizesPayload.length > 0) {
          await upsertMerchItemSizes(newId, sizesPayload);
        }
        handleOpenDialog();
      }
      onClose();
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Dialog.Root open={editDialogOpen.open} onOpenChange={() => handleOpenDialog()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>

        <Dialog.Content>
          <Flex direction={'column'} backgroundColor={'white'} padding={6} borderRadius={8} minWidth={'400px'}>
            <LavaTypo variant='h3'>
              {dialogType === 'add' ? 'Ajouter un article' : 'Modifier l\'article'}
            </LavaTypo>

            <Stack gap="4" align="flex-start" maxW="sm" width={'100%'}>
              <Field.Root>
                <Field.Label>Article</Field.Label>
                <Input placeholder="Titre de l'article" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Description</Field.Label>
                <Input placeholder="Description de l'article" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Prix</Field.Label>
                <Input placeholder="Prix de l'article €" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} type="number" />
              </Field.Root>

              <Field.Root>
                <Field.Label>Stock</Field.Label>
                <RadioGroup.Root
                  value={stockMode}
                  onValueChange={(e) => {
                    if (e.value === 'general') {
                      setStockMode('general');
                      // Switch back to article-wide stock: drop any per-size rows.
                      setFormData({ ...formData, sizes: [] });
                    } else if (e.value === 'sizes') {
                      setStockMode('sizes');
                      // Switch to per-size stock: clear the article-wide counter; admin enables sizes below.
                      setFormData({ ...formData, stock: null });
                    }
                  }}
                >
                  <Flex direction="column" gap={2}>
                    <RadioGroup.Item value="general">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>Stock unique</RadioGroup.ItemText>
                    </RadioGroup.Item>
                    <RadioGroup.Item value="sizes">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemIndicator />
                      <RadioGroup.ItemText>Stock par taille (vêtements)</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </Flex>
                </RadioGroup.Root>
              </Field.Root>

              {stockMode === 'general' ? (
                <Field.Root>
                  <Field.Label>Stock disponible</Field.Label>
                  <Input
                    placeholder="Laisser vide pour stock illimité"
                    value={formData.stock ?? ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      stock: e.target.value === '' ? null : Number(e.target.value)
                    })}
                    type="number"
                    min={0}
                  />
                  <Text fontSize="sm" color="fg.muted">
                    Indique le nombre d&apos;articles disponibles avant rupture.
                  </Text>
                </Field.Root>
              ) : (
                <Field.Root>
                  <Field.Label>Tailles disponibles</Field.Label>
                  <Flex align="center" gap={2} mb={3} width="100%">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Ex. 50"
                      value={bulkSizeStock}
                      onChange={(e) => setBulkSizeStock(e.target.value)}
                      flex={1}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const parsed = bulkSizeStock === '' ? null : Number(bulkSizeStock);
                        const next = SIZE_VALUES.map((s) => ({ size: s as SizeValue, stock: parsed }));
                        setFormData({ ...formData, sizes: next });
                      }}
                    >
                      Appliquer à toutes les tailles
                    </Button>
                  </Flex>
                  <Flex direction="column" gap={2} width="100%">
                    {SIZE_VALUES.map((size) => {
                      const current = formData.sizes?.find((s) => s.size === size);
                      const enabled = current !== undefined;
                      const stockValue = enabled ? current.stock : null;
                      return (
                        <Flex key={size} align="center" gap={3}>
                          <Checkbox.Root
                            checked={enabled}
                            onCheckedChange={(e) => {
                              const isOn = e.checked === true;
                              const next = (formData.sizes ?? []).filter((s) => s.size !== size);
                              if (isOn) next.push({ size: size as SizeValue, stock: null });
                              next.sort((a, b) => SIZE_VALUES.indexOf(a.size) - SIZE_VALUES.indexOf(b.size));
                              setFormData({ ...formData, sizes: next });
                            }}
                          >
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label>{size}</Checkbox.Label>
                          </Checkbox.Root>
                          <Box flex={1}>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Stock (vide = illimité)"
                              value={stockValue ?? ''}
                              disabled={!enabled}
                              onChange={(e) => {
                                const raw = e.target.value;
                                const parsed = raw === '' ? null : Number(raw);
                                const next = (formData.sizes ?? []).map((s) =>
                                  s.size === size ? { ...s, stock: parsed } : s,
                                );
                                setFormData({ ...formData, sizes: next });
                              }}
                            />
                          </Box>
                        </Flex>
                      );
                    })}
                  </Flex>
                </Field.Root>
              )}

              <Field.Root>
                <Field.Label>Tags</Field.Label>
                <Input placeholder="Tags" value={formData.tags?.join(', ') ?? ''} onChange={(e) => setFormData({ ...formData, tags: e.target.value.trim() === '' ? [] : e.target.value.split(',').map(tag => tag.trim()) })} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Catégorie</Field.Label>
                <Select.Root
                  collection={createListCollection({
                    items: categories,
                    itemToString: (item) => item.name,
                    itemToValue: (item) => String(item.id),
                  })}
                  size="sm"
                  width="100%"
                  value={formData.category ? [String(formData.category)] : []}
                  onValueChange={(e) => setFormData({ ...formData, category: e.value ? Number(e.value[0]) : undefined })}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Sélectionner une catégorie" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {categories.map((category) => (
                          <Select.Item item={category} key={category.id} color={'black'}>
                            {category.name}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>Lien Stripe</Field.Label>
                <Input placeholder="Stripe Payment Link" value={formData.stripe_paylink} onChange={(e) => setFormData({ ...formData, stripe_paylink: e.target.value })} />
              </Field.Root>

              <Field.Root>
                <Field.Label>Image</Field.Label>
                <Text fontSize="sm" color="fg.muted" mb={2}>
                  Format carré et plus petit que 5MB
                </Text>

                {imagePreview ? (
                  <Flex direction="column" gap={2}>
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      maxW="200px"
                      maxH="200px"
                      objectFit="cover"
                      borderRadius={4}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                      onClick={handleRemoveImage}
                      width="fit-content"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                      Supprimer l'image
                    </Button>
                  </Flex>
                ) : (
                  <FileUpload.Root
                    accept="image/*"
                    maxFiles={1}
                    onFileAccept={handleImageChange}
                  >
                    <FileUpload.HiddenInput />
                    <FileUpload.Trigger asChild>
                      <Button variant="outline" size="sm">
                        <FontAwesomeIcon icon={faUpload} />
                        Télécharger une image
                      </Button>
                    </FileUpload.Trigger>
                  </FileUpload.Root>
                )}
              </Field.Root>

              <Flex
                width={'100%'}
                justifyContent={'space-between'}
              >
                <Button onClick={handleSubmitAction} disabled={!formValidation() || isUploading}>
                  {isUploading ? 'Uploading...' : editDialogOpen.type === 'add' ? 'Add' : 'Submit'}
                </Button>
                <Button
                  onClick={handleDeleteAction}
                  disabled={editDialogOpen.type !== 'edit' || isUploading}
                >
                  Supprimer
                </Button>
              </Flex>

            </Stack>
          </Flex>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
