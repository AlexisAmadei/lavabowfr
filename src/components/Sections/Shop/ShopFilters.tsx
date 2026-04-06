import LavaTypo from '@/components/Design/LavaTypo'
import { MerchCategory } from '@/utils/supabase/shop'
import { Accordion, Badge, Box, Button, Checkbox, Flex } from '@chakra-ui/react'

interface ShopFiltersProps {
categories: MerchCategory[]
inStockOnly: boolean
setInStockOnly: (value: boolean) => void
selectedCategories: Set<number>
setSelectedCategories: (value: Set<number>) => void
}

export default function ShopFilters({
categories,
inStockOnly,
setInStockOnly,
selectedCategories,
setSelectedCategories,
}: ShopFiltersProps) {
const hasActiveFilters = inStockOnly || selectedCategories.size > 0
const activeFilterCount = (inStockOnly ? 1 : 0) + selectedCategories.size

const clearFilters = () => {
setInStockOnly(false)
setSelectedCategories(new Set())
}

return (
<Flex
direction={'column'}
gap={3}
mt={6}
w={'90%'}
maxW={'980px'}
borderRadius={'2xl'}
border={'1px solid rgba(0, 0, 0, 0.1)'}
background={'rgba(255, 255, 255, 0.8)'}
padding={{ base: 4, md: 6 }}
px={{ base: 4, md: 8 }}
justifyContent={'space-between'}
position={'relative'}
overflow={'hidden'}
boxShadow={'0 18px 40px rgba(0, 0, 0, 0.16)'}
>
<Box
position={'absolute'}
top={'-70px'}
right={'-90px'}
h={'180px'}
w={'180px'}
borderRadius={'full'}
background={
'radial-gradient(circle, rgba(18, 23, 252, 0.2) 0%, rgba(18, 23, 252, 0) 70%)'
}
pointerEvents={'none'}
/>

<Accordion.Root collapsible variant={'plain'} defaultValue={[]} border={'none'}>
<Accordion.Item value={'shop-filters'} border={'none'}>
<Accordion.ItemTrigger
px={0}
py={1}
_hover={{ background: 'transparent' }}
>
<Flex
w={'100%'}
justifyContent={'space-between'}
alignItems={'center'}
gap={3}
>
<Flex direction={'column'} alignItems={'flex-start'} gap={1}>
<LavaTypo color={'black'}>Filtrer la boutique</LavaTypo>
<LavaTypo color={'black'} style={{ opacity: 0.75, fontSize: '0.95rem' }}>
Affinez rapidement les produits visibles.
</LavaTypo>
</Flex>

<Flex alignItems={'center'} gap={2}>
<Badge
colorPalette={hasActiveFilters ? 'pink' : 'gray'}
variant={'subtle'}
borderRadius={'full'}
px={3}
>
{activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''}
</Badge>
<Accordion.ItemIndicator color={'black'} />
</Flex>
</Flex>
</Accordion.ItemTrigger>

<Accordion.ItemContent>
<Accordion.ItemBody px={0} pt={4} pb={1}>
{hasActiveFilters && (
<Flex justifyContent={'flex-end'} mb={3}>
<Button
size={'sm'}
variant={'ghost'}
onClick={clearFilters}
color={'black'}
border={'1px solid rgba(0, 0, 0, 0.2)'}
bg={'rgba(255, 255, 255, 0.75)'}
backdropFilter={'blur(4px)'}
_hover={{ background: 'rgba(255, 255, 255, 0.95)' }}
>
Réinitialiser
</Button>
</Flex>
)}

<Flex
direction={{ base: 'column', md: 'row' }}
alignItems={{ base: 'flex-start', md: 'center' }}
justifyContent={'space-between'}
gap={3}
border={'1px solid rgba(0, 0, 0, 0.14)'}
borderRadius={'xl'}
padding={{ base: 3, md: 4 }}
bg={'rgba(255, 255, 255, 0.78)'}
>
<Checkbox.Root
checked={inStockOnly}
onCheckedChange={(e) => setInStockOnly(!!e.checked)}
>
<Checkbox.HiddenInput />
<Checkbox.Control
borderColor={'rgba(0, 0, 0, 0.45)'}
bg={'white'}
_checked={{
background: 'var(--main-accent)',
borderColor: 'var(--main-accent)',
}}
/>
<Checkbox.Label color={'black'} fontWeight={'600'}>
Disponible seulement
</Checkbox.Label>
</Checkbox.Root>

{inStockOnly && (
<Badge
colorPalette={'green'}
variant={'subtle'}
borderRadius={'full'}
px={3}
py={1}
>
En stock
</Badge>
)}
</Flex>

{categories.length > 0 && (
<Flex direction={'column'} gap={3} mt={4}>
<Flex justifyContent={'space-between'} alignItems={'center'}>
<LavaTypo color={'black'}>Catégories</LavaTypo>
<Badge
colorPalette={selectedCategories.size > 0 ? 'pink' : 'gray'}
variant={'subtle'}
borderRadius={'full'}
px={3}
>
{selectedCategories.size} sélectionnée{selectedCategories.size > 1 ? 's' : ''}
</Badge>
</Flex>

<Flex wrap={'wrap'} gap={2}>
{categories.map((category) => (
<Button
key={category.id}
size="sm"
variant={selectedCategories.has(category.id) ? 'solid' : 'surface'}
color={selectedCategories.has(category.id) ? 'white' : 'black'}
border={'1px solid rgba(0, 0, 0, 0.2)'}
borderRadius={'full'}
px={4}
fontWeight={'700'}
background={
selectedCategories.has(category.id)
? 'linear-gradient(130deg, var(--secondary-accent) 0%, var(--main-accent) 100%)'
: 'rgba(255, 255, 255, 0.82)'
}
_hover={{
transform: 'translateY(-1px)',
background: selectedCategories.has(category.id)
? 'linear-gradient(130deg, var(--secondary-accent) 0%, var(--main-accent) 100%)'
: 'rgba(255, 255, 255, 0.95)',
}}
transition={'all 0.2s ease'}
onClick={() => {
const newSelected = new Set(selectedCategories)
if (newSelected.has(category.id)) {
newSelected.delete(category.id)
} else {
newSelected.add(category.id)
}
setSelectedCategories(newSelected)
}}
>
{category.name}
</Button>
))}
</Flex>
</Flex>
)}
</Accordion.ItemBody>
</Accordion.ItemContent>
</Accordion.Item>
</Accordion.Root>
</Flex>
)
}
