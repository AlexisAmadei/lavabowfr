import { Badge, Box, Button, Checkbox, Flex, NativeSelect, Spinner, Table, Text } from '@chakra-ui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toaster } from '@/components/ui/toaster'
import { fetchOrders, setOrderPrepared } from './api'
import OrderDetailDialog from './OrderDetailDialog'
import {
  canTogglePrepared,
  formatDate,
  formatEuro,
  isPrepared,
  STATUS_COLOR,
  type Order,
  type OrderPreparation,
  type OrderStatus,
  type PreparationFilter,
} from './types'

const STATUS_FILTERS: Array<OrderStatus | 'all'> = ['all', 'paid', 'pending', 'refunded', 'failed', 'expired']

const PREPARATION_FILTERS: Array<{ value: PreparationFilter; label: string }> = [
  { value: 'all', label: 'All preparation' },
  { value: 'to_prepare', label: 'To prepare' },
  { value: 'prepared', label: 'Prepared' },
]

const NOT_PREPARED: OrderPreparation = { prepared_at: null, prepared_by: null, prepared_by_email: null }

function matchesPreparation(order: Order, filter: PreparationFilter): boolean {
  if (filter === 'to_prepare') return order.status === 'paid' && !isPrepared(order)
  if (filter === 'prepared') return isPrepared(order)
  return true
}

export default function AdminSales() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [preparationFilter, setPreparationFilter] = useState<PreparationFilter>('all')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  // Orders with a preparation save in flight; their toggles are locked so a
  // fast double click can't race two requests against each other.
  const [savingIds, setSavingIds] = useState<ReadonlySet<string>>(new Set())

  const loadOrders = useCallback(async (isCancelled: () => boolean = () => false) => {
    setLoading(true)
    setError(null)
    try {
      const fetched = await fetchOrders()
      if (!isCancelled()) setOrders(fetched)
    } catch (err) {
      console.error('Failed to fetch orders', err)
      if (!isCancelled()) setError('Impossible de charger les commandes.')
    } finally {
      if (!isCancelled()) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    loadOrders(() => cancelled)
    return () => {
      cancelled = true
    }
  }, [loadOrders])

  const patchOrder = (orderId: string, patch: OrderPreparation) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...patch } : o)))
  }

  const setSaving = (orderId: string, saving: boolean) => {
    setSavingIds((prev) => {
      const next = new Set(prev)
      if (saving) next.add(orderId)
      else next.delete(orderId)
      return next
    })
  }

  const togglePrepared = async (order: Order, prepared: boolean) => {
    if (savingIds.has(order.id)) return
    const { prepared_at, prepared_by, prepared_by_email } = order
    const previous: OrderPreparation = { prepared_at, prepared_by, prepared_by_email }
    setSaving(order.id, true)
    // Optimistic: the server response replaces this with the real preparer and timestamp.
    patchOrder(order.id, prepared ? { ...NOT_PREPARED, prepared_at: new Date().toISOString() } : NOT_PREPARED)
    try {
      patchOrder(order.id, await setOrderPrepared(order.id, prepared))
    } catch (err) {
      console.error('Failed to update order preparation', err)
      patchOrder(order.id, previous)
      toaster.create({
        title: 'Échec de la mise à jour',
        description: "La préparation de la commande n'a pas pu être enregistrée.",
        type: 'error',
        duration: 5000,
      })
    } finally {
      setSaving(order.id, false)
    }
  }

  const filteredOrders = useMemo(
    () =>
      orders.filter(
        (o) => (statusFilter === 'all' || o.status === statusFilter) && matchesPreparation(o, preparationFilter),
      ),
    [orders, statusFilter, preparationFilter],
  )

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null

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
        <NativeSelect.Root maxW="200px">
          <NativeSelect.Field
            value={preparationFilter}
            onChange={(e) => setPreparationFilter(e.target.value as PreparationFilter)}
            color="black"
          >
            {PREPARATION_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <Text color="gray.600" fontSize="sm">
          {filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'}
        </Text>
        <Button size="sm" variant="outline" onClick={() => loadOrders()}>
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
                <Table.ColumnHeader w="1%">Prepared</Table.ColumnHeader>
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
                  <Table.Cell colSpan={7}>
                    <Text color="gray.500">No orders found.</Text>
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredOrders.map((o) => {
                  const prepared = isPrepared(o)
                  return (
                    <Table.Row
                      key={o.id}
                      color={prepared ? 'gray.500' : 'black'}
                      bg={prepared ? 'green.50' : undefined}
                      cursor="pointer"
                      onClick={() => setSelectedOrderId(o.id)}
                    >
                      <Table.Cell textAlign="center" onClick={(e) => e.stopPropagation()}>
                        <Checkbox.Root
                          aria-label="Prepared"
                          checked={prepared}
                          disabled={!canTogglePrepared(o) || savingIds.has(o.id)}
                          onCheckedChange={(details) => togglePrepared(o, details.checked === true)}
                          colorPalette="green"
                        >
                          <Checkbox.HiddenInput />
                          <Checkbox.Control />
                        </Checkbox.Root>
                      </Table.Cell>
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
                  )
                })
              )}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      )}

      <OrderDetailDialog
        order={selectedOrder}
        onClose={() => setSelectedOrderId(null)}
        onTogglePrepared={togglePrepared}
        isSaving={selectedOrderId !== null && savingIds.has(selectedOrderId)}
      />
    </Box>
  )
}
