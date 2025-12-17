# Replace Non-Primary Colors in Pastor Portal Modal Dialogs

## Files to Update
- [ ] client/pages/pastor/PastorEvents.tsx
- [ ] client/pages/pastor/PastorMembers.tsx
- [ ] client/pages/pastor/PastorPreachers.tsx
- [ ] client/pages/pastor/PastorNotes.tsx
- [ ] client/pages/pastor/PastorSchedule.tsx

## Changes Needed
- Replace blue-purple gradients with primary color gradients
- Replace green gradients with primary colors
- Update focus states from purple to primary
- Update text colors from purple to primary
- Update background gradients to use primary colors

## Primary Color Scheme
- Primary: hsl(246.7 30.2% 25.5%) - dark blue
- Use `bg-primary`, `text-primary`, `border-primary`, etc.
- For gradients, use `from-primary to-primary/80` or similar
