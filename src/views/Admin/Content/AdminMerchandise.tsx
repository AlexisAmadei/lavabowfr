import Divider from "@/components/Design/Divider";
import LavaButton from "@/components/Design/LavaButton";
import LavaTypo from "@/components/Design/LavaTypo";
import Loading from "@/components/Design/Loading";
import ShopDialog from "@/components/Sections/Shop/ShopDialog";
import ShopItemCard from "@/components/Sections/Shop/ShopItemCard";
import CategoryDialog from "@/components/Sections/Shop/CategoryDialog";
import { fetchMerchItems, MerchItem, updateMerchItem, MerchCategory, fetchMerchCategories, addMerchCategory, updateMerchCategory, deleteMerchCategory } from "@/utils/supabase/shop";
import { Box, Button, Flex, IconButton, Switch } from "@chakra-ui/react";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function AdminMerchandise() {
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemIdToEdit, setItemIdToEdit] = useState<number | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState({
    open: false,
    type: 'edit' as 'edit' | 'add'
  });

  // Category Dialog State
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categories, setCategories] = useState<MerchCategory[]>([]);
  const [categoryFormData, setCategoryFormData] = useState<MerchCategory>({
    id: 0,
    name: '',
  });

  // Form Data
  const [formData, setFormData] = useState<MerchItem>({
    name: '',
    description: '',
    price: 0,
    stock: null,
    tags: [],
    stripe_paylink: '',
    status: 'INACTIVE',
    category: undefined,
    sizes: [],
  });

  const handleOpenDialog = (item?: MerchItem | null) => {
    setItemIdToEdit(item?.id || null);
    setEditDialogOpen(prev => ({
      open: !prev.open,
      type: item ? 'edit' : 'add'
    }));
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        stock: item.stock ?? null,
        tags: item.tags || [],
        stripe_paylink: item.stripe_paylink,
        status: item.status,
        category: item.category,
        sizes: item.sizes ?? [],
      });
    }
  }

  function formValidation(): boolean {
    if (formData.name.trim() === '') return false;
    if (formData.description.trim() === '') return false;
    if (Number(formData.price) < 0) return false;
    if (formData.stock !== undefined && formData.stock !== null && (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0)) return false;
    if (formData.stripe_paylink.length === 10) return false;
    return true;
  }

  const handleFormUpdate = async (itemId: number, updatedData?: Partial<MerchItem>) => {
    const updatedItem: MerchItem = {
      id: itemId,
      name: updatedData?.name ?? formData.name,
      description: updatedData?.description ?? formData.description,
      price: updatedData?.price ?? formData.price,
      stock: updatedData?.stock ?? formData.stock,
      tags: updatedData?.tags ?? (formData.tags || []),
      stripe_paylink: updatedData?.stripe_paylink ?? formData.stripe_paylink,
      status: updatedData?.status ?? formData.status,
      image_url: updatedData?.image_url ?? formData.image_url,
      category: updatedData?.category ?? formData.category
    };
    const success = await updateMerchItem(updatedItem);
    if (success) {
      const merchItems = await fetchMerchItems();
      setMerchItems(merchItems);
      setEditDialogOpen({ open: false, type: 'edit' });
    }
  }

  const handleAddNewItem = () => {
    setEditDialogOpen({ open: true, type: 'add' });
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: null,
      tags: [],
      stripe_paylink: '',
      status: 'INACTIVE',
      category: undefined,
      sizes: [],
    });
  };

  const handleOpenCategoryDialog = () => {
    setCategoryDialogOpen(!categoryDialogOpen);
    if (!categoryDialogOpen) {
      // Fetch categories when opening the dialog
      fetchCategories();
    } else {
      setCategoryFormData({ id: 0, name: '' });
    }
  };

  const fetchCategories = async () => {
    const categories = await fetchMerchCategories();
    setCategories(categories);
  };

  const handleDeleteCategory = async (categoryId: number) => {
    const success = await deleteMerchCategory(categoryId);
    if (success) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  const handleSaveCategory = async () => {
    if (categoryFormData.name.trim() === '') return;

    const success = await addMerchCategory(categoryFormData.name);
    if (success) {
      // Fetch updated categories
      await fetchCategories();
      setCategoryFormData({ id: 0, name: '' });
    }
  };

  const handleStatusToggle = async (item: MerchItem, checked: boolean) => {
    const nextStatus = checked ? 'ACTIVE' : 'INACTIVE';
    const success = await updateMerchItem({ ...item, status: nextStatus });

    if (!success) return;

    setMerchItems((prev) => prev.map((merchItem) =>
      merchItem.id === item.id ? { ...merchItem, status: nextStatus } : merchItem
    ));
  };

  async function fetchData() {
    const [items, cats] = await Promise.all([fetchMerchItems(), fetchMerchCategories()]);
    setMerchItems(items);
    setCategories(cats);
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        await fetchData();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4} color={'black'}>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <LavaTypo variant="h2">Lava Shop</LavaTypo>
        <LavaButton variant="filled" onClick={handleAddNewItem}>Ajouter un article</LavaButton>
      </Flex>

      <Flex direction={'column'}>
        <Button variant={'subtle'} width={'fit-content'} onClick={handleOpenCategoryDialog}>
          Edit categories
        </Button>
      </Flex>

      {/* Category Dialog */}
      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        categories={categories}
        categoryFormData={categoryFormData}
        onCategoryFormDataChange={setCategoryFormData}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        onUpdateCategory={updateMerchCategory}
      />

      <Box position={'relative'} minHeight={isLoading ? '160px' : undefined}>
        {isLoading && (
          <Flex justifyContent={'center'} alignItems={'center'} py={16} gap={3} color={'black'}>
            <Loading acaxis={'horizontal'} />
            <LavaTypo variant={'p'} size={'14px'}>Chargement des articles…</LavaTypo>
          </Flex>
        )}

        {!isLoading && merchItems.length === 0 && (
          <LavaTypo variant={'p'} styles={{ color: 'black' }} size={'16px'}>
            Aucun article disponible. Ajoutez-en un en cliquant sur "Ajouter un article".
          </LavaTypo>
        )}

        {/* Group items by category */}
        {!isLoading && categories.map((category) => {
          const categoryItems = merchItems.filter(item => item.category === category.id);
          if (categoryItems.length === 0) return null;

          return (
            <Box key={category.id} mb={8}>
              <LavaTypo variant="h3" color={'black'} style={{ marginBottom: '16px'}}>{category.name}</LavaTypo>
              <Flex wrap={'wrap'} gap={4}>
                {categoryItems.map((item) => (
                  <Box key={item.id} position={'relative'} display={'inline-block'}>
                    <IconButton aria-label="Edit item" position={'absolute'} top={0} left={0} zIndex={1} borderRadius={'full'} onClick={() => handleOpenDialog(item)}>
                      <FontAwesomeIcon icon={faPen} />
                    </IconButton>

                    <Box position={'absolute'} top={0} right={0} zIndex={1} backgroundColor={'white'} borderRadius={'md'} px={2} py={1}>
                      <Switch.Root
                        checked={item.status === 'ACTIVE'}
                        onCheckedChange={(details) => handleStatusToggle(item, details.checked)}
                        size={'sm'}
                        colorPalette={item.status === 'ACTIVE' ? 'green' : 'gray'}
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>{item.status === 'ACTIVE' ? 'Active' : 'Inactive'}</Switch.Label>
                      </Switch.Root>
                    </Box>

                    <ShopItemCard item={item} isAdminView={true} />
                  </Box>
                ))}
              </Flex>
              <Box my={5}>
                <Divider orientation="horizontal" />
              </Box>
            </Box>
          );
        })}

        {/* Items without category */}
        {(() => {
          const noCategory = merchItems.filter(item => !item.category);
          return noCategory.length > 0 ? (
            <Box mb={8}>
              <LavaTypo variant="h3" color={'black'} style={{ marginBottom: '16px', color: 'GrayText'}}>No Category</LavaTypo>
              <Flex wrap={'wrap'} gap={4}>
                {noCategory.map((item) => (
                  <Box key={item.id} position={'relative'} display={'inline-block'}>
                    <IconButton aria-label="Edit item" position={'absolute'} top={0} left={0} zIndex={1} borderRadius={'full'} onClick={() => handleOpenDialog(item)}>
                      <FontAwesomeIcon icon={faPen} />
                    </IconButton>

                    <Box position={'absolute'} top={0} right={0} zIndex={1} backgroundColor={'white'} borderRadius={'md'} px={2} py={1}>
                      <Switch.Root
                        checked={item.status === 'ACTIVE'}
                        onCheckedChange={(details) => handleStatusToggle(item, details.checked)}
                        size={'sm'}
                        colorPalette={item.status === 'ACTIVE' ? 'green' : 'gray'}
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label>{item.status === 'ACTIVE' ? 'Active' : 'Inactive'}</Switch.Label>
                      </Switch.Root>
                    </Box>

                    <ShopItemCard item={item} isAdminView={true} />
                  </Box>
                ))}
              </Flex>
            </Box>
          ) : null;
        })()}

        <ShopDialog
          editDialogOpen={editDialogOpen}
          handleOpenDialog={handleOpenDialog}
          formData={formData}
          setFormData={setFormData}
          handleFormUpdate={handleFormUpdate}
          formValidation={formValidation}
          itemIdToEdit={itemIdToEdit!}
          onClose={fetchData}
          dialogType={editDialogOpen.type}
        />

      </Box>
    </Box>
  )
}
