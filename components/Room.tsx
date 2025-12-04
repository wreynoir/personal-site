'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

import { Dispatch } from '@/lib/getDispatches';
import { projects } from '@/data/projects';
import { contact } from '@/data/contact';
import { about } from '@/data/about';
import { photos } from '@/data/photos';
import { books, goodreadsProfile } from '@/data/books';
import { blog } from '@/data/blog';

type ModalType =
  | 'projects'
  | 'journal'
  | 'books'
  | 'contact'
  | 'blog'
  | 'about'
  | 'photos'
  | null;

type BulletinNote = 'about' | 'reads' | 'approach';

interface RoomProps {
  dispatches: Dispatch[];
}

interface SubstackPost {
  id: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  canonical_url: string;
  cover_image?: string | null;
  post_date: string;
  truncated_body_text?: string | null;
}

type Photo = (typeof photos)[number];

function playSound(path: string, volume = 0.4) {
  if (typeof window === 'undefined') return;
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch(() => {});
}

const modalVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 10, scale: 0.97 }
};

export default function Room({ dispatches }: RoomProps) {
  const [modal, setModal] = useState<ModalType>(null);
  const [theme, setTheme] = useState<'day' | 'night'>('day');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const isNight = theme === 'night';

  const openModal = (type: ModalType, sound?: string) => {
    if (sound) playSound(sound);
    setModal(type);
  };

  const toggleTheme = () => {
    playSound('/sounds/click.mp3', 0.6);
    setTheme(prev => (prev === 'day' ? 'night' : 'day'));
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background illustration */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: `url(${isNight ? '/room-night.png' : '/room-day.png'})`
        }}
      />

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

      {/* Top overlay: name + nav + mode toggle */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-8 pt-4 text-slate-50">
        <div className="inline-flex rounded-full bg-black/55 px-4 py-1 text-[11px] uppercase tracking-[0.25em]">
          Will Reynoir
        </div>

        <div className="flex items-center gap-4">
          <nav className="rounded-full bg-black/65 px-5 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] border border-white/15">
            <ul className="flex gap-4">
              <li
                className="cursor-pointer hover:text-amber-200"
                onClick={() => openModal('blog')}
              >
                Blog
              </li>
              <li
                className="cursor-pointer hover:text-amber-200"
                onClick={() => openModal('projects')}
              >
                Projects
              </li>
              <li
                className="cursor-pointer hover:text-amber-200"
                onClick={() => openModal('journal')}
              >
                Journal
              </li>
              <li
                className="cursor-pointer hover:text-amber-200"
                onClick={() => openModal('books')}
              >
                Books
              </li>
              <li
                className="cursor-pointer hover:text-amber-200"
                onClick={() => openModal('photos')}
              >
                Photos
              </li>
              <li
                className="cursor-pointer hover:text-amber-200"
                onClick={() => openModal('about')}
              >
                About
              </li>
              <li
                className="cursor-pointer hover:text-amber-200"
                onClick={() => openModal('contact')}
              >
                Contact
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Hotspot layer */}
      <div className="absolute inset-0 z-10">
        {/* sketches on desk → Projects */}
        <Hotspot
          label="Project sketches"
          onClick={() => openModal('projects', '/sounds/click.mp3')}
          style={{ left: '30%', top: '70%', width: '30%', height: '19%' }}
        />

        {/* leather journal (book on right) → Journal */}
        <Hotspot
          label="Leather journal"
          onClick={() => openModal('journal', '/sounds/paper-flip.mp3')}
          style={{ left: '65%', top: '72%', width: '14%', height: '14%' }}
        />

        {/* phone on side table → Contact */}
        <Hotspot
          label="Telephone"
          onClick={() => openModal('contact')}
          style={{ left: '83%', top: '49%', width: '11%', height: '15%' }}
        />

        {/* bookshelf → books */}
        <Hotspot
          label="Bookshelf"
          onClick={() => openModal('books', '/sounds/creak.mp3')}
          style={{ left: '40%', top: '7%', width: '42%', height: '38%' }}
        />

        {/* picture frame → photos */}
        <Hotspot
          label="Photo frame"
          onClick={() => openModal('photos')}
          style={{ left: '14%', top: '63%', width: '10%', height: '18%' }}
        />

        {/* retro computer/TV → blog */}
        <Hotspot
          label="Computer"
          onClick={() => openModal('blog')}
          style={{ left: '20%', top: '44%', width: '16%', height: '24%' }}
        />

        {/* bulletin board → about */}
        <Hotspot
          label="Bulletin board"
          onClick={() => openModal('about')}
          style={{ left: '20%', top: '12%', width: '18%', height: '31%' }}
        />

        {/* light switch → theme toggle */}
        <Hotspot
          label="Light switch"
          onClick={toggleTheme}
          style={{ left: '93%', top: '33%', width: '5%', height: '12%' }}
        />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModal(null)}
          >
            <motion.div
              className="relative max-h-[90vh] w-[95vw] max-w-4xl rounded-3xl border border-white/15 bg-slate-950/95 p-6 shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-200 hover:border-amber-300 hover:text-amber-200"
                onClick={() => setModal(null)}
              >
                Close
              </button>

              {modal === 'projects' && <ProjectsModal />}
              {modal === 'journal' && <JournalModal dispatches={dispatches} />}
              {modal === 'books' && <BookshelfModal />}
              {modal === 'contact' && <ContactModal />}
              {modal === 'blog' && <BlogModal />}
              {modal === 'about' && <AboutModal />}
              {modal === 'photos' && <PhotosModal onSelect={setSelectedPhoto} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-4xl rounded-3xl border border-white/20 bg-slate-950/90 p-4 shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute right-4 top-4 rounded-full border border-white/40 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-200 hover:border-amber-300 hover:text-amber-200"
                onClick={() => setSelectedPhoto(null)}
              >
                Close
              </button>
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                className="max-h-[70vh] w-full rounded-2xl object-contain"
              />
              <p className="mt-3 text-center text-sm text-slate-200">
                {selectedPhoto.alt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------ Hotspot helper ------------ */

interface HotspotProps {
  label: string;
  onClick: () => void;
  style: CSSProperties;
}

function Hotspot({ label, onClick, style }: HotspotProps) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      style={style}
      className="absolute group"
    >
      <span className="sr-only">{label}</span>
      <span className="pointer-events-none absolute inset-0 rounded-lg border border-transparent group-hover:border-amber-300/80 group-hover:bg-black/15 transition-colors" />
    </button>
  );
}

/* ------------ MODALS (using /data) ------------ */

function ProjectsModal() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-amber-300/90">
          Desk sketches
        </p>
        <h2 className="font-heading text-2xl text-slate-50">
          Projects on the Workbench
        </h2>
        <p className="mt-1 text-sm text-slate-300">
          The sketches on the desk are a peek into things I&apos;m building and
          tinkering with.
        </p>
      </header>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {projects.map(project => (
          <article
            key={project.title}
            className="flex flex-col rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg"
          >
            <h3 className="font-heading text-lg text-amber-300">
              {project.title}
            </h3>
            <p className="mt-2 text-sm text-slate-200">
              {project.description}
            </p>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                className="mt-3 text-sm text-teal-300 hover:underline"
              >
                View →
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

function JournalModal({ dispatches }: { dispatches: Dispatch[] }) {
  const latest = dispatches ?? [];

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-amber-300/90">
          Leather journal
        </p>
        <h2 className="font-heading text-2xl text-slate-50">
          Daily Entries & Dispatches
        </h2>
        <p className="mt-1 text-sm text-slate-300">
          Personal notes, half-baked ideas, and the stuff that usually lives in
          a notebook, not a doc.
        </p>
      </header>

      <div className="mt-3">
        <div className="flex flex-col rounded-2xl bg-gradient-to-br from-amber-900/80 via-amber-900/90 to-amber-950/95 border border-amber-500/20 p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-heading text-sm text-amber-50">Dispatches</h3>
            <span className="text-[10px] uppercase tracking-[0.18em] text-amber-200/70">
              Latest first
            </span>
          </div>
          <div className="journal-scroll flex-1 space-y-4 overflow-y-auto rounded-xl bg-amber-950/60 p-3 text-[13px] leading-relaxed text-amber-50/95">
            {latest.length === 0 && (
              <p className="text-amber-100/80">
                (No dispatches yet.) Drop some <code>.md</code> files into{' '}
                <code>/dispatches</code> to populate this page.
              </p>
            )}

            {latest.map(d => (
              <article
                key={d.id}
                className="pb-3 border-b border-amber-700/40 last:border-none"
              >
                <h4 className="font-heading text-sm text-amber-100">
                  {d.title}
                </h4>
                <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-amber-200/70">
                  {d.date}
                </p>
                <ReactMarkdown className="prose prose-invert prose-amber max-w-none text-[13px]">
                  {d.content}
                </ReactMarkdown>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookshelfModal() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-amber-300/90">
          Bookshelf
        </p>
        <h2 className="font-heading text-2xl text-slate-50">
          Recent Reads &amp; Goodreads
        </h2>
        <p className="mt-1 text-sm text-slate-300">
          A quick peek at what&apos;s been on the nightstand.
        </p>
      </header>

      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
          <h3 className="font-heading text-sm text-amber-300 mb-2">
            Currently Reading
          </h3>
          <p className="text-sm text-slate-300">
            Live feed from the “currently-reading” shelf. Keep tabs on what&apos;s
            open on the nightstand.
          </p>
          <div className="mt-3 rounded-xl bg-black/40 p-3 text-xs text-slate-200">
            <GoodreadsWidget shelf="currently-reading" widgetId="1764794361" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
          <h3 className="font-heading text-sm text-amber-300 mb-2">
            Read Shelf
          </h3>
          <p className="text-sm text-slate-300">
            Scroll through the latest finished reads straight from Goodreads.
          </p>
          <div className="mt-3 rounded-xl bg-black/40 p-3 text-xs text-slate-200">
            <GoodreadsWidget shelf="read" widgetId="1764794343" />
          </div>
          {goodreadsProfile && (
            <a
              href={goodreadsProfile}
              target="_blank"
              className="mt-3 inline-block text-sm text-teal-300 hover:underline"
            >
              View full Goodreads profile →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactModal() {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-amber-300/90">
          Rotary phone
        </p>
        <h2 className="font-heading text-2xl text-slate-50">Get in Touch</h2>
        <p className="mt-1 text-sm text-slate-300">
          Best ways to reach me. No contact forms — just real channels.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
        <h3 className="font-heading text-sm text-amber-300 mb-2">
          Reach me here
        </h3>
        <ul className="space-y-2 text-sm text-slate-200">
          {contact.email && (
            <li>
              Email:{' '}
              <a
                href={`mailto:${contact.email}`}
                className="text-teal-300 hover:underline"
              >
                {contact.email}
              </a>
            </li>
          )}
          {contact.twitter && (
            <li>
              X / Twitter:{' '}
              <a
                href={contact.twitter}
                target="_blank"
                className="text-teal-300 hover:underline"
              >
                {contact.twitterLabel ?? '@twitter'}
              </a>
            </li>
          )}
          {contact.linkedin && (
            <li>
              LinkedIn:{' '}
              <a
                href={contact.linkedin}
                target="_blank"
                className="text-teal-300 hover:underline"
              >
                LinkedIn profile
              </a>
            </li>
          )}
          {contact.instagram && (
            <li>
              Instagram:{' '}
              <a
                href={contact.instagram}
                target="_blank"
                className="text-teal-300 hover:underline"
              >
                {contact.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@')}
              </a>
            </li>
          )}
          {contact.telegram && (
            <li>
              Telegram:{' '}
              <a
                href={`https://t.me/${contact.telegram.replace(/^@/, '')}`}
                target="_blank"
                className="text-teal-300 hover:underline"
              >
                {contact.telegram}
              </a>
            </li>
          )}
          {contact.github && (
            <li>
              GitHub:{' '}
              <a
                href={contact.github}
                target="_blank"
                className="text-teal-300 hover:underline"
              >
                GitHub
              </a>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function BlogModal() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      try {
        const res = await fetch('/api/substack');
        if (!res.ok) {
          throw new Error('Unable to load posts');
        }
        const data = await res.json();
        if (!cancelled) {
          setPosts(data.posts ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Could not load Substack posts right now.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  const getExcerpt = (post: SubstackPost) =>
    post.subtitle ||
    post.description ||
    post.truncated_body_text ||
    'Open to read the full piece on Substack.';

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-amber-300/90">
          Computer terminal
        </p>
        <h2 className="font-heading text-2xl text-slate-50">Blog & Essays</h2>
        <p className="mt-1 text-sm text-slate-300">
          Scroll through Wonderings &amp; Wanderings without leaving the room.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg">
        <div className="max-h-[420px] space-y-4 overflow-y-auto pr-2">
          {loading && (
            <p className="text-sm text-slate-300">Loading latest posts...</p>
          )}
          {error && (
            <p className="text-sm text-rose-300">
              {error} Try{' '}
              <a
                href={blog.url}
                target="_blank"
                className="underline hover:text-rose-100"
              >
                Substack directly
              </a>
              .
            </p>
          )}
          {!loading && !error && posts.length === 0 && (
            <p className="text-sm text-slate-300">
              No recent posts found. Check back soon.
            </p>
          )}
          {!loading &&
            !error &&
            posts.map(post => (
              <article
                key={post.id}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row">
                  {post.cover_image && (
                    <img
                      src={post.cover_image}
                      alt=""
                      className="h-32 w-full rounded-xl object-cover md:w-40"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-amber-200/70">
                      {formatDate(post.post_date)}
                    </p>
                    <h3 className="font-heading text-lg text-slate-50">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      {getExcerpt(post)}
                    </p>
                    <a
                      href={post.canonical_url}
                      target="_blank"
                      className="mt-3 inline-flex text-sm text-teal-300 hover:underline"
                    >
                      Continue reading →
                    </a>
                  </div>
                </div>
              </article>
            ))}
        </div>
      </div>

      <div className="text-center text-sm text-slate-300">
        Want to see the full experience?{' '}
        <a
          href={blog.url}
          target="_blank"
          className="text-teal-300 hover:underline"
        >
          Go to Wonderings &amp; Wanderings →
        </a>
      </div>
    </div>
  );
}

function AboutModal() {
  const [activeNote, setActiveNote] = useState<BulletinNote>('about');

  const noteOptions: Array<{
    id: BulletinNote;
    title: string;
    blurb: string;
    color: string;
    rotation: string;
  }> = [
    {
      id: 'about',
      title: 'About Will',
      blurb: 'Origin story, travels, and what keeps me curious.',
      color: 'bg-amber-200/90 text-slate-900',
      rotation: 'rotate-[-1deg]'
    },
    {
      id: 'reads',
      title: 'Worldview Shifters',
      blurb: 'Blogs, essays, and papers that changed how I think.',
      color: 'bg-teal-200/80 text-slate-900',
      rotation: 'rotate-[0.75deg]'
    },
    {
      id: 'approach',
      title: 'How to Approach Life',
      blurb: 'Collected reminders + advice for how I move.',
      color: 'bg-rose-200/90 text-slate-900',
      rotation: '-rotate-[0.5deg]'
    }
  ];

  const renderNoteContent = () => {
    switch (activeNote) {
      case 'about':
        return (
          <div className="space-y-3 text-sm text-slate-200">
            {about.intro && <p>{about.intro}</p>}
            {about.paragraphs?.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        );
      case 'reads':
        return (
          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
            {about.favoriteReads?.length ? (
              about.favoriteReads.map(read => (
                <article
                  key={read.title}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                >
                  <h3 className="font-heading text-base text-amber-200">
                    {read.title}
                  </h3>
                  {read.creator && (
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                      {read.creator}
                    </p>
                  )}
                  {read.summary && (
                    <p className="mt-2 text-sm text-slate-200">{read.summary}</p>
                  )}
                  {read.url && (
                    <a
                      href={read.url}
                      target="_blank"
                      className="mt-3 inline-flex text-sm text-teal-300 hover:underline"
                    >
                      Read →
                    </a>
                  )}
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-300">
                Add your favorite essays to <code>favoriteReads</code> inside{' '}
                <code>data/about.ts</code>.
              </p>
            )}
          </div>
        );
      case 'approach':
        return (
          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1 text-sm text-slate-200">
            {about.approachToLife?.length ? (
              about.approachToLife.map(tip => (
                <article
                  key={tip.text}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <p className="text-slate-200/90">{tip.text}</p>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-300">
                Drop advice entries into <code>approachToLife</code> inside{' '}
                <code>data/about.ts</code>.
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-amber-300/90">
          Bulletin board
        </p>
        <h2 className="font-heading text-2xl text-slate-50">
          Pull a sticky note
        </h2>
        <p className="mt-1 text-sm text-slate-300">
          Click a note to pin a different story or resource to the board.
        </p>
      </header>

      <div className="mt-4 grid gap-5 md:grid-cols-[240px_1fr]">
        <div className="flex flex-wrap gap-4 md:flex-col">
          {noteOptions.map(note => {
            const isActive = activeNote === note.id;
            return (
              <button
                type="button"
                key={note.id}
                onClick={() => setActiveNote(note.id)}
                aria-pressed={isActive}
                className={`relative w-40 rounded-2xl px-4 pb-4 pt-6 text-left text-sm font-medium shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${note.color} ${note.rotation} ${
                  isActive ? 'ring-2 ring-amber-400 shadow-2xl' : ''
                }`}
              >
                <span className="pointer-events-none absolute left-1/2 top-2 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-800/30" />
                <span className="block text-xs uppercase tracking-[0.18em]">
                  {note.title}
                </span>
                <span className="mt-2 block text-[13px] leading-snug">
                  {note.blurb}
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-white/15 bg-slate-950/80 p-5 shadow-inner">
          {renderNoteContent()}
        </div>
      </div>
    </div>
  );
}

function PhotosModal({ onSelect }: { onSelect: (photo: Photo) => void }) {
  return (
    <div className="space-y-4">
      <header>
        <p className="text-xs uppercase tracking-[0.24em] text-amber-300/90">
          Desk photo frame
        </p>
        <h2 className="font-heading text-2xl text-slate-50">
          Little Rolodex of Moments
        </h2>
        <p className="mt-1 text-sm text-slate-300">
          A few scenes that mean a lot to me. Swap these out whenever the lore
          evolves.
        </p>
      </header>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3">
        <div className="max-h-[360px] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {photos.map(photo => (
              <button
                type="button"
                key={photo.src}
                onClick={() => onSelect(photo)}
                className="group text-left overflow-hidden rounded-xl border border-white/10 bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                aria-label={`Open ${photo.alt}`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="px-2 py-1 text-[11px] text-slate-200/80">
                  {photo.alt}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface GoodreadsWidgetProps {
  shelf: 'currently-reading' | 'read';
  widgetId: string;
}

function GoodreadsWidget({ shelf, widgetId }: GoodreadsWidgetProps) {
  useEffect(() => {
    const existing = document.querySelector(
      `script[data-goodreads-widget="${widgetId}"]`
    );
    if (existing) {
      return;
    }
    const script = document.createElement('script');
    script.dataset.goodreadsWidget = widgetId;
    script.src = `https://www.goodreads.com/review/custom_widget/186990419.William's%20bookshelf:%20${shelf}?cover_position=left&cover_size=small&num_books=100&order=d&shelf=${shelf}&show_author=1&show_cover=1&show_rating=1&show_review=1&show_tags=1&show_title=1&sort=date_read&widget_bg_color=050914&widget_bg_transparent=&widget_border_width=1&widget_id=${widgetId}&widget_text_color=f8fafc&widget_title_size=medium&widget_width=full`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <>
      <style>{`
        .gr_custom_container_${widgetId} {
          border: 1px solid rgba(248, 250, 252, 0.15);
          border-radius: 12px;
          padding: 12px;
          background-color: #050914;
          color: #f8fafc;
          width: 100%;
        }
        .gr_custom_header_${widgetId} {
          border-bottom: 1px solid rgba(248, 250, 252, 0.2);
          margin-bottom: 8px;
          text-align: center;
          font-size: 0.95rem;
        }
        .gr_custom_each_container_${widgetId} {
          margin-bottom: 10px;
          overflow: auto;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(248, 250, 252, 0.1);
        }
        .gr_custom_book_container_${widgetId} {
          overflow: hidden;
          height: 60px;
          float: left;
          margin-right: 8px;
          width: 44px;
        }
        .gr_custom_author_${widgetId},
        .gr_custom_tags_${widgetId} {
          font-size: 11px;
          color: #cbd5f5;
        }
        .gr_custom_rating_${widgetId} {
          float: right;
        }
      `}</style>
      <div className="max-h-[360px] overflow-y-auto pr-1">
        <div id={`gr_custom_widget_${widgetId}`}></div>
      </div>
    </>
  );
}
