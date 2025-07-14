
'use server';

import { google } from 'googleapis';
import type { Song, Artist } from '@/lib/data';

// The YouTube API key is loaded from the .env file.
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  console.warn("YOUTUBE_API_KEY environment variable not set. YouTube API calls will likely fail. Please check your environment variables.");
}

const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY,
});

// Helper function to parse ISO 8601 duration format (e.g., "PT2M34S")
const parseISODuration = (isoDuration: string | undefined | null): number => {
    if (!isoDuration) return 0;
  
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const matches = isoDuration.match(regex);
  
    if (!matches) return 0;
  
    const hours = parseInt(matches[1] || '0', 10);
    const minutes = parseInt(matches[2] || '0', 10);
    const seconds = parseInt(matches[3] || '0', 10);
  
    return (hours * 3600) + (minutes * 60) + seconds;
};


export async function search(query: string): Promise<{songs: Song[], artists: Artist[], error?: string}> {
  if (!query) {
    return { songs: [], artists: [] };
  }
  if (!YOUTUBE_API_KEY) return { songs: [], artists: [], error: 'Server configuration error: YouTube API key is missing.' };

  try {
    const songSearchResponse = await youtube.search.list({
        part: ['snippet'],
        q: query,
        type: ['video'],
        videoCategoryId: '10', // Music category
        maxResults: 20,
    });
    
    // Process songs
    const songItems = songSearchResponse.data.items;
    let songs: Song[] = [];
    if (songItems && songItems.length > 0) {
        const videoIds = songItems
          .map(item => item.id?.videoId)
          .filter((id): id is string => !!id);
        
        if (videoIds.length > 0) {
            const videoDetailsResponse = await youtube.videos.list({
              part: ['contentDetails'],
              id: videoIds,
            });

            const durationMap = new Map<string, number>();
            videoDetailsResponse.data.items?.forEach(item => {
              if (item.id && item.contentDetails?.duration) {
                durationMap.set(item.id, parseISODuration(item.contentDetails.duration));
              }
            });

            songs = songItems
              .filter(item => item.id?.videoId && item.snippet?.title)
              .map((item: any) => ({
                id: item.id.videoId,
                title: item.snippet.title,
                artist: item.snippet.channelTitle,
                album: item.snippet.channelTitle,
                image: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url || '',
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                duration: durationMap.get(item.id.videoId) || 0,
            }));
        }
    }

    return { songs, artists: [] };
  } catch (error: any) {
    console.error('An error occurred while searching with YouTube API:', error);
    if (error.message && error.message.includes('quota')) {
        return { songs: [], artists: [], error: 'YouTube API quota exceeded. Please try again later or update your API key.' };
    }
    if (error.message && error.message.includes('API key not valid')) {
        return { songs: [], artists: [], error: 'The YouTube API key is not valid. Please check your environment variable configuration.' };
    }
    if (error.message && error.message.includes('API v3 has not been used')) {
        return { songs: [], artists: [], error: 'The YouTube Data API is not enabled for this project. Please enable it in your Google Cloud Console and try again.' };
    }
    return { songs: [], artists: [], error: 'Could not fetch search results from YouTube.' };
  }
}

export async function getTrackDetails(trackId: string): Promise<Song | null> {
    if (!trackId) return null;
    if (!YOUTUBE_API_KEY) return null;

    try {
        const response = await youtube.videos.list({
            part: ['snippet', 'contentDetails'],
            id: [trackId],
        });

        const video = response.data.items?.[0];
        if (!video || !video.id) {
            console.error(`Could not find track with ID ${trackId} from YouTube API`);
            return null;
        }

        return {
            id: video.id,
            title: video.snippet?.title || 'Unknown Title',
            artist: video.snippet?.channelTitle || 'Unknown Artist',
            album: video.snippet?.channelTitle || 'Unknown Album', // Album data is not provided by the API
            image: video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.default?.url || '',
            duration: parseISODuration(video.contentDetails?.duration),
            url: `https://www.youtube.com/watch?v=${video.id}`,
        };
    } catch (error) {
        console.error('An error occurred while fetching track details with YouTube API:', error);
        return null;
    }
}

export async function getTrendingMusic(): Promise<{songs: Song[], error?: string}> {
  if (!YOUTUBE_API_KEY) return { songs: [], error: 'Server configuration error: YouTube API key is missing.' };
  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'contentDetails'],
      chart: 'mostPopular',
      regionCode: 'IN',
      videoCategoryId: '10', // Music
      maxResults: 15,
    });

    const videos = response.data.items;
    if (!videos || videos.length === 0) {
      console.error('No trending music found.');
      return { songs: [] };
    }

    const songs = videos
      .filter(video => video.id && video.snippet)
      .map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        artist: video.snippet.channelTitle,
        album: video.snippet.channelTitle, // No album data from this endpoint
        image: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.default?.url || '',
        duration: parseISODuration(video.contentDetails?.duration),
        url: `https://www.youtube.com/watch?v=${video.id}`,
      }));
    return { songs };
  } catch (error: any) {
    console.error('An error occurred while fetching trending music:', error);
     if (error.message && error.message.includes('quota')) {
        return { songs: [], error: 'YouTube API quota exceeded. The app will have limited functionality until the quota resets.' };
    }
    if (error.message && error.message.includes('API key not valid')) {
        return { songs: [], error: 'The YouTube API key is not valid. Please check your environment variable configuration.' };
    }
    if (error.message && error.message.includes('API v3 has not been used')) {
        return { songs: [], error: 'The YouTube Data API is not enabled for this project. Please enable it in your Google Cloud Console and try again.' };
    }
    return { songs: [], error: 'Could not fetch trending music from YouTube.' };
  }
}
