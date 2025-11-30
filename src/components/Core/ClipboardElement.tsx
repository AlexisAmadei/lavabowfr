import { Clipboard, Link } from '@chakra-ui/react'
import LavaTypo from '../Design/LavaTypo'
import { toaster } from '../ui/toaster'

export default function ClipboardElement({ text, color = 'white' } : { text: string; color?: string; }) {
  return (
    <Clipboard.Root value={text} display={'flex'} alignItems='center' justifyContent='center'>
      <Clipboard.Trigger asChild onClick={() => toaster.create({ description: 'Élément copié dans le presse-papier', closable: true, type: 'success', })}>
        <Link as="span" color={color}>
          <Clipboard.Indicator />
          <Clipboard.ValueText>
            <LavaTypo>{text}</LavaTypo>
          </Clipboard.ValueText>
        </Link>
      </Clipboard.Trigger>
    </Clipboard.Root>
  )
}
