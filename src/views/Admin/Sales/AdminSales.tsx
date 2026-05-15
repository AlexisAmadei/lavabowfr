import { Badge, Box, Button, Flex, NativeSelect, Spinner, Table, Text } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import OrderDetailDialog from './OrderDetailDialog'
import { formatEuro, STATUS_COLOR, type Order, type OrderStatus } from './types'

const STATUS_FILTERS: Array<OrderStatus | 'all'> = ['all', 'paid', 'pending', 'refunded', 'failed', 'expired']

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminSales() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/list-orders')
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelled) setOrders(json.orders ?? [])
      } catch (err) {
        console.error('Failed to fetch orders', err)
        if (!cancelled) setError('Impossible de charger les commandes.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') return orders
    return orders.filter((o) => o.status === statusFilter)
  }, [orders, statusFilter])

  const itemsCount = (o: Order) => o.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <Box>
      <Text fontSize="xl" fontWeight="semibold" color="black" mb={4}>
        Sales
      </Text>

      <Flex gap={3} mb={4} align="center" flexWrap="wrap">
        <NativeSelect.Root maxW="200px">
          <NativeSelect.Field
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            color="black"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'All statuses' : s}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <Text color="gray.600" fontSize="sm">
          {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'}
        </Text>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setLoading(true)
            fetch('/api/list-orders')
              .then((r) => r.json())
              .then((j) => setOrders(j.orders ?? []))
              .catch((err) => {
                console.error(err)
                setError('Impossible de charger les commandes.')
              })
              .finally(() => setLoading(false))
          }}
        >
          Refresh
        </Button>
      </Flex>

      {loading ? (
        <Flex justify="center" py={10}>
          <Spinner />
        </Flex>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Table.ScrollArea borderWidth="1px" borderRadius="md">
          <Table.Root interactive stickyHeader>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Date</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Items</Table.ColumnHeader>
                <Table.ColumnHeader>Total</Table.ColumnHeader>
                <Table.ColumnHeader>Delivery</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredOrders.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <Text color="gray.500">No orders found.</Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredOrders.map((o) => (
                  <Table.Row
                    key={o.id}
                    color="black"
                    cursor="pointer"
                    onClick={() => setSelectedOrder(o)}
                  >
                    <Table.Cell whiteSpace="nowrap">
                      {formatDate(o.paid_at ?? o.created_at)}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette={STATUS_COLOR[o.status]}>{o.status}</Badge>
                    </Table.Cell>
                    <Table.Cell>{o.email ?? '—'}</Table.Cell>
                    <Table.Cell>{itemsCount(o)}</Table.Cell>
                    <Table.Cell whiteSpace="nowrap">{formatEuro(o.total_cents)}</Table.Cell>
                    <Table.Cell>
                      {o.delivery_method === 'shipping' ? 'Shipping' : 'In hand'}
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      )}

      <OrderDetailDialog order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </Box>
  )
}
