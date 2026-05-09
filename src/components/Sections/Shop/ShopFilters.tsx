import LavaTypo from '@/components/Design/LavaTypo'
import LavaButton from '@/components/Design/LavaButton'
import { MerchCategory } from '@/utils/supabase/shop'
import { Checkbox, Flex } from '@chakra-ui/react'
import { useTranslation } from '@/i18n/useTranslation'

interface ShopFiltersProps {
  categories: MerchCategory[]
  inStockOnly: boolean
  setInStockOnly: (value: boolean) => void
  selectedCategories: Set<number>
  setSelectedCategories: (value: Set<number>) => void
}

export default function ShopFilters(props: ShopFiltersProps) {
  const {
    categories,
    inStockOnly,
    setInStockOnly,
    selectedCategories,
    setSelectedCategories,
  } = props
  const { t } = useTranslation()

  const toggleCategory = (categoryId: number) => {
    const nextSelectedCategories = new Set(selectedCategories)

    if (nextSelectedCategories.has(categoryId)) {
      nextSelectedCategories.delete(categoryId)
    } else {
      nextSelectedCategories.add(categoryId)
    }

    setSelectedCategories(nextSelectedCategories)
  }

  return (
    <Flex justifyContent={'space-between'} alignItems={'center'} width={'100%'} gap={4} wrap={'wrap'} px={16} my={8}>
      <Flex>
        <Checkbox.Root
          checked={inStockOnly}
          onCheckedChange={(e) => setInStockOnly(e.checked === true)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>
            <LavaTypo>
              {t.shop.inStockOnly}
            </LavaTypo>
          </Checkbox.Label>
        </Checkbox.Root>
      </Flex>

      <Flex alignItems={'center'} gap={4} wrap={'wrap'}>
        <LavaTypo>{t.shop.categories}</LavaTypo>
        <Flex gap={2} wrap={'wrap'}>
          {categories.map((category) => {
            const isActive = selectedCategories.has(category.id)

            return (
              <LavaButton
                key={category.id}
                variant={isActive ? 'filled' : 'outlined'}
                color={isActive ? 'secondary' : undefined}
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
              </LavaButton>
            )
          })}
        </Flex>
      </Flex>
    </Flex>
  )
}
