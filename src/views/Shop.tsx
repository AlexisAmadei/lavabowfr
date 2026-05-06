import AppBar from '@/components/Core/AppBar/AppBar'
import MobileAppBar from '@/components/Core/AppBar/MobileAppBar'
import LanguageToggle from '@/components/Core/LanguageToggle/LanguageToggle'
import Divider from '@/components/Design/Divider'
import LavaTypo from '@/components/Design/LavaTypo'
import Contact from '@/components/Sections/Contact'
import Footer from '@/components/Sections/Footer'
import ShopFilters from '@/components/Sections/Shop/ShopFilters'
import ShopItemCard from '@/components/Sections/Shop/ShopItemCard'
import useIsMobile from '@/hooks/useIsMobile'
import { fetchMerchItems, MerchItem, MerchCategory, fetchMerchCategories } from '@/utils/supabase/shop'
import { Box, Container, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/i18n/useTranslation'

export default function Shop() {
  const [items, setItems] = useState<MerchItem[]>([])
  const [categories, setCategories] = useState<MerchCategory[]>([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set())
  const isMobile = useIsMobile();
  const { t } = useTranslation();

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
        <LavaTypo variant='h1' textAlign='center'>{t.shop.title}</LavaTypo>

        <Box maxW={'700px'} mx={'auto'} mt={3} px={4} textAlign={'center'}>
          <LavaTypo color='gray' style={{ fontSize: '14px' }}>{t.cart.shippingNotice}</LavaTypo>
        </Box>

        {items.length > 0 && (
          <ShopFilters
            categories={categories}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
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
                <LavaTypo variant="h3" style={{ marginBottom: '16px' }}>{t.shop.otherItems}</LavaTypo>
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
              <LavaTypo variant='h2' textAlign='center'>{t.shop.emptyState}</LavaTypo>
            </Box>
          )}
        </Box>
      </Flex>
      <Contact />
      <Footer />
      <LanguageToggle />
    </Container>
  )
}
