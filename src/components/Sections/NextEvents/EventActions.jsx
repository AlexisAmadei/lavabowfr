import LavaButton from '@/components/Design/LavaButton'
import { Box, Flex } from '@chakra-ui/react'
import Barcode from 'react-barcode'

export default function EventActions() {
  return (
    <Flex
      className="event-action"
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      width={!isMobile ? "auto" : "100%"}
      gap="12px"
    >
      <div style={{ alignSelf: isMobile ? "center" : "flex-end" }}>
        <Logo h="35px" w="35px" />
      </div>

      <Flex direction="column" alignItems="center" gap={3}>
        <Box style={{ height: '33px', width: '194px' }} overflow="hidden" className="barcode-container">
          <Barcode value="lavabow" height={33} displayValue={false} margin={0} background="transparent" />
        </Box>
        <LavaButton variant="filled" style={{ width: '100%' }}>
          Je prends ma place
        </LavaButton>
      </Flex>
    </Flex>
  )
}
