import type { Metadata, ResolvingMetadata } from 'next';
import SearchHeader from '@/components/search-header';
import SearchResultsList from '@/components/search-results-list';
import { search } from '@/lib/ytmusic';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  return {
    title: query ? `Search results for "${query}"` : 'Search',
    description: query
      ? `Results for "${query}" in Music Studio.`
      : 'Search for your favorite songs in Music Studio.',
  };
}

export default async function Page({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const { songs, error } = await search(query);

  return (
    <div className="p-4 md:p-6 h-full overflow-y-auto bg-zinc-900 text-white">
      <SearchHeader query={query} />
      <SearchResultsList songs={songs} query={query} error={error} />
    </div>
  );
}
