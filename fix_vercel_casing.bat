@echo off
echo Fixing casing for Vercel build...

git mv components/ui/card.tsx components/ui/card_tmp.tsx
git mv components/ui/card_tmp.tsx components/ui/card.tsx

git mv components/ui/badge.tsx components/ui/badge_tmp.tsx
git mv components/ui/badge_tmp.tsx components/ui/badge.tsx

git mv components/ui/avatar.tsx components/ui/avatar_tmp.tsx
git mv components/ui/avatar_tmp.tsx components/ui/avatar.tsx

git mv components/Comments.tsx components/Comments_tmp.tsx
git mv components/Comments_tmp.tsx components/Comments.tsx

echo Casing fixed. Please commit and push the changes.
