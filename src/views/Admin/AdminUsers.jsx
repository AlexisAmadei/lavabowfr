import LavaTypo from '@/components/Design/LavaTypo'
import { Toaster, toaster } from '@/components/ui/toaster';
import { getNewsletterItems } from '@/utils/supabase/newsletter';
import { Box, Flex, Table } from '@chakra-ui/react'
import React, { useEffect } from 'react'

export default function AdminUsers() {

  const [emailList, setEmailList] = React.useState([]);

  async function fetchEmails() {
    const result = await getNewsletterItems();
    setEmailList(result);
  }

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleEmailClick = (email) => {
    navigator.clipboard.writeText(email);
    toaster.create({
      title: 'Email copié dans le presse-papier !',
      type: 'success',
      placement: 'bottom-end',
    });
  };

  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
      <LavaTypo variant='h3' color='black'>CRM - Newsletter</LavaTypo>

      <Table.Root interactive>
        <Table.Caption />
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>
              <LavaTypo variant='p' color='black'>Email</LavaTypo>
            </Table.ColumnHeader>
            <Table.ColumnHeader>
              <LavaTypo variant='p' color='black'>Date d'inscription</LavaTypo>
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {emailList.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell onClick={() => handleEmailClick(item.email)} style={{ cursor: 'pointer' }}>
                <LavaTypo variant='p' color='black' size={14}>{item.email}</LavaTypo>
              </Table.Cell>
              <Table.Cell>
                <LavaTypo variant='p' color='gray' size={14}>Inscrit le {new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</LavaTypo>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Toaster />
    </Box>
  )
}
