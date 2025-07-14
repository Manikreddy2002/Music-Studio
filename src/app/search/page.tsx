import SearchHeader from '@/components/search-header';
import SearchResultsList from '@/components/search-results-list';
import { search } from '@/lib/ytmusic';

export default async function SearchPage({
  params,
}: {
  params?: { q?: string }
}) {
  const query = params?.q || '';
  const { songs, error } = await search(query);

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto bg-zinc-900 text-white">
      <SearchHeader query={query} />
      <SearchResultsList songs={songs} query={query} error={error} />
    </div>
  );
}
