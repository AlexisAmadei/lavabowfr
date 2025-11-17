import LavaTypo from "@/components/Design/LavaTypo";
import { Flex } from "@chakra-ui/react";

export default function TicketPlacement({ type, number }) {
  return (
    <Flex style={{ transform: 'rotate(90deg)' }} direction={'column'}>
      <LavaTypo variant={'h3'} size={'8px'}>{type}</LavaTypo>
      <LavaTypo variant={'h3'} size={'24px'}>{number}</LavaTypo>
    </Flex>
  );
}