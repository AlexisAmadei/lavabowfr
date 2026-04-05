import AppBar from '@/components/Core/AppBar/AppBar'
import MobileAppBar from '@/components/Core/AppBar/MobileAppBar'
import Divider from '@/components/Design/Divider'
import LavaTypo from '@/components/Design/LavaTypo'
import Contact from '@/components/Sections/Contact'
import Footer from '@/components/Sections/Footer'
import ShopItemCard from '@/components/Sections/Shop/ShopItemCard'
import useIsMobile from '@/hooks/useIsMobile'
import { fetchMerchItems, MerchItem, MerchCategory, fetchMerchCategories } from '@/utils/supabase/shop'
import { Box, Checkbox, Container, Flex, Button } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function Shop() {
  const [items, setItems] = useState<MerchItem[]>([])
  const [categories, setCategories] = useState<MerchCategory[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set())
  const isMobile = useIsMobile();

  const filteredItems = items.filter((item) => {
    const passesStockFilter = !inStockOnly || !item.out_of_stock
    const passesCategoryFilter = selectedCategories.size === 0 || (item.category && selectedCategories.has(item.category))
    return passesStockFilter && passesCategoryFilter
  })

  useEffect(() => {
    async function loadItems() {
      const merchItems = await fetchMerchItems(true);
      setItems(merchItems)

      const fetchedCategories = await fetchMerchCategories();
      setCategories(fetchedCategories)
    }
    loadItems()
  }, [])

  return (
    <Container
      backgroundColor={'var(--Background-bg-brand)'}
      minHeight={'100vh'}
      maxW={'100vw'}
      alignItems={'center'}
      justifyContent={'center'}
      p={0}
      paddingTop={100}
    >
      {isMobile ? <MobileAppBar  /> : <AppBar />}
      <Flex
        direction={'column'}
        alignItems={'center'}
      >
        <LavaTypo variant='h1' textAlign='center'>Soutiens nous, en étant trop stylé</LavaTypo>

        {items.length > 0 && (
          <Flex
            direction={'column'}
            gap={4}
            mt={6}
            borderRadius={'sm'}
            backgroundColor={'white'}
            padding={4}
            px={16}
            justifyContent={'space-between'}
          >
            {/* Stock Filter */}
            <Flex direction={'row'}>
              <Checkbox.Root
                checked={inStockOnly}
                onCheckedChange={(e) => setInStockOnly(!!e.checked)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
                <Checkbox.Label color={'black'}>Disponible seulement</Checkbox.Label>
              </Checkbox.Root>
            </Flex>

            {/* Category Filters */}
            {categories.length > 0 && (
              <Flex direction={'column'} gap={2}>
                <LavaTypo color={'black'}>Catégories</LavaTypo>
                <Flex wrap={'wrap'} gap={2}>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      size="sm"
                      variant={selectedCategories.has(category.id) ? 'solid' : 'outline'}
                      colorScheme={selectedCategories.has(category.id) ? 'blue' : 'gray'}
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
          </Flex>
        )}

        <Box width={'100%'} mt={10} px={16}>
          {/* Group items by category */}
          {categories.map((category) => {
            const categoryItems = filteredItems.filter(item => item.category === category.id);
            if (categoryItems.length === 0) return null;

            return (
              <Box key={category.id} mb={8}>
                <LavaTypo variant="h3" style={{ marginBottom: '16px' }}>{category.name}</LavaTypo>
                <Flex wrap={'wrap'} gap={4}>
                  {categoryItems.map((item) => (
                    <ShopItemCard key={item.id} item={item} isAdminView={false} />
                  ))}
                </Flex>
                <Box my={5}>
                  <Divider orientation="horizontal" color='white' />
                </Box>
              </Box>
            );
          })}

          {/* Items without category */}
          {(() => {
            const noCategory = filteredItems.filter(item => !item.category);
            return noCategory.length > 0 ? (
              <Box mb={8}>
                <LavaTypo variant="h3" style={{ marginBottom: '16px' }}>Et le reste !</LavaTypo>
                <Flex wrap={'wrap'} gap={4}>
                  {noCategory.map((item) => (
                    <ShopItemCard key={item.id} item={item} isAdminView={false} />
                  ))}
                </Flex>
              </Box>
            ) : null;
          })()}

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <Box textAlign='center' py={10}>
              <LavaTypo variant='h2' textAlign='center'>Aucun article disponible pour le moment. Restez à l&apos;écoute !</LavaTypo>
            </Box>
          )}
        </Box>
      </Flex>
      <Contact />
      <Footer />
    </Container>
  )
}
