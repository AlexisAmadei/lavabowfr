import LavaTypo from '@/components/Design/LavaTypo'
import Loading from '@/components/Design/Loading';
import { Toaster, toaster } from '@/components/ui/toaster';
import { getNewsletterItems } from '@/utils/supabase/newsletter';
import { Box, Flex, Table } from '@chakra-ui/react'
import React, { useEffect } from 'react'

export default function AdminUsers() {
  const [loadingContacts, setLoadingContacts] = React.useState(false);
  const [emailList, setEmailList] = React.useState([]);

  async function fetchEmails() {
    setLoadingContacts(true);
    try {
      const contactsResponse = await fetch('/api/mailchimp/getcontact');

      if (contactsResponse.ok) {
        const data = await contactsResponse.json();

        // Map Mailchimp data to your format
        if (data.contacts && Array.isArray(data.contacts)) {
          const formattedEmails = data.contacts.map(contact => ({
            email: contact.email_channel?.email || 'N/A',
            created_at: contact.created_at,
            firstName: contact.merge_fields?.FNAME || '',
            lastName: contact.merge_fields?.LNAME || '',
            status: contact.status
          }));
          setEmailList(formattedEmails);
          setLoadingContacts(false);
        }
      } else {
        const errorText = await contactsResponse.text();
        console.error('Error response:', errorText);
        console.error('Error fetching contacts:', contactsResponse.statusText);
        toaster.create({
          title: 'Erreur lors de la récupération des contacts',
          type: 'error',
          placement: 'bottom-end',
        });
        setLoadingContacts(false);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toaster.create({
        title: 'Erreur de connexion',
        type: 'error',
        placement: 'bottom-end',
      });
      setLoadingContacts(false);
    }
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
          {loadingContacts ? (
            <Table.Row>
              <Table.Cell colSpan={2}>
                <Loading />
              </Table.Cell>
            </Table.Row>
          ) : (
            emailList.map((item, index) => (
              <Table.Row key={index}>
                <Table.Cell onClick={() => handleEmailClick(item.email)} style={{ cursor: 'pointer' }}>
                  <LavaTypo variant='p' color='black' size={14}>{item.email}</LavaTypo>
                </Table.Cell>
                <Table.Cell>
                  <LavaTypo variant='p' color='gray' size={14}>Inscrit le {new Date(item.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</LavaTypo>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>
      <Toaster />
    </Box>
  )
}
