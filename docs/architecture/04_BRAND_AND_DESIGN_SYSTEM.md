# 04. INDEPENDENT BRAND & UI DESIGN SYSTEM ("AURA")
**Design Standard:** Enterprise Multi-Platform Design System  
**Target Runtimes:** Vue 3 Web, Flutter Mobile, Tailwind CSS / Sass / Flutter ThemeData  
**Compliance:** WCAG 2.1 AA Accessibility (Contrast ratio >= 4.5:1 for normal text, 3:1 for large text)

---

## 1. Brand Identity & Principles
1. **Independent Identity**: Name: **Aura Social**. Modern sans-serif glyph with vibrant gradient aurora ring (Magenta #FF007A to Cyan #0070F3), clean negative space, distinct from Meta brand assets.
2. **Content-First Simplicity**: UI controls recede into monochrome borders and surfaces; the creator's photography and video content take center stage.
3. **Fluid Micro-Interactions**: Double-tap heart pop animation, smooth story ring progress bars, vertical snap-paging on Reels.

---

## 2. Multi-Theme Color Tokens

```css
:root {
  --aura-color-bg: #FFFFFF;
  --aura-color-surface: #FAFAFA;
  --aura-color-border: #DBDBDB;
  --aura-color-text-primary: #121212;
  --aura-color-text-secondary: #737373;
  --aura-color-accent: #0095F6;
  --aura-color-danger: #ED4956;
  --aura-ring-story: linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4);
  --aura-ring-close-friends: linear-gradient(45deg, #10B981, #059669);
}

[data-theme='dark'] {
  --aura-color-bg: #000000;
  --aura-color-surface: #121212;
  --aura-color-border: #262626;
  --aura-color-text-primary: #F5F5F5;
  --aura-color-text-secondary: #A8A8A8;
  --aura-color-accent: #0095F6;
  --aura-color-danger: #ED4956;
}
```

---

## 3. Responsive Breakpoint & Layout Topology

| Viewport Category | Width Range | Web Navigation Layout | Content Feed Container |
|---|---|---|---|
| Mobile Small | 320px - 480px | Bottom Navigation Bar (5 Icons) + Top Brand Header | 100% full width, edge-to-edge media |
| Tablet Portrait | 481px - 768px | Collapsed Left Icon Rail (64px) | Max 600px centered card stream |
| Desktop Regular | 769px - 1279px| Expanded Left Sidebar (244px with labels) | Feed (630px) + Right Sticky Rail (320px) |
| Desktop Wide | 1280px+ | Left Sidebar (244px) + Modal Dialog Centering | Fixed 935px maximum profile grid |

---

## 4. Component States Standard
1. **Empty State**:
   - Clean geometric vector illustration (camera, bookmark, or direct envelope)
   - Concise title (e.g., "Share Photos", "No Posts Yet")
   - Actionable call-to-action button (e.g., "Create your first post", "Find people to follow")
2. **Error State**:
   - Friendly non-technical explanation
   - Error code tag (e.g., `ERR_POST_NOT_FOUND`, `ERR_NETWORK_DISCONNECTED`)
   - Retry trigger button
3. **Accessibility**:
   - Every media asset has mandatory `alt` text attribute (with auto-generated AI description fallback).
   - All interactive controls have `aria-label` tags for screen readers.
   - Visible keyboard `:focus-visible` rings with 2px accent outline.
