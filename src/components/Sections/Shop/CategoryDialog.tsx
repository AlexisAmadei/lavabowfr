import LavaTypo from "@/components/Design/LavaTypo";
import { MerchCategory, updateCategoryOrder } from "@/utils/supabase/shop";
import { Box, Button, Flex, IconButton, Dialog, Input, Editable } from "@chakra-ui/react";
import { faPen, faTrash, faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: MerchCategory[];
  categoryFormData: MerchCategory;
  onCategoryFormDataChange: (data: MerchCategory) => void;
  onSaveCategory: () => Promise<void>;
  onDeleteCategory: (categoryId: number) => Promise<void>;
  onUpdateCategory: (categoryId: number, name: string) => Promise<boolean>;
}

interface DraggableCategoryItemProps {
  category: MerchCategory;
  onUpdateCategory: (categoryId: number, name: string) => Promise<boolean>;
  onDeleteCategory: (categoryId: number) => Promise<void>;
}

function DraggableCategoryItem({
  category,
  onUpdateCategory,
  onDeleteCategory,
}: DraggableCategoryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Flex
      ref={setNodeRef}
      style={style}
      justifyContent={'space-between'}
      alignItems={'center'}
      p={2}
      borderBottom={'1px solid #eee'}
      color={'black'}
      bg={isDragging ? '#f0f0f0' : 'transparent'}
      borderRadius={'md'}
    >
      <Flex alignItems={'center'} gap={2} flex={1}>
        <IconButton
          variant="ghost"
          size="xs"
          {...attributes}
          {...listeners}
          cursor="grab"
          _active={{ cursor: "grabbing" }}
        >
          <FontAwesomeIcon icon={faGripVertical} />
        </IconButton>
        <Editable.Root
          value={category.name}
          onValueChange={async (details) => {
            await onUpdateCategory(category.id, details.value);
          }}
          textAlign="start"
          flex={1}
        >
          <Editable.Preview cursor="pointer" />
          <Editable.Input />
          <Editable.Control>
            <Editable.EditTrigger asChild>
              <IconButton variant="ghost" size="xs">
                <FontAwesomeIcon icon={faPen} />
              </IconButton>
            </Editable.EditTrigger>
            <Editable.CancelTrigger asChild>
              <Button variant="outline" size="xs">
                Cancel
              </Button>
            </Editable.CancelTrigger>
            <Editable.SubmitTrigger asChild>
              <Button variant="outline" size="xs" colorScheme="green">
                Save
              </Button>
            </Editable.SubmitTrigger>
          </Editable.Control>
        </Editable.Root>
      </Flex>
      <IconButton
        aria-label="Delete category"
        size="sm"
        colorScheme="red"
        variant="outline"
        onClick={() => onDeleteCategory(category.id)}
      >
        <FontAwesomeIcon icon={faTrash} />
      </IconButton>
    </Flex>
  );
}

export default function CategoryDialog({
  open,
  onOpenChange,
  categories,
  categoryFormData,
  onCategoryFormDataChange,
  onSaveCategory,
  onDeleteCategory,
  onUpdateCategory,
}: CategoryDialogProps) {
  const [sortedCategories, setSortedCategories] = useState<MerchCategory[]>(categories);

  // Sync sortedCategories when dialog opens or categories change
  useEffect(() => {
    setSortedCategories(categories);
  }, [categories, open]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedCategories.findIndex((cat) => cat.id === active.id);
      const newIndex = sortedCategories.findIndex((cat) => cat.id === over.id);
      const newOrder = arrayMove(sortedCategories, oldIndex, newIndex);
      setSortedCategories(newOrder);

      // Persist the new order to the database
      const success = await updateCategoryOrder(newOrder);
      if (!success) {
        console.error('Failed to update category order');
        // Revert to original order if update fails
        setSortedCategories(sortedCategories);
      }
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(details) => onOpenChange(details.open)}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Manage Categories</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Flex direction={'column'} gap={4}>
              {/* Add New Category */}
              <Flex direction={'column'} gap={2}>
                <label htmlFor="category-name" style={{ color: 'black', fontWeight: 'bold' }}>
                  Add New Category
                </label>
                <Input
                  id="category-name"
                  placeholder="Enter category name"
                  value={categoryFormData.name}
                  onChange={(e) => onCategoryFormDataChange({ ...categoryFormData, name: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && onSaveCategory()}
                  color={'black'}
                />
                <Button
                  onClick={onSaveCategory}
                  colorScheme="blue"
                  size="sm"
                  width={'fit-content'}
                >
                  Add Category
                </Button>
              </Flex>

              {/* Categories List with Editable */}
              <Box borderTop={'1px solid #ccc'} pt={4}>
                <LavaTypo variant="h4">Existing Categories</LavaTypo>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sortedCategories.map((cat) => cat.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Flex direction={'column'} gap={2} maxHeight={'300px'} overflowY={'auto'}>
                      {sortedCategories.map(category => (
                        <DraggableCategoryItem
                          key={category.id}
                          category={category}
                          onUpdateCategory={onUpdateCategory}
                          onDeleteCategory={onDeleteCategory}
                        />
                      ))}
                      {sortedCategories.length === 0 && (
                        <p style={{ color: '#999', textAlign: 'center', padding: '1rem' }}>
                          No categories yet
                        </p>
                      )}
                    </Flex>
                  </SortableContext>
                </DndContext>
              </Box>
            </Flex>
          </Dialog.Body>
          <Dialog.Footer>
            <Button onClick={() => onOpenChange(false)} colorScheme="gray">
              Close
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
