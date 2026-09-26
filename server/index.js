const YTMUSIC_ORIGIN = 'https://music.youtube.com';
const YTMUSIC_API = YTMUSIC_ORIGIN + '/youtubei/v1';
const LRCLIB_API = 'https://lrclib.net/api';
const SONG_SEARCH_PARAMS = 'EgWKAQIIAWoMEA4QChADEAQQCRAF';

function currentClientVersion() {
  const now = new Date();
  const stamp = now.getUTCFullYear().toString() + String(now.getUTCMonth() + 1).padStart(2, '0') + String(now.getUTCDate()).padStart(2, '0');
  return '1.' + stamp + '.01.00';
}

function ytmusicContext(mobile) {
  return {
    context: {
      client: {
        clientName: mobile ? 'ANDROID_MUSIC' : 'WEB_REMIX',
        clientVersion: mobile ? '7.21.50' : currentClientVersion(),
        hl: 'zh-TW',
        gl: 'TW'
      }
    }
  };
}

async function ytmusicRequest(endpoint, body, mobile) {
  const clientName = mobile ? 'ANDROID_MUSIC' : 'WEB_REMIX';
  const clientVersion = mobile ? '7.21.50' : currentClientVersion();
  const response = await fetch(YTMUSIC_API + '/' + endpoint + '?prettyPrint=false', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8',
      Referer: YTMUSIC_ORIGIN + '/',
      Origin: YTMUSIC_ORIGIN,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      'X-YouTube-Client-Name': mobile ? '21' : '67',
      'X-YouTube-Client-Version': clientVersion
    },
    body: JSON.stringify({ ...body, ...ytmusicContext(Boolean(mobile)) })
  });
  const responseText = await response.text();
  if (!response.ok) {
    const detail = responseText.replace(/\s+/g, ' ').trim().slice(0, 180);
    console.error('YT Music upstream response', { endpoint, status: response.status, detail });
    throw new Error('YouTube Music 回應 ' + response.status);
  }
  const data = (() => { try { return JSON.parse(responseText); } catch { return null; } })();
  if (!data || typeof data !== 'object') throw new Error('YouTube Music 回傳格式無效');
  return data;
}

function walk(value, visitor, seen) {
  if (!value || typeof value !== 'object') return;
  const visited = seen || new WeakSet();
  if (visited.has(value)) return;
  visited.add(value);
  if (visitor(value) === true) return;
  for (const child of Object.values(value)) walk(child, visitor, visited);
}

function findFirst(value, visitor) {
  let found = null;
  walk(value, (node) => {
    if (found) return true;
    const result = visitor(node);
    if (result) { found = result; return true; }
    return false;
  });
  return found;
}

function textFromRuns(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value.simpleText) return value.simpleText;
  if (Array.isArray(value.runs)) return value.runs.map((run) => run.text || '').join('');
  return '';
}

function textFromColumn(column) {
  return textFromRuns((column && (column.musicResponsiveListItemFlexColumnRenderer || column.musicResponsiveListItemFixedColumnRenderer || column))?.text);
}

function firstWatchEndpoint(value) {
  return findFirst(value, (node) => node.watchEndpoint && node.watchEndpoint.videoId ? node.watchEndpoint : null);
}

function thumbnailUrl(renderer) {
  const thumbnails = renderer?.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
  return thumbnails.length ? thumbnails[thumbnails.length - 1].url : '';
}

function durationFromRenderer(renderer) {
  const texts = [];
  for (const column of [...(renderer.flexColumns || []), ...(renderer.fixedColumns || [])]) {
    const value = textFromColumn(column).trim();
    if (value) texts.push(value);
  }
  const match = texts.map((value) => value.match(/\b(\d{1,2}:\d{2}(?::\d{2})?)\b/)).find(Boolean)?.[1];
  if (!match) return { text: '', seconds: 0 };
  const parts = match.split(':').map(Number);
  const seconds = parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
  return { text: match, seconds };
}

function artistFromRenderer(renderer, columns) {
  const runs = renderer?.flexColumns?.[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
  const linked = runs.filter((run) => run.navigationEndpoint?.browseEndpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType === 'MUSIC_PAGE_TYPE_ARTIST').map((run) => run.text).filter(Boolean);
  if (linked.length) return linked.join('、');
  return String(columns[1] || '').replace(/^(歌曲|Song|影片|Video)\s*[•·]\s*/i, '').replace(/\s*[•·].*$/, '').trim();
}

function parseSearchResults(data) {
  const results = [];
  const seen = new Set();
  walk(data, (node) => {
    const renderer = node.musicResponsiveListItemRenderer;
    if (!renderer) return false;
    const endpoint = firstWatchEndpoint(renderer);
    if (!endpoint?.videoId || seen.has(endpoint.videoId)) return false;
    const columns = (renderer.flexColumns || []).map(textFromColumn);
    const title = String(columns[0] || '').trim();
    if (!title) return false;
    const duration = durationFromRenderer(renderer);
    const artist = artistFromRenderer(renderer, columns);
    const thumbnail = thumbnailUrl(renderer);
    seen.add(endpoint.videoId);
    results.push({
      id: { videoId: endpoint.videoId },
      snippet: {
        title,
        channelTitle: artist || 'YouTube Music',
        thumbnails: { medium: { url: thumbnail }, default: { url: thumbnail } }
      },
      duration: duration.seconds,
      source: 'youtube-music',
      ytmusic: {
        videoId: endpoint.videoId,
        title,
        artist,
        duration: duration.text,
        durationSeconds: duration.seconds,
        thumbnail,
        musicVideoType: endpoint.watchEndpointMusicSupportedConfigs?.watchEndpointMusicConfig?.musicVideoType || ''
      }
    });
    return false;
  });
  return results.slice(0, 12);
}

function lyricsBrowseId(data) {
  return findFirst(data, (node) => {
    const endpoint = node.browseEndpoint;
    const page = endpoint?.browseEndpointContextSupportedConfigs?.browseEndpointContextMusicConfig?.pageType;
    return page === 'MUSIC_PAGE_TYPE_TRACK_LYRICS' && endpoint.browseId ? endpoint.browseId : null;
  });
}

function plainLyrics(data) {
  const shelf = findFirst(data, (node) => node.musicDescriptionShelfRenderer || null);
  const description = shelf?.description;
  return textFromRuns(description).trim();
}

function sourceName(value) {
  return textFromRuns(value).replace(/^Source:\s*/i, '').trim();
}

function parseLyricsResponse(data, videoId, browseId) {
  const model = findFirst(data, (node) => node.timedLyricsModel || null);
  const lyricData = model?.lyricsData;
  const timed = Array.isArray(lyricData?.timedLyricsData) ? lyricData.timedLyricsData.map((line) => ({
    text: String(line.lyricLine || '').trim(),
    startTimeMilliseconds: Number(line.cueRange?.startTimeMilliseconds || 0),
    endTimeMilliseconds: Number(line.cueRange?.endTimeMilliseconds || 0)
  })).filter((line) => line.text) : [];
  if (timed.length) return { videoId, browseId, found: true, hasTimestamps: true, source: sourceName(lyricData?.sourceMessage), lyrics: timed };
  const plain = plainLyrics(data);
  return { videoId, browseId, found: Boolean(plain), hasTimestamps: false, source: '', lyrics: plain };
}

async function handleSearch(url) {
  const query = String(url.searchParams.get('q') || '').trim();
  if (!query) return json({ error: '請提供搜尋文字' }, 400);
  const data = await ytmusicRequest('search', { query, params: SONG_SEARCH_PARAMS }, false);
  return json({ source: 'YouTube Music', items: parseSearchResults(data) }, 200, 300);
}

async function handleLyrics(url) {
  const videoId = String(url.searchParams.get('videoId') || '').trim();
  if (!/^[\w-]{11}$/.test(videoId)) return json({ error: 'videoId 格式無效' }, 400);
  const next = await ytmusicRequest('next', {
    enablePersistentPlaylistPanel: true,
    isAudioOnly: true,
    tunerSettingValue: 'AUTOMIX_SETTING_NORMAL',
    videoId,
    playlistId: 'RDAMVM' + videoId,
    watchEndpointMusicSupportedConfigs: { watchEndpointMusicConfig: { hasPersistentPlaylistPanel: true, musicVideoType: 'MUSIC_VIDEO_TYPE_ATV' } }
  }, false);
  const browseId = lyricsBrowseId(next);
  if (!browseId) return json({ videoId, found: false, hasTimestamps: false, source: '', lyrics: '' }, 200, 300);
  const lyrics = await ytmusicRequest('browse', { browseId }, true);
  return json(parseLyricsResponse(lyrics, videoId, browseId), 200, 1800);
}

function lyricQuery(url) {
  const clean = (name, max) => String(url.searchParams.get(name) || '').trim().slice(0, max);
  return {
    trackName: clean('track_name', 180),
    artistName: clean('artist_name', 180),
    albumName: clean('album_name', 180),
    duration: Math.max(0, Math.round(Number(url.searchParams.get('duration')) || 0))
  };
}

async function lrclibRequest(path, params) {
  const url = new URL(LRCLIB_API + path);
  for (const [key, value] of Object.entries(params)) if (value !== '' && value !== 0) url.searchParams.set(key, String(value));
  let response;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'KaraokeEar/2.0 (Korean-Chinese-Japanese lyric phonetics)'
        }
      });
    } catch (error) {
      if (attempt === 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 180));
      continue;
    }
    if (attempt === 0 && (response.status === 429 || response.status >= 500)) {
      await new Promise((resolve) => setTimeout(resolve, 180));
      continue;
    }
    break;
  }
  if (!response) throw new Error('同步歌詞服務沒有回應');
  if (response.status === 404) return null;
  const responseText = await response.text();
  if (!response.ok) {
    const detail = responseText.replace(/\s+/g, ' ').trim().slice(0, 180);
    console.error('LRCLIB upstream response', { path, status: response.status, detail });
    throw new Error('同步歌詞服務回應 ' + response.status);
  }
  try { return JSON.parse(responseText); } catch { throw new Error('同步歌詞服務回傳格式無效'); }
}

async function handleLrclibSearch(url) {
  const query = lyricQuery(url);
  if (!query.trackName || !query.artistName) return json({ error: '請提供歌名與歌手' }, 400);
  const exact = await lrclibRequest('/get', {
    track_name: query.trackName,
    artist_name: query.artistName,
    album_name: query.albumName,
    duration: query.duration
  });
  if (exact && (exact.syncedLyrics || exact.plainLyrics)) return json({ source: 'LRCLIB', items: [exact] }, 200, 1800);
  const matches = await lrclibRequest('/search', { track_name: query.trackName, artist_name: query.artistName });
  return json({ source: 'LRCLIB', items: Array.isArray(matches) ? matches : [] }, 200, 900);
}

function json(data, status, maxAge) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=' + Math.max(0, Number(maxAge) || 0),
      'Access-Control-Allow-Origin': '*'
    }
  });
}

async function serveAsset(request, env) {
  if (!env?.ASSETS?.fetch) return new Response('Site asset binding is not configured', { status: 404 });
  const url = new URL(request.url);
  if (url.pathname === '/') url.pathname = '/index.html';
  return env.ASSETS.fetch(new Request(url, request));
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
    try {
      if (request.method === 'GET' && url.pathname === '/api/ytmusic/search') return await handleSearch(url);
      if (request.method === 'GET' && url.pathname === '/api/ytmusic/lyrics') return await handleLyrics(url);
      if (request.method === 'GET' && url.pathname === '/api/lyrics/search') return await handleLrclibSearch(url);
      return await serveAsset(request, env);
    } catch (error) {
      console.error('Lyrics API error', error);
      return json({ error: error instanceof Error ? error.message : '歌詞服務暫時無法回應' }, 502);
    }
  }
};

export default worker;
