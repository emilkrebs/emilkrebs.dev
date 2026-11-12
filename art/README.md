# Crab sprite source

`crab.aseprite` is the editable source of the footer easter egg
(`src/app/components/crab-sprite.tsx`). The shipped runtime asset is the
exported strip `public/pictures/easter-egg/crab-sprite.png`; the component
reads only that PNG, never this file. Keep this folder out of `public/` so
the source is in the repo but not served to visitors.

## Sheet contract

- 8 frames, 32x40 each, one horizontal row (256x40), exported at 1x with no
  trim and no padding.
- Frame order is the component's `FRAMES` index map: 0 sit, 1 sit-blink,
  2 stand, 3 stand-blink, 4 wave-1, 5 wave-2, 6 walk-1, 7 walk-2. The second
  frame of sit/stand is the closed-eye blink variant.
- Aseprite tags mirror the poses: sit = 0-1, stand = 2-3, wave = 4-5,
  walk = 6-7.
- One layer ("crab"). The outline stays black in both color schemes, so the
  same sheet serves light and dark.

## Re-export

```sh
aseprite -b art/crab.aseprite \
    --sheet public/pictures/easter-egg/crab-sprite.png \
    --sheet-type horizontal --sheet-columns 8 --sheet-rows 1
```

(On macOS the CLI lives at
`/Applications/Aseprite.app/Contents/MacOS/aseprite`.)

The component picks poses by index, so reordering frames or resizing the
canvas silently swaps or breaks poses; keep the contract above. Sanity-check
the export before committing:
`sips -g pixelWidth -g pixelHeight public/pictures/easter-egg/crab-sprite.png`
must report 256x40. The PNG is served as-is (CSS background); `npm run build`
refreshes the responsive variants like any other picture.
