import { NextResponse } from 'next/server';

const clientId = process.env.SPOTIFY_CLIENT_ID!;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    cache: 'no-store',
  });

  const data = await response.json();

  if (!data.access_token) {
    throw new Error('Spotify token refresh failed');
  }

  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 - 120_000,
  };

  return data.access_token;
}

async function getNowPlaying(accessToken: string) {
  return fetch('https://api.spotify.com/v1/me/player/currently-playing?additional_types=track,episode', {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
}

async function getRecentlyPlayed(accessToken: string) {
  return fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
}

type Cancion = Record<string, unknown>;

// Estado de esta instancia (se pierde al arrancar otra, por eso hay varios respaldos):
//  - ultima: la última canción vista, sonando o de recently-played
//  - reciente: recently-played se pide como mucho cada RECIENTE_MS (su cupo es el que se agota)
//  - pausaHasta: tras un 429 no se llama a Spotify hasta que pase el Retry-After
let ultima: Cancion | null = null;
let recienteHasta = 0;
let pausaHasta = 0;
const RECIENTE_MS = 5 * 60_000;

// El CDN de Vercel comparte la respuesta entre visitantes unos segundos: una llamada a Spotify para todos
const CACHE = { 'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=30' };

function pausar(res: Response, donde: string) {
  const segundos = Number(res.headers.get('retry-after')) || 60;
  if (Date.now() >= pausaHasta) console.error(`Spotify ${donde}: 429, pausa de ${segundos} s`);
  pausaHasta = Date.now() + segundos * 1000;
}

const sinSonar = () =>
  NextResponse.json(ultima ? { ...ultima, isPlaying: false, progress: 0, fetchedAt: Date.now() } : { isPlaying: false }, { headers: CACHE });

export async function GET() {
  if (!refreshToken) {
    return NextResponse.json({ isPlaying: false, error: 'No refresh token configured' });
  }
  if (Date.now() < pausaHasta) return sinSonar();

  try {
    const accessToken = await getAccessToken();
    const nowPlayingRes = await getNowPlaying(accessToken);

    if (nowPlayingRes.status === 200) {
      const data = await nowPlayingRes.json();

      if (data.item) {
        const isTrack = data.currently_playing_type === 'track';
        const item = data.item;

        const cancion = {
          type: data.currently_playing_type,
          title: item.name,
          artist: isTrack
            ? item.artists.map((a: { name: string }) => a.name).join(', ')
            : item.show?.publisher ?? '',
          album: isTrack ? item.album?.name : item.show?.name ?? '',
          albumArt: isTrack
            ? item.album?.images?.[1]?.url ?? item.album?.images?.[0]?.url
            : item.images?.[1]?.url ?? item.images?.[0]?.url,
          songUrl: item.external_urls?.spotify,
          duration: item.duration_ms,
        };
        ultima = cancion;

        return NextResponse.json({
          ...cancion,
          isPlaying: data.is_playing === true,
          progress: data.progress_ms,
          fetchedAt: Date.now(),
        }, { headers: CACHE });
      }
    } else if (nowPlayingRes.status === 429) {
      pausar(nowPlayingRes, 'currently-playing');
      return sinSonar();
    } else if (nowPlayingRes.status !== 204) {
      console.error('Spotify currently-playing:', nowPlayingRes.status, await nowPlayingRes.text().catch(() => ''));
    }

    // No suena nada: la última escuchada, sin pedirla más de una vez cada RECIENTE_MS
    if (ultima && Date.now() < recienteHasta) return sinSonar();

    const recentRes = await getRecentlyPlayed(accessToken);
    if (recentRes.status === 200) {
      const recentData = await recentRes.json();
      const item = recentData.items?.[0]?.track;
      recienteHasta = Date.now() + RECIENTE_MS;

      if (item) {
        ultima = {
          type: 'track',
          title: item.name,
          artist: item.artists.map((a: { name: string }) => a.name).join(', '),
          album: item.album?.name,
          albumArt: item.album?.images?.[1]?.url ?? item.album?.images?.[0]?.url,
          songUrl: item.external_urls?.spotify,
          duration: item.duration_ms,
        };
      }
    } else if (recentRes.status === 429) {
      pausar(recentRes, 'recently-played');
    } else {
      console.error('Spotify recently-played:', recentRes.status, await recentRes.text().catch(() => ''));
    }

    return sinSonar();
  } catch (error) {
    console.error('Spotify API error:', error);
    return NextResponse.json({ isPlaying: false, error: 'Failed to fetch' });
  }
}
