import { getDispatches } from '@/lib/getDispatches';
import Room from '@/components/Room';

export default async function Home() {
  const dispatches = await getDispatches();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black px-4 py-6">
      <Room dispatches={dispatches} />
    </main>
  );
}
