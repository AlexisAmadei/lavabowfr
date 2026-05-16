import { Box, Checkbox, Flex, Input, Text } from '@chakra-ui/react'
import React from 'react'
import { MerchItem, SIZE_VALUES, SizeValue } from '@/utils/supabase/shop'

type Props = {
  formData: MerchItem
  setFormData: React.Dispatch<React.SetStateAction<MerchItem>>
  logSizeState: (label: string, nextSizes: MerchItem['sizes']) => void
}

export default function ShopStockSelect({ formData, setFormData, logSizeState }: Props) {
  return (
    <Box width="100%">
      <Text fontSize="sm" fontWeight="medium" mb={2}>Tailles disponibles</Text>
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
                  setFormData((prev) => {
                    const next = (prev.sizes ?? []).filter((s) => s.size !== size);
                    if (isOn) next.push({ size: size as SizeValue, stock: null });
                    next.sort((a, b) => SIZE_VALUES.indexOf(a.size) - SIZE_VALUES.indexOf(b.size));
                    logSizeState(`${isOn ? 'checked' : 'unchecked'} size ${size}`, next);
                    return { ...prev, sizes: next };
                  });
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label>{size}</Checkbox.Label>
              </Checkbox.Root>
              <Box flex={1}>
                <Input
                  type="number"
                  min={1}
                  placeholder="Stock (vide = illimité)"
                  value={stockValue ?? ''}
                  disabled={!enabled}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const parsed = raw === '' ? null : Number(raw);
                    setFormData((prev) => {
                      const next = (prev.sizes ?? []).map((s) =>
                        s.size === size ? { ...s, stock: parsed } : s,
                      );
                      logSizeState(`update stock for size ${size}`, next);
                      return { ...prev, sizes: next };
                    });
                  }}
                />
              </Box>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  )
}
