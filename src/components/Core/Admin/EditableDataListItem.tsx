import { DataList, Editable, IconButton } from '@chakra-ui/react'
import { faCheck, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface EditableDataListItemProps {
  label: string
  value: string
  placeholder?: string
  onValueCommit: (value: string) => void
}

/**
 * Reusable editable data list item component
 */
export default function EditableDataListItem({ label, value, placeholder, onValueCommit }: EditableDataListItemProps) {
  return (
    <DataList.Item width={'100%'}>
      <DataList.ItemLabel>{label}</DataList.ItemLabel>
      <DataList.ItemValue>
        <Editable.Root
          defaultValue={value}
          onValueCommit={(e) => onValueCommit(e.value)}
          placeholder={placeholder}
          submitMode="both"
        >
          <Editable.Preview />
          <Editable.Input />
          <Editable.Control>
            <Editable.EditTrigger asChild>
              <IconButton variant="ghost" size="xs" aria-label="Edit">
                <FontAwesomeIcon icon={faPencil} />
              </IconButton>
            </Editable.EditTrigger>
            <Editable.CancelTrigger asChild>
              <IconButton variant="outline" size="xs" aria-label="Cancel">
                <FontAwesomeIcon icon={faXmark} />
              </IconButton>
            </Editable.CancelTrigger>
            <Editable.SubmitTrigger asChild>
              <IconButton variant="outline" size="xs" aria-label="Submit" colorPalette="green">
                <FontAwesomeIcon icon={faCheck} />
              </IconButton>
            </Editable.SubmitTrigger>
          </Editable.Control>
        </Editable.Root>
      </DataList.ItemValue>
    </DataList.Item>
  )
}
