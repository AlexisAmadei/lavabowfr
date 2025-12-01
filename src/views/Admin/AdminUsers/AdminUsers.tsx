import LavaTypo from '@/components/Design/LavaTypo'
import { Toaster, toaster } from '@/components/ui/toaster';
import { ActionBar, Box, Button, Flex, Portal } from '@chakra-ui/react'
import { faArrowDown, faArrowsRotate, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useState } from 'react'
import SupTable from './SupTable';
import MailChimp from './MailChimp';

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
  const [supabaseItemsExist, setSupabaseItemsExist] = useState<boolean>(false);

  const selectionSize = selection.size;

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

  const handleSyncToMailchimp = useCallback(async () => {
    try {
      const res = await fetch('/api/mailchimp/syncToMailchimp', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        toaster.create({
          title: `Synchronisation terminée : ${data.added} ajoutés, ${data.failed} échoués.`,
          type: data.failed > 0 ? 'warning' : 'success',
        });
      } else {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        toaster.create({
          title: 'Erreur lors de la synchronisation',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error during synchronization:', error);
      toaster.create({
        title: 'Erreur lors de la synchronisation',
        type: 'error',
      });
    }
  }, []);

  return (
    <Box flexDirection={'column'} display={'flex'} gap={8} pr={2} mt={4}>
      <LavaTypo variant='h3' color='black'>CRM - Newsletter</LavaTypo>

      <SupTable setSupabaseItemsExist={setSupabaseItemsExist} />

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
          onClick={handleSyncToMailchimp}
          disabled={!supabaseItemsExist}
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
