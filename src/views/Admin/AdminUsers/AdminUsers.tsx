import LavaTypo from '@/components/Design/LavaTypo'
import { Toaster, toaster } from '@/components/ui/toaster';
import { ActionBar, Box, Button, Flex, Portal } from '@chakra-ui/react'
import { faArrowDown, faArrowsRotate, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useCallback } from 'react'
import SupTable from './SupTable';
import MailChimp from './MailChimp';

const LOCAL_DATA = [
  { id: 1, email: 'example@example.com' },
  { id: 1, email: 'example@example.com' },
]

export default function AdminUsers() {
  const [emailList, setEmailList] = React.useState<Array<{
    id: string | number;
    email: string;
    created_at?: string;
    firstName?: string;
    lastName?: string;
    status?: string;
  }>>([]);
  const [selection, setSelection] = React.useState(() => new Set());

  const selectionSize = selection.size;

  async function fetchEmails() {
    try {
      const contactsResponse = await fetch('/api/mailchimp/getcontact');

      if (contactsResponse.ok) {
        const data = await contactsResponse.json();

        // Map Mailchimp data to your format
        if (data.contacts && Array.isArray(data.contacts)) {
          const formattedEmails = data.contacts.map((contact: { id: string; unique_email_id: string; email_address: string; email_channel: { email: string }; created_at: string; merge_fields: { FNAME: string; LNAME: string }; status: string }) => ({
            id: contact.id || contact.unique_email_id || contact.email_address,
            email: contact.email_channel?.email || 'N/A',
            created_at: contact.created_at,
            firstName: contact.merge_fields?.FNAME || '',
            lastName: contact.merge_fields?.LNAME || '',
            status: contact.status
          }));
          setEmailList(formattedEmails);
          setSelection(new Set());
        }
      } else {
        const errorText = await contactsResponse.text();
        console.error('Error response:', errorText);
        console.error('Error fetching contacts:', contactsResponse.statusText);
        toaster.create({
          title: 'Erreur lors de la récupération des contacts',
          type: 'error',
        });
        // setEmailList(LOCAL_DATA); // Fallback to local data
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toaster.create({
        title: 'Erreur de connexion',
        type: 'error',
      });
      setEmailList(LOCAL_DATA); // Fallback to local data
    }
  }

  const handleDelete = useCallback(async () => {
    if (selection.size === 0) return;

    // TODO: Implement actual delete API call to Mailchimp
    toaster.create({
      title: `${selection.size} contact(s) supprimé(s)`,
      type: 'success',
    });

    setEmailList(prev => prev.filter(item => !selection.has(item.id)));
    setSelection(new Set());
  }, [selection]);

  const handleExport = useCallback(() => {
    if (selection.size === 0) return;

    const selectedContacts = emailList.filter(item => selection.has(item.id));
    const csvContent = [
      ['Email', 'Prénom', 'Nom', 'Status', 'Date inscription'].join(','),
      ...selectedContacts.map(contact => [
        contact.email,
        contact.firstName || '',
        contact.lastName || '',
        contact.status || '',
        contact.created_at ? new Date(contact.created_at).toLocaleDateString('fr-FR') : 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toaster.create({
      title: `${selection.size} contact(s) exporté(s)`,
      type: 'success',
    });
  }, [selection, emailList]);

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
      <LavaTypo variant='h3' color='black'>CRM - Newsletter</LavaTypo>

      <SupTable />

      <Flex
        direction={'column'}
        p={4}
        alignItems='center'
        justifyContent='center'
        gap={4}
      >
        <FontAwesomeIcon icon={faArrowDown} color='black' />
        <Button
          variant={'subtle'}
          colorPalette={'green'}
        >
          Sync to mailchimp
          <FontAwesomeIcon icon={faArrowsRotate} style={{ marginLeft: 1 }} />
        </Button>
        <FontAwesomeIcon icon={faArrowDown} color='black' />
      </Flex>

      <MailChimp />

      <ActionBar.Root open={selectionSize > 0}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger color={'gray.800'}>
                {selectionSize} sélectionné{selectionSize > 1 ? 's' : ''}
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant="outline" size="sm" onClick={handleDelete} color={'red'}>
                <FontAwesomeIcon icon={faTrash} />
                Supprimer
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} color={'black'}>
                <FontAwesomeIcon icon={faDownload} />
                Exporter
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>

      <Toaster />
    </Box>
  )
}
