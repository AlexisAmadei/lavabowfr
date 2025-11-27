import { AbsoluteCenter, ProgressCircle } from "@chakra-ui/react";

export default function Loading() {
  return (
    <AbsoluteCenter>
      <ProgressCircle.Root value={null} size="sm">
        <ProgressCircle.Circle>
          <ProgressCircle.Range stroke={'var(--Background-bg-brand)'} />
        </ProgressCircle.Circle>
      </ProgressCircle.Root>
    </AbsoluteCenter>
  )
}