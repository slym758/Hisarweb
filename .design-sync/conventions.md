# Hisar Design System — usage conventions

Hisar Hastanesi'nin (hospital group) admin/panel design system: shadcn/ui primitives on
Radix, styled with a navy + orange + cyan token palette and the **Inter** typeface. Build
admin screens (dashboards, CRUD tables, forms, dialogs) by composing these real components —
they map 1:1 onto the app's shipped code.

## Setup & wrapping
Most components render standalone. Four need a wrapper — omit it and they render blank or throw:
- **Tooltip** → wrap in `<TooltipProvider>` (once near the root, or per tooltip).
- **Sidebar** → wrap in `<SidebarProvider>`; the sidebar itself only shows at `md`+ widths.
- **Form** → drive with react-hook-form: `const form = useForm(); <Form {...form}> … </Form>`,
  fields via `<FormField control={form.control} name="…" render={…} />`.
- **Toaster** → mount `<Toaster />` once at the app root; fire toasts with `toast()` from `sonner`.

**Dark mode** is class-based: add `class="dark"` on a root ancestor and every token flips. No
other setup — the tokens are already defined for both themes.

## Styling idiom — Tailwind utilities on design tokens
Style with Tailwind utility classes bound to the token palette. **Never hardcode hex colors**;
use the token utilities so light/dark and brand stay consistent:

| Role | Classes |
|---|---|
| Surfaces | `bg-background`, `bg-card`, `bg-muted`, `bg-secondary`, `bg-popover` |
| Brand navy (primary) | `bg-primary` + `text-primary-foreground` |
| CTA orange | `bg-brand-orange` + `text-brand-orange-foreground` |
| Cyan accent | `text-brand-cyan`, `bg-brand-cyan` |
| Status | `bg-destructive` / `bg-success` (+ `-foreground`) |
| Text | `text-foreground`, `text-muted-foreground` |
| Borders/rings | `border-border`, `border-input`, `focus-visible:ring-ring` |
| Radius | `rounded-md`, `rounded-lg`, `rounded-xl` (base `--radius` = 0.875rem) |
| Brand extras | `shadow-card`, `shadow-elevated`, `shadow-brand`, `bg-gradient-hero`, `bg-gradient-primary`, `container-x`, `text-balance` |

Typography is `font-sans` (Inter) everywhere; headings are tracked tighter automatically.
Button variants: `default` (navy), `secondary`, `outline`, `ghost`, `destructive`, `link`;
sizes `sm | default | lg | icon`. Badge variants: `default | secondary | destructive | outline`.

## Where the truth lives
- **Styles/tokens**: the bound `styles.css` (→ `_ds_bundle.css`) defines every token as a
  CSS variable (`--primary`, `--brand-orange`, `--muted-foreground`, …) plus the utility rules.
  Read it before inventing classes — only utilities present there are styled.
- **Per component**: each `<Name>.d.ts` is the prop contract; each `<Name>.prompt.md` shows usage.

## Idiomatic snippet — an admin panel screen
```tsx
import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableBody,
  TableRow, TableHead, TableCell, Badge, Button } from 'hisar-ui';

<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>Randevular</CardTitle>
    <Button size="sm">Yeni Randevu</Button>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader><TableRow>
        <TableHead>Hasta</TableHead><TableHead>Bölüm</TableHead><TableHead>Durum</TableHead>
      </TableRow></TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Ayşe Yılmaz</TableCell>
          <TableCell>Kardiyoloji</TableCell>
          <TableCell><Badge>Onaylandı</Badge></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </CardContent>
</Card>
```
Use library components for every control; reach for the utility classes above only for your own
layout glue (spacing, flex/grid). Turkish is the primary UI language.
