import TrackView from '@/components/track-view';
import { getTrackDetails } from '@/lib/ytmusic';
import { notFound } from 'next/navigation';

interface TrackPageProps {
  params: {
    id: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function TrackPage({ params }: TrackPageProps) {
  const trackDetails = await getTrackDetails(params.id);

  if (!trackDetails) {
    notFound();
  }

  return <TrackView trackDetails={trackDetails} />;
}
