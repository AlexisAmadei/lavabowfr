import { Field, Portal, Select, createListCollection } from '@chakra-ui/react'
import React from 'react'
import { MerchCategory, MerchItem } from '@/utils/supabase/shop'

type Props = {
  formData: MerchItem
  setFormData: React.Dispatch<React.SetStateAction<MerchItem>>
  categories: MerchCategory[]
}

export default function ShopCategory({ formData, setFormData, categories }: Props) {
  return (
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
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Select.Item item={category} key={category.id} color={'black'}>
                    {category.name}
                    <Select.ItemIndicator />
                  </Select.Item>
                ))
              ) : (
                <Select.ItemGroup>
                  <Select.ItemGroupLabel color={'gray'}>
                    Aucune catégorie trouvée
                  </Select.ItemGroupLabel>
                </Select.ItemGroup>
              )}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Field.Root>
  )
}