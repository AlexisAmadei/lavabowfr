# Lavabow Shop

The band's merch shop: customers buy items online, pay through Stripe, and receive them by shipping or in hand. Admins follow orders from the backoffice.

## Language

### Orders

**Order**:
One checkout by a customer, covering one or more items, paid (or not) in a single Stripe payment.
_Avoid_: Sale, purchase, transaction

**Payment status**:
Where the order's money stands: pending, paid, failed, expired, refunded or oversold (paid but auto-refunded because stock ran out). Says nothing about whether the goods have been packed.
_Avoid_: Order status (ambiguous with preparation)

**Prepared**:
An order whose goods have been physically packed and are ready to ship or hand over. Applies to the whole order, never to individual items. Only a paid order can be marked or unmarked; one that is later refunded stays prepared, as a record that the goods may have left.
_Avoid_: Noted, checked, done, fulfilled

**Preparer**:
The admin who packs orders and marks them as prepared.
_Avoid_: Packer, fulfiller

**Customer notification**:
An email telling the customer their prepared order is on its way or ready for pickup. Sent only when an admin explicitly chooses to, separately from marking the order prepared. Undoing preparation does not undo a notification.
_Avoid_: Shipping confirmation, order update
