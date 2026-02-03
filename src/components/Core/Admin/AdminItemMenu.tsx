import { IconButton, Menu, Portal } from '@chakra-ui/react';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface AdminItemMenuProps {
  itemId: number;
  itemStatus: 'active' | 'inactive' | 'ACTIVE' | 'INACTIVE' | string;
  onUpdateStatus: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

export default function AdminItemMenu({
  itemId,
  itemStatus,
  onUpdateStatus,
  onDelete,
}: AdminItemMenuProps) {
  const isActive = itemStatus?.toLowerCase() === 'active';
  const newStatus = isActive ? 'inactive' : 'active';

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton
          variant={'ghost'}
          size={'xs'}
          py={1}
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </IconButton>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item
              value={newStatus}
              onSelect={() => onUpdateStatus(itemId, newStatus)}
            >
              {isActive ? 'Désactiver' : 'Activer'}
            </Menu.Item>
            <Menu.Item
              value="delete"
              color="fg.error"
              _hover={{ bg: "bg.error", color: "fg.error" }}
              onSelect={() => onDelete(itemId)}
            >
              Supprimer
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
