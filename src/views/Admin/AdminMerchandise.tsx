import LavaTypo from "@/components/Design/LavaTypo";
import ShopItemCard from "@/components/Sections/Shop/ShopItemCard";
import { fetchMerchItems, MerchItem } from "@/utils/supabase/shop";
import { Box, Button, Dialog, Editable, Field, Flex, IconButton, Input, Stack } from "@chakra-ui/react";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

export default function AdminMerchandise() {
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setEditDialogOpen(!editDialogOpen);
  }

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

      <Box position={'relative'}>
        {merchItems.map((item) => (
          <Box key={item.id} position={'relative'} display={'inline-block'} mr={4} mb={4}>
            <IconButton aria-label="Edit item" position={'absolute'} top={0} left={0} zIndex={1} borderRadius={'full'} onClick={handleOpenDialog}>
              <FontAwesomeIcon icon={faPen} />
            </IconButton>
            <ShopItemCard key={item.id} item={item} isAdminView={true} />
          </Box>
        ))}
      </Box>

      <Dialog.Root open={editDialogOpen} onOpenChange={() => handleOpenDialog()}>
        <Dialog.Backdrop />
        <Dialog.Positioner>

          <Dialog.Content>
            <Flex direction={'column'} backgroundColor={'white'} padding={6} borderRadius={8} minWidth={'400px'}>
              <LavaTypo variant='h3'>Modifier l'article</LavaTypo>

              <form>
                <Stack gap="4" align="flex-start" maxW="sm">
                  <Field.Root>
                    <Field.Label>First name</Field.Label>
                    <Input placeholder="Titre de l'article" />
                    {/* <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText> */}
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Input placeholder="Description de l'article" />
                    {/* <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText> */}
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Prix</Field.Label>
                    <Input placeholder="Prix de l'article €" />
                    {/* <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText> */}
                  </Field.Root>

                  <Button type="submit">Submit</Button>
                </Stack>
              </form>
            </Flex>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  )
}
