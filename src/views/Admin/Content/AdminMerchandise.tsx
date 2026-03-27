import LavaButton from "@/components/Design/LavaButton";
import LavaTypo from "@/components/Design/LavaTypo";
import ShopDialog from "@/components/Sections/Shop/ShopDialog";
import ShopItemCard from "@/components/Sections/Shop/ShopItemCard";
import { fetchMerchItems, MerchItem, updateMerchItem } from "@/utils/supabase/shop";
import { Box, Flex, IconButton, Switch } from "@chakra-ui/react";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function AdminMerchandise() {
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [itemIdToEdit, setItemIdToEdit] = useState<number | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState({
    open: false,
    type: 'edit' as 'edit' | 'add'
  });

  // Form Data
  const [formData, setFormData] = useState<MerchItem>({
    name: '',
    description: '',
    price: 0,
    tags: [],
    stripe_paylink: '',
    out_of_stock: false,
    status: 'INACTIVE',
  });

  const handleOpenDialog = (item?: MerchItem | null) => {
    setItemIdToEdit(item?.id || null);
    setEditDialogOpen(prev => ({
      open: !prev.open,
      type: item ? 'edit' : 'add'
    }));
    if (item) {
      console.log('Opening dialog for item:', item.out_of_stock);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        tags: item.tags || [],
        stripe_paylink: item.stripe_paylink,
        out_of_stock: item.out_of_stock,
        status: item.status,
      });
    }
  }

  function formValidation(): boolean {
    if (formData.name.trim() === '') return false;
    if (formData.description.trim() === '') return false;
    if (Number(formData.price) < 0) return false;
    if (formData.stripe_paylink.length === 10) return false;
    return true;
  }

  const handleFormUpdate = async (itemId: number, updatedData?: Partial<MerchItem>) => {
    const updatedItem: MerchItem = {
      id: itemId,
      name: updatedData?.name ?? formData.name,
      description: updatedData?.description ?? formData.description,
      price: updatedData?.price ?? formData.price,
      tags: updatedData?.tags ?? (formData.tags || []),
      stripe_paylink: updatedData?.stripe_paylink ?? formData.stripe_paylink,
      out_of_stock: updatedData?.out_of_stock ?? formData.out_of_stock,
      status: updatedData?.status ?? formData.status,
      image_url: updatedData?.image_url ?? formData.image_url
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
      tags: [],
      stripe_paylink: '',
      out_of_stock: false,
      status: 'INACTIVE',
    });
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
    setMerchItems(await fetchMerchItems());
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4} color={'black'}>
      <Flex justifyContent={'space-between'} alignItems={'center'}>
        <LavaTypo variant="h2">Lava Shop</LavaTypo>
        <LavaButton variant="filled" onClick={handleAddNewItem}>Ajouter un article</LavaButton>
      </Flex>

      <Box position={'relative'}>
        {merchItems.map((item) => (
          <Box key={item.id} position={'relative'} display={'inline-block'} mr={4} mb={4}>
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
