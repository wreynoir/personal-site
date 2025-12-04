# Will Reynoir – Retro-Futuristic Study Site

Tech:
- Next.js App Router (TypeScript)
- Tailwind CSS
- Framer Motion for modals/animations

Design:
- Full-screen illustrated study room
- Day image: /public/room-day.png
- Night image: /public/room-night.png

Interactive objects (hotspots) → modals:
- Sketches on desk → ProjectsModal (data from /data/projects.ts)
- Leather journal → JournalModal (markdown dispatches + Substack embed)
- Phone → ContactModal (contact info from /data/contact.ts)
- Bookshelf → BookshelfModal (books from /data/books.ts + Goodreads widget slot)
- Picture frame → PhotosModal (images from /public/photos + /data/photos.ts)
- Computer terminal → BlogModal (Substack from /data/blog.ts)
- Bulletin board → AboutModal (copy from /data/about.ts)
- Light switch → toggles day/night illustration

Key components:
- components/Room.tsx – main UI, hotspots, and modals
- data/*.ts – all personal content lives here
- lib/getDispatches.ts – loads markdown files from /dispatches for journal
