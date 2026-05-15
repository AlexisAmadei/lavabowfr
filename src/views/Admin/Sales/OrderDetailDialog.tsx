import { Badge, Box, Button, Dialog, Flex, Portal, Stack, Table, Text } from '@chakra-ui/react'
import { formatEuro, STATUS_COLOR, type Order } from './types'

interface Props {
  order: Order | null
  onClose: () => void
}

function formatAddress(addr: Order['shipping_address']): string[] {
  if (!addr) return []
  const lines: string[] = []
  if (addr.line1) lines.push(addr.line1)
  if (addr.line2) lines.push(addr.line2)
  const cityLine = [addr.postal_code, addr.city].filter(Boolean).join(' ')
  if (cityLine) lines.push(cityLine)
  if (addr.state) lines.push(addr.state)
  if (addr.country) lines.push(addr.country)
  return lines
}

export default function OrderDetailDialog({ order, onClose }: Props) {
  const open = order !== null

  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(e) => {
        if (!e.open) onClose()
      }}
      placement="center"
      size="lg"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title color="black">
                Order details
                {order && (
                  <Text as="span" fontSize="sm" color="gray.500" ml={2}>
                    #{order.id.slice(0, 8)}
                  </Text>
                )}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body color="black">
              {order && (
                <Stack gap={4}>
                  <Flex gap={2} align="center" flexWrap="wrap">
                    <Badge colorPalette={STATUS_COLOR[order.status]}>{order.status}</Badge>
                    <Text fontSize="sm" color="gray.600">
                      Created {new Date(order.created_at).toLocaleString('fr-FR')}
                    </Text>
                    {order.paid_at && (
                      <Text fontSize="sm" color="gray.600">
                        · Paid {new Date(order.paid_at).toLocaleString('fr-FR')}
                      </Text>
                    )}
                  </Flex>

                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={1}>
                      Customer
                    </Text>
                    <Text fontSize="sm">{order.email ?? '—'}</Text>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={1}>
                      Delivery
                    </Text>
                    <Text fontSize="sm">
                      {order.delivery_method === 'shipping' ? 'Shipping' : 'In hand'}
                    </Text>
                    {order.delivery_method === 'shipping' && (
                      <Box mt={2} fontSize="sm" color="gray.700">
                        {formatAddress(order.shipping_address).map((line, idx) => (
                          <Text key={idx}>{line}</Text>
                        ))}
                        {formatAddress(order.shipping_address).length === 0 && (
                          <Text color="gray.500">No address recorded.</Text>
                        )}
                      </Box>
                    )}
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>
                      Items
                    </Text>
                    <Table.Root size="sm" variant="line">
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeader>Product</Table.ColumnHeader>
                          <Table.ColumnHeader>Unit</Table.ColumnHeader>
                          <Table.ColumnHeader>Qty</Table.ColumnHeader>
                          <Table.ColumnHeader textAlign="end">Line total</Table.ColumnHeader>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {order.items.map((item) => (
                          <Table.Row key={item.id}>
                            <Table.Cell>{item.name_snapshot}</Table.Cell>
                            <Table.Cell>{formatEuro(item.price_cents_snapshot)}</Table.Cell>
                            <Table.Cell>{item.quantity}</Table.Cell>
                            <Table.Cell textAlign="end">
                              {formatEuro(item.price_cents_snapshot * item.quantity)}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table.Root>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>
                      Totals
                    </Text>
                    <Stack gap={1} fontSize="sm">
                      <Flex justify="space-between">
                        <Text color="gray.600">Subtotal</Text>
                        <Text>{formatEuro(order.subtotal_cents)}</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text color="gray.600">Shipping</Text>
                        <Text>{formatEuro(order.shipping_cost_cents)}</Text>
                      </Flex>
                      {order.discount_amount_cents > 0 && (
                        <Flex justify="space-between">
                          <Text color="gray.600">
                            Discount{order.discount_code ? ` (${order.discount_code})` : ''}
                          </Text>
                          <Text>− {formatEuro(order.discount_amount_cents)}</Text>
                        </Flex>
                      )}
                      <Flex justify="space-between" fontWeight="semibold" pt={1}>
                        <Text>Total</Text>
                        <Text>{formatEuro(order.total_cents)}</Text>
                      </Flex>
                    </Stack>
                  </Box>

                  {(order.stripe_session_id || order.stripe_payment_intent_id) && (
                    <Box>
                      <Text fontSize="sm" fontWeight="semibold" mb={1}>
                        Stripe
                      </Text>
                      <Stack gap={0} fontSize="xs" color="gray.600">
                        {order.stripe_session_id && (
                          <Text>Session: {order.stripe_session_id}</Text>
                        )}
                        {order.stripe_payment_intent_id && (
                          <Text>Payment intent: {order.stripe_payment_intent_id}</Text>
                        )}
                      </Stack>
                    </Box>
                  )}
                </Stack>
              )}
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="subtle" colorPalette="gray" onClick={onClose}>
                Close
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
