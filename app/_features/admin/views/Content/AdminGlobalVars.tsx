import { GlobalVarContext } from '@/contexts/GlobalContext'
import { deleteGlobalVariable, insertGlobalVariable, updateGlobalVariableValue } from '@/utils/supabase/global_variables'
import { Box, Button, Flex, IconButton, Input, Table, Text } from '@chakra-ui/react'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChangeEvent, useContext, useEffect, useMemo, useState } from 'react'

type SortKey = 'name' | 'value'
type SortDirection = 'asc' | 'desc'

export default function AdminGlobalVars() {
  const globalVariables = useContext(GlobalVarContext)
  const [items, setItems] = useState(globalVariables)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  useEffect(() => {
    setItems(globalVariables)
  }, [globalVariables])

  const filteredGlobalVariables = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    if (!normalizedSearch) {
      return items
    }

    return items.filter((item) =>
      item.name.toLowerCase().includes(normalizedSearch) ||
      item.value.toLowerCase().includes(normalizedSearch)
    )
  }, [items, search])

  const sortedGlobalVariables = useMemo(() => {
    return [...filteredGlobalVariables].sort((a, b) => {
      const left = sortKey === 'name' ? a.name : a.value
      const right = sortKey === 'name' ? b.name : b.value
      const comparison = left.localeCompare(right, undefined, {
        sensitivity: 'base',
        numeric: true,
      })

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [filteredGlobalVariables, sortDirection, sortKey])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((previousDirection) =>
        previousDirection === 'asc' ? 'desc' : 'asc'
      )
      return
    }

    setSortKey(key)
    setSortDirection('asc')
  }

  const getSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return '↕'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  const handleEditValue = async (id: number, currentValue: string, keyword: string) => {
    const nextValue = window.prompt(`Edit value for ${keyword}`, currentValue)

    if (nextValue === null || nextValue === currentValue) return

    const isUpdated = await updateGlobalVariableValue(id, nextValue)
    if (!isUpdated) return

    setItems((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, value: nextValue } : item
      )
    )
  }

  const handleDelete = async (id: number) => {
    const isConfirmed = window.confirm('Delete this global variable?')
    if (!isConfirmed) return

    const isDeleted = await deleteGlobalVariable(id)
    if (!isDeleted) return

    setItems((previous) => previous.filter((item) => item.id !== id))
  }

  const handleAdd = async () => {
    const keyword = window.prompt('Keyword (name) for the new global variable')?.trim()
    if (!keyword) return

    const value = window.prompt(`Value for ${keyword}`)
    if (value === null) return

    const createdItem = await insertGlobalVariable(keyword, value)
    if (!createdItem) return

    setItems((previous) => [...previous, createdItem])
  }

  return (
    <Box>
      <Text fontSize="xl" fontWeight="semibold" color="black" mb={4}>
        Global variables
      </Text>

      <Flex gap={2} mb={4} flexWrap="wrap">
        <Button onClick={handleAdd}>Add global item</Button>
        <Input
          placeholder="Search keyword or value"
          value={search}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
          maxW="400px"
        />
        <Button
          variant="outline"
          onClick={() => setSearch('')}
          disabled={search.length === 0}
        >
          Clear
        </Button>
      </Flex>

      <Table.ScrollArea borderWidth="1px" borderRadius="md">
        <Table.Root interactive stickyHeader>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>
                <Button variant="ghost" size="sm" onClick={() => handleSort('name')}>
                  Keyword {getSortIndicator('name')}
                </Button>
              </Table.ColumnHeader>
              <Table.ColumnHeader>
                <Button variant="ghost" size="sm" onClick={() => handleSort('value')}>
                  Value {getSortIndicator('value')}
                </Button>
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedGlobalVariables.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={3}>
                  <Text color="gray.500">No global variables found.</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              sortedGlobalVariables.map((item) => (
                <Table.Row key={item.id} color={'black'}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.value}</Table.Cell>
                  <Table.Cell textAlign="end">
                    <Flex justify="flex-end" gap={1}>
                      <IconButton
                        variant="ghost"
                        size="xs"
                        aria-label={`Edit value for ${item.name}`}
                        onClick={() => handleEditValue(item.id, item.value, item.name)}
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </IconButton>
                      <IconButton
                        variant="ghost"
                        size="xs"
                        aria-label={`Delete ${item.name}`}
                        colorPalette="red"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  )
}
