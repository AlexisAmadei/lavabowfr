---
category: design
---

# Player

The site's persistent audio player: cover art, scrolling track title, and a
progress-ring play/pause control, laid out as a rounded pill.

**It is data-driven and self-loading.** On mount it fetches the `music_player`
table from Supabase and picks a random track. It returns `null` while that
list is empty, so it renders nothing at all without a live backend — which is
why this component ships the baseline card instead of an authored preview.

```jsx
// Desktop: intrinsic width, controls packed to the left.
<Player />

// Mobile: full width, controls spread apart.
<Player isMobile />
```

## Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `isMobile` | `boolean` | `false` | Full width and `space-between` layout instead of the intrinsic-width pill. |

## Using it in a design

Place it where the live site does: pinned in the app bar or floated over a
hero. Give it a host with a resolved height — it is `height: 100%` and will
collapse in an unsized flex parent. Because it renders nothing without data,
mock the surrounding layout around a fixed-size placeholder rather than
expecting a visual from `<Player />` itself.
