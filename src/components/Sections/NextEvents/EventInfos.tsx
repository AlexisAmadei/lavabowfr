import { Box, Flex } from '@chakra-ui/react'

export default function EventInfos({ event }) {
  return (
    <Flex className="event-infos" direction="column" justifyContent="space-between">
      <p className="event-description">{event.description}</p>
      <Box width="100%">
        <Flex className="event-details" direction="row" justifyContent="space-between" pb={1}>
          <p>PRIX</p><div style={{ flex: 1, borderBottom: '1px solid black' }} />
          <p>{event.price}€</p>
        </Flex>
        <Flex className="event-details" direction="row" justifyContent="space-between" pb={1}>
          <p>DATE</p><div style={{ flex: 1, borderBottom: '1px solid black' }} />
          <p>{new Date(event.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })}</p>
        </Flex>
        <Flex className="event-details" direction="row" justifyContent="space-between">
          <p>LIEU</p><div style={{ flex: 1, borderBottom: '1px solid black' }} />
          <p>{event.place}</p>
        </Flex>
      </Box>
    </Flex>
  )
}
