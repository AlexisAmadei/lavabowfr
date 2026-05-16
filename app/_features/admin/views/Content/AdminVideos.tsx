import AddVideoDialog from '@/components/Core/Admin/AddVideoDialog'
import AdminItemMenu from '@/components/Core/Admin/AdminItemMenu'
import DeleteDialog from '@/components/Core/Admin/DeleteDialog'
import LavaTypo from '@/components/Design/LavaTypo'
import { Video } from '@/types/types'
import { supabase } from '@/utils/supabase/supabase'
import { updateItemStatus } from '@/utils/supabase/updateItemStatus'
import { Box, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableVideoItem({
  video,
  videoElement,
  handleUpdateStatus,
  setVideoToDelete,
  setOpenDeleteDialog,
  onEdit
}: {
  video: Video
  videoElement: ({ label, element }: { label: string, element?: string }) => React.JSX.Element
  handleUpdateStatus: (id: number) => void
  setVideoToDelete: (video: Video) => void
  setOpenDeleteDialog: (open: boolean) => void
  onEdit: (video: Video) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id! })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Flex
      ref={setNodeRef}
      style={style}
      direction={'row'}
      justifyContent={'space-between'}
      color={'black'}
      px={'4'}
      py={'2'}
      gap={1}
      borderRadius={'md'}
      borderWidth={'1px'}
      borderColor={'gray.200'}
      width={'full'}
      position={'relative'}
      backgroundColor={'gray.50'}
      cursor={isDragging ? 'grabbing' : 'grab'}
      {...attributes}
      {...listeners}
    >
      <Box>
        {videoElement({
          label: 'Titre (non affiché):',
          element: video.description
        })}
        {videoElement({
          label: 'URL:',
          element: video.url
        })}
      </Box>

      <AdminItemMenu
        itemId={video.id!}
        itemStatus={video.status || ''}
        onUpdateStatus={() => handleUpdateStatus(video.id!)}
        onDelete={() => {
          setVideoToDelete(video)
          setOpenDeleteDialog(true)
        }}
        onEdit={() => onEdit(video)}
      />
    </Flex>
  )
}

export default function AdminVideos({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | undefined>(undefined);
  const [editingVideo, setEditingVideo] = useState<Video | undefined>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  async function fetchVideoContent() {
    const { data, error } = await supabase
      .from('section_videos')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des vidéos :', error);
      return;
    }
    setVideoList(data || []);
  }

  useEffect(() => {
    fetchVideoContent();
  }, []);

  const handleAddVideo = async (data: { description?: string; url?: string; status: 'ACTIVE' | 'INACTIVE' | string; order?: number }) => {
    const maxOrder = videoList.length > 0
      ? Math.max(...videoList.map(v => v.order || 0))
      : 0;

    const { error } = await supabase
      .from('section_videos')
      .insert({
        description: data.description,
        url: data.url,
        status: data.status,
        order: maxOrder + 1
      });

    if (error) {
      console.error('Erreur lors de l\'ajout de la vidéo :', error);
      return;
    }

    // Refresh the list
    const { data: newData } = await supabase
      .from('section_videos')
      .select('*')
      .order('order', { ascending: true });

    if (newData) {
      setVideoList(newData);
    }

    setOpen(false);
  };

  const handleUpdateStatus = async (videoId: number) => {
    const updatedVideos = await updateItemStatus('section_videos', videoId, videoList.find(v => v.id === videoId)?.status || '');
    if (updatedVideos) {
      fetchVideoContent();
    }
  }

  const handleDelete = async (video: Video) => {
    if (!video.id) return;

    // Delete the video
    const { error } = await supabase
      .from('section_videos')
      .delete()
      .eq('id', video.id);

    if (error) {
      console.error('Erreur lors de la suppression de la vidéo :', error);
      return;
    }

    // Fetch remaining items
    const { data: newData } = await supabase
      .from('section_videos')
      .select('*')
      .order('order', { ascending: true });

    if (newData && newData.length > 0) {
      // Readjust order fields to be sequential
      const updates = newData.map((item: Video, index: number) => ({
        id: item.id!,
        newOrder: index + 1,
      }));

      // Update all items with new sequential order
      try {
        await Promise.all(
          updates.map((update) =>
            supabase
              .from('section_videos')
              .update({ order: update.newOrder })
              .eq('id', update.id)
          )
        );

        // Fetch the final updated list
        const { data: finalData } = await supabase
          .from('section_videos')
          .select('*')
          .order('order', { ascending: true });

        if (finalData) {
          setVideoList(finalData);
        }
      } catch (error) {
        console.error('Erreur lors de la réorganisation des vidéos après suppression :', error);
        // Still show the list even if reordering fails
        setVideoList(newData);
      }
    } else {
      // No items left
      setVideoList([]);
    }

    setOpenDeleteDialog(false);
    setVideoToDelete(undefined);
  }

  const handleEdit = async (videoId: number, data: { description?: string; url?: string; status: 'ACTIVE' | 'INACTIVE' | string; order?: number }) => {
    const { error } = await supabase
      .from('section_videos')
      .update({
        description: data.description,
        url: data.url,
        status: data.status,
        order: data.order
      })
      .eq('id', videoId);

    if (error) {
      console.error('Erreur lors de la modification de la vidéo :', error);
      return;
    }

    // Refresh the list
    const { data: newData } = await supabase
      .from('section_videos')
      .select('*')
      .order('order', { ascending: true });

    if (newData) {
      setVideoList(newData);
    }

    setEditingVideo(undefined);
    setOpen(false);
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = videoList.findIndex((video) => video.id === active.id)
    const newIndex = videoList.findIndex((video) => video.id === over.id)

    const newVideoList = arrayMove(videoList, oldIndex, newIndex)
    const previousVideoList = videoList // Store for rollback

    // Optimistic update
    setVideoList(newVideoList)

    // Update all items to ensure sequential order values
    const updates = newVideoList.map((video: Video, idx: number) => ({
      id: video.id!,
      order: idx + 1
    }))

    try {
      // Parallel updates instead of sequential
      const results = await Promise.all(
        updates.map((update) =>
          supabase
            .from('section_videos')
            .update({ order: update.order })
            .eq('id', update.id)
            .select()
        )
      )

      // Check for any errors
      const errors = results.filter((r) => r.error)
      if (errors.length > 0) {
        console.error('Update errors:', errors)
        throw new Error(errors[0].error?.message || 'Failed to update order')
      }
    } catch (error) {
      console.error('Erreur lors de la réorganisation des vidéos :', error)
      setVideoList(previousVideoList)
    }
  }

  function videoElement({ label, element = "N/A" }: { label: string, element?: string }) {
    return (
      <Flex direction={'row'} alignItems={'center'} gap={2}>
        <LavaTypo variant={'p'} styles={{ color: 'black', fontWeight: 'bold' }}>{label}</LavaTypo>
        <LavaTypo variant={'p'} styles={{ color: 'black' }}>
          {element}
        </LavaTypo>
      </Flex>
    )
  }

  return (
    <Box direction={'column'}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Flex
          direction={'column'}
          gap={2}
        >
          {videoList.length === 0 ? (
            <LavaTypo variant={'p'} styles={{ color: 'black' }} size={'16px'}>
              Aucun élément disponible. Ajoutez-en un en cliquant sur "Ajouter un élément".
            </LavaTypo>
          ) : (
            <SortableContext
              items={videoList.map((v) => v.id!)}
              strategy={verticalListSortingStrategy}
            >
              {videoList.map((video) => (
                <SortableVideoItem
                  key={video.id}
                  video={video}
                  videoElement={videoElement}
                  handleUpdateStatus={handleUpdateStatus}
                  setVideoToDelete={setVideoToDelete}
                  setOpenDeleteDialog={setOpenDeleteDialog}
                  onEdit={setEditingVideo}
                />
              ))}
            </SortableContext>
          )}
        </Flex>
      </DndContext>

      <AddVideoDialog
        open={open || !!editingVideo}
        onClose={() => {
          setOpen(false);
          setEditingVideo(undefined);
        }}
        onAdd={handleAddVideo}
        editingVideo={editingVideo as any}
        onEdit={handleEdit}
      />

      <DeleteDialog
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        handleDelete={handleDelete}
        itemToDelete={videoToDelete}
        dialogTitle="Supprimer la vidéo"
      />
    </Box>
  );
}
