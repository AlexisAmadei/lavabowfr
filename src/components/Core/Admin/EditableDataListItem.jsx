import { DataList, Editable, IconButton } from '@chakra-ui/react'
import React from 'react'
import { LuCheck, LuPencilLine, LuX } from 'react-icons/lu'

/**
 * Reusable editable data list item component
 * @param {Object} props
 * @param {string} props.label - The label to display
 * @param {string} props.value - The current value
 * @param {string} props.placeholder - Placeholder text
 * @param {Function} props.onValueCommit - Callback function when value is committed
 * @returns {JSX.Element}
 */
export default function EditableDataListItem({ label, value, placeholder, onValueCommit }) {
  return (
    <DataList.Item>
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
                <LuPencilLine />
              </IconButton>
            </Editable.EditTrigger>
            <Editable.CancelTrigger asChild>
              <IconButton variant="outline" size="xs" aria-label="Cancel">
                <LuX />
              </IconButton>
            </Editable.CancelTrigger>
            <Editable.SubmitTrigger asChild>
              <IconButton variant="outline" size="xs" aria-label="Submit" colorPalette="green">
                <LuCheck />
              </IconButton>
            </Editable.SubmitTrigger>
          </Editable.Control>
        </Editable.Root>
      </DataList.ItemValue>
    </DataList.Item>
  )
}
