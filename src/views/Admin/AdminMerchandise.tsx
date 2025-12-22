import LavaTypo from "@/components/Design/LavaTypo";
import ShopDialog from "@/components/Sections/Shop/ShopDialog";
import ShopItemCard from "@/components/Sections/Shop/ShopItemCard";
import { fetchMerchItems, MerchItem, updateMerchItem } from "@/utils/supabase/shop";
import { Box, Button, IconButton } from "@chakra-ui/react";
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
    stock: 0
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
        tags: item.tags || [],
        stock: item.stock || 0
      });
    }
  }

  function formValidation(): boolean {
    if (formData.name.trim() === '') return false;
    if (formData.description.trim() === '') return false;
    if (Number(formData.price) < 0) return false;
    return true;
  }

  const handleFormUpdate = async (itemId: number) => {
    const updatedItem: MerchItem = {
      id: itemId,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      tags: formData.tags,
      stock: formData.stock
    };
    const success = await updateMerchItem(updatedItem);
    if (success) {
      const merchItems = await fetchMerchItems();
      setMerchItems(merchItems);
      setEditDialogOpen({ open: false, type: 'edit' });
    }
  }

  const handleAddNewItem = () => {
    console.log("Adding new item");
    setEditDialogOpen({ open: true, type: 'add' });
    setFormData({
      name: '',
      description: '',
      price: 0,
      tags: [],
      stock: 0
    });
  };

  useEffect(() => {
    async function fetchData() {
      const merchItems = await fetchMerchItems();
      setMerchItems(merchItems);
    }
    fetchData();
  }, []);

  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4} color={'black'}>
      <LavaTypo variant="h2">Lava Shop</LavaTypo>

      <Button variant="subtle" onClick={handleAddNewItem}>Ajouter un article</Button>
      <Box position={'relative'}>
        {merchItems.map((item) => (
          <Box key={item.id} position={'relative'} display={'inline-block'} mr={4} mb={4}>
            <IconButton aria-label="Edit item" position={'absolute'} top={0} left={0} zIndex={1} borderRadius={'full'} onClick={() => handleOpenDialog(item)}>
              <FontAwesomeIcon icon={faPen} />
            </IconButton>
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
        />
      </Box>
    </Box>
  )
}
