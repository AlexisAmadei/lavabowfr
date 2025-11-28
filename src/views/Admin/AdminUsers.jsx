import LavaTypo from '@/components/Design/LavaTypo'
import Loading from '@/components/Design/Loading';
import { Toaster, toaster } from '@/components/ui/toaster';
import { getNewsletterItems } from '@/utils/supabase/newsletter';
import { ActionBar, Box, Button, Checkbox, Flex, Portal, Table } from '@chakra-ui/react'
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useMemo, useCallback, memo } from 'react'

const LOCAL_DATA = [
  { id: 1, email: 'example@example.com' },
  { id: 2, email: 'test@test.com' },
  { id: 3, email: 'test@test.com' },
  { id: 4, email: 'test@test.com' },
  { id: 5, email: 'test@test.com' },
  { id: 6, email: 'test@test.com' },
  { id: 7, email: 'test@test.com' },
  { id: 8, email: 'test@test.com' },
  { id: 9, email: 'test@test.com' },
  { id: 10, email: 'test@test.com' },
  { id: 11, email: 'test@test.com' },
  { id: 12, email: 'test@test.com' },
  { id: 13, email: 'test@test.com' },
  { id: 14, email: 'test@test.com' },
  { id: 15, email: 'test@test.com' },
  { id: 16, email: 'test@test.com' },
  { id: 17, email: 'test@test.com' },
  { id: 18, email: 'test@test.com' },
  { id: 19, email: 'test@test.com' },
  { id: 20, email: 'test@test.com' },
  { id: 21, email: 'test@test.com' },
  { id: 22, email: 'test@test.com' },
  { id: 23, email: 'test@test.com' },
  { id: 24, email: 'test@test.com' },
  { id: 25, email: 'test@test.com' },
  { id: 26, email: 'test@test.com' },
  { id: 27, email: 'test@test.com' },
  { id: 28, email: 'test@test.com' },
  { id: 29, email: 'test@test.com' },
  { id: 30, email: 'user@domain.com' }
]

// Memoized row component to prevent re-renders
const TableRow = memo(({ item, isSelected, onToggle, onEmailClick }) => (
  <Table.Row>
    <Table.Cell>
      <Checkbox.Root
        size="sm"
        mt="0.5"
        aria-label="Select row"
        checked={isSelected}
        onCheckedChange={onToggle}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
      </Checkbox.Root>
    </Table.Cell>
    <Table.Cell onClick={onEmailClick} style={{ cursor: 'pointer' }}>
      <LavaTypo variant='p' color='black' size={14}>{item.email}</LavaTypo>
    </Table.Cell>
    <Table.Cell>
      <LavaTypo variant='p' color='gray' size={14}>
        Inscrit le {new Date(item.created_at).toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </LavaTypo>
    </Table.Cell>
  </Table.Row>
));

export default function AdminUsers() {
  const [loadingContacts, setLoadingContacts] = React.useState(false);
  const [emailList, setEmailList] = React.useState([]);
  const [selection, setSelection] = React.useState(() => new Set());

  const selectionSize = selection.size;
  const indeterminate = useMemo(
    () => selectionSize > 0 && selectionSize < emailList.length,
    [selectionSize, emailList.length]
  );

  async function fetchEmails() {
    setLoadingContacts(true);
    try {
      const contactsResponse = await fetch('/api/mailchimp/getcontact');

      if (contactsResponse.ok) {
        const data = await contactsResponse.json();

        // Map Mailchimp data to your format
        if (data.contacts && Array.isArray(data.contacts)) {
          const formattedEmails = data.contacts.map(contact => ({
            id: contact.id || contact.unique_email_id || contact.email_address,
            email: contact.email_channel?.email || 'N/A',
            created_at: contact.created_at,
            firstName: contact.merge_fields?.FNAME || '',
            lastName: contact.merge_fields?.LNAME || '',
            status: contact.status
          }));
          setEmailList(formattedEmails);
          setSelection(new Set());
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
        setEmailList(LOCAL_DATA); // Fallback to local data
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toaster.create({
        title: 'Erreur de connexion',
        type: 'error',
        placement: 'bottom-end',
      });
      setLoadingContacts(false);
      setEmailList(LOCAL_DATA); // Fallback to local data
    }
  }

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleEmailClick = useCallback((email) => {
    navigator.clipboard.writeText(email);
    toaster.create({
      title: 'Email copié dans le presse-papier !',
      type: 'success',
      placement: 'bottom-end',
    });
  }, []);

  const handleToggleRow = useCallback((itemId) => (changes) => {
    setSelection((prev) => {
      const next = new Set(prev);
      if (changes.checked) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      return next;
    });
  }, []);

  const handleDelete = useCallback(async () => {
    if (selection.size === 0) return;

    // TODO: Implement actual delete API call to Mailchimp
    toaster.create({
      title: `${selection.size} contact(s) supprimé(s)`,
      type: 'success',
      placement: 'bottom-end',
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
        new Date(contact.created_at).toLocaleDateString('fr-FR')
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
      placement: 'bottom-end',
    });
  }, [selection, emailList]);

  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
      <LavaTypo variant='h3' color='black'>CRM - Newsletter</LavaTypo>

      <Table.Root interactive stickyHeader>
        <Table.Caption />
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="6">
              <Checkbox.Root
                size="sm"
                mt="0.5"
                aria-label="Select all rows"
                checked={indeterminate ? "indeterminate" : selectionSize === emailList.length && emailList.length > 0}
                onCheckedChange={(changes) => {
                  if (changes.checked) {
                    setSelection(new Set(emailList.map((item) => item.id)));
                  } else {
                    setSelection(new Set());
                  }
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
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
            emailList.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                isSelected={selection.has(item.id)}
                onToggle={handleToggleRow(item.id)}
                onEmailClick={() => handleEmailClick(item.email)}
              />
            ))
          )}
        </Table.Body>
      </Table.Root>

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
