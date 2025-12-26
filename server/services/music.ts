import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-node';
import { google } from 'googleapis';

export class MusicService {
  private spotifyApi: SpotifyWebApi;

  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI
    });
  }

  // Spotify Logic
  async getSpotifyArtist(artistId: string, accessToken: string) {
    this.spotifyApi.setAccessToken(accessToken);
    try {
      const data = await this.spotifyApi.getArtist(artistId);
      return data.body;
    } catch (error) {
      console.error('Spotify API Error:', error);
      return null;
    }
  }

  // YouTube Logic (Stub for now as it requires complex OAuth)
  async getYouTubeChannelStats(channelId: string, apiKey: string) {
    const youtube = google.youtube({
      version: 'v3',
      auth: apiKey
    });
    try {
      const res = await youtube.channels.list({
        part: ['statistics', 'snippet'],
        id: [channelId]
      });
      return res.data.items?.[0];
    } catch (error) {
      console.error('YouTube API Error:', error);
      return null;
    }
  }
}

export const musicService = new MusicService();
