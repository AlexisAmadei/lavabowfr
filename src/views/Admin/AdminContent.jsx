import DeleteDialog from '@/components/Core/Admin/DeleteDialog';
import EditableDataListItem from '@/components/Core/Admin/EditableDataListItem';
import Divider from '@/components/Design/Divider';
import LavaButton from '@/components/Design/LavaButton';
import LavaTypo from '@/components/Design/LavaTypo';
import { deleteSpotlightItem, fetchSpotlightContent, insertSpotlightItem, updateSpotlightItem } from '@/utils/supabase';
import { Box, Button, DataList, Dialog, Field, Fieldset, Flex, Input, Portal } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { BsPlusCircleFill, BsTrashFill } from 'react-icons/bs';
import AdminSpotlight from './AdminSpotlight';
import AdminEvents from './AdminEvents';

export default function AdminContent() {
  return (
    <Box direction={'column'}>
      <AdminSpotlight />
      <AdminEvents />
    </Box>
  )
}