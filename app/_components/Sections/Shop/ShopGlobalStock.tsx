import { Field, Input, Text } from '@chakra-ui/react'
import React from 'react'
import { MerchItem } from '@/utils/supabase/shop'

type Props = {
  formData: MerchItem
  setFormData: React.Dispatch<React.SetStateAction<MerchItem>>
}

export default function ShopGlobalStock({ formData, setFormData }: Props) {
  return (
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
        min={1}
      />
      <Text fontSize="sm" color="fg.muted">
        Laisser vide pour stock illimité. Sinon, indiquer un nombre supérieur à 0.
      </Text>
    </Field.Root>
  )
}