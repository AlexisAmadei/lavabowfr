import LavaTypo from '@/components/Design/LavaTypo';
import Loading from '@/components/Design/Loading';
import { toaster } from '@/components/ui/toaster';
import { deleteNewsletterItem, getNewsletterItems } from '@/utils/supabase/newsletter';
import { ActionBar, Box, Button, Checkbox, Portal, Table } from '@chakra-ui/react';
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useMemo, useCallback, memo } from 'react';

// Memoized row component to prevent re-renders
interface TableRowProps {
  item: { id: string; email: string; created_at: string };
  isSelected: boolean;
  onToggle: (changes: { checked: boolean | string }) => void;
  onEmailClick: () => void;
}

const TableRow = memo(({ item, isSelected, onToggle, onEmailClick }: TableRowProps) => (
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

export default function SupTable() {
  const [loading, setLoading] = React.useState(false);
  const [newsletterItems, setNewsletterItems] = React.useState<{ id: string; email: string; created_at: string }[]>([]);
  const [selection, setSelection] = React.useState<Set<string>>(() => new Set());

  const selectionSize = selection.size;
  const indeterminate = useMemo(
    () => selectionSize > 0 && selectionSize < newsletterItems.length,
    [selectionSize, newsletterItems.length]
  );

  async function fetchNewsletterItems() {
    setLoading(true);
    try {
      const items = await getNewsletterItems();
      setNewsletterItems(items || []);
      setSelection(new Set());
    } catch (error) {
      console.error('Error fetching newsletter items:', error);
      toaster.create({
        title: 'Erreur lors de la récupération des éléments',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNewsletterItems();
  }, []);

  const handleEmailClick = useCallback((email: string) => {
    navigator.clipboard.writeText(email);
    toaster.create({
      title: 'Email copié dans le presse-papier !',
      type: 'success',
    });
  }, []);

  const handleToggleRow = useCallback((itemId: string) => (changes: { checked: any; }) => {
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

    try {
      // Delete selected items from Supabase
      const deletePromises = Array.from(selection).map(id => deleteNewsletterItem(Number(id)));
      await Promise.all(deletePromises);

      toaster.create({
        title: `${selection.size} élément(s) supprimé(s)`,
        type: 'success',
      });

      setNewsletterItems(prev => prev.filter(item => !selection.has(item.id)));
      setSelection(new Set());
    } catch (error) {
      console.error('Error deleting items:', error);
      toaster.create({
        title: 'Erreur lors de la suppression',
        type: 'error',
      });
    }
  }, [selection]);

  const handleExport = useCallback(() => {
    if (selection.size === 0) return;

    const selectedItems = newsletterItems.filter(item => selection.has(item.id));
    const csvContent = [
      ['Email', 'Date inscription'].join(','),
      ...selectedItems.map(item => [
        item.email,
        new Date(item.created_at).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `supabase_newsletter_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toaster.create({
      title: `${selection.size} élément(s) exporté(s)`,
      type: 'success',
    });
  }, [selection, newsletterItems]);

  if (newsletterItems.length === 0 && !loading) {
    return (
      <Box>
        <LavaTypo variant='h4' color='black'>Newsletter Supabase</LavaTypo>
        <LavaTypo variant='p' color='gray'>Aucun élément de newsletter trouvé.</LavaTypo>
      </Box>
    );
  }

  return (
    <Box>
      <LavaTypo variant='h4' color='black'>Newsletter Supabase</LavaTypo>
      <Table.Root interactive stickyHeader>
        <Table.Caption />
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="6">
              <Checkbox.Root
                size="sm"
                mt="0.5"
                aria-label="Select all rows"
                checked={indeterminate ? "indeterminate" : selectionSize === newsletterItems.length && newsletterItems.length > 0}
                onCheckedChange={(changes) => {
                  if (changes.checked) {
                    setSelection(new Set(newsletterItems.map((item) => item.id)));
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
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={3}>
                <Loading />
              </Table.Cell>
            </Table.Row>
          ) : (
            newsletterItems.map((item) => (
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
    </Box>
  );
}
