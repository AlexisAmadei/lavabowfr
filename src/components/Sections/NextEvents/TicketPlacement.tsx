import LavaTypo from "@/components/Design/LavaTypo";
import { Flex } from "@chakra-ui/react";

export default function TicketPlacement({ type, number, isMobile }: { type: string; number: string; isMobile: boolean | null }) {
  return (
    <Flex style={{ transform: isMobile ? '' : 'rotate(90deg)' }} direction={'column'} alignItems={'center'}>
      <LavaTypo variant={'h3'} size={'6px'} styles={{ margin: 0, fontWeight: '500' }}>{type}</LavaTypo>
      <LavaTypo variant={'h3'} size={'22px'}>{number}</LavaTypo>
    </Flex>
  );
}