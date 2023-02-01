import {Ref} from 'react';
import {Song} from '../../api/songs';
import {db} from '../../db/web/db';

export function playSong(
  player: Ref<HTMLAudioElement>,
  selectedSong: Song,
  cachedSongs: Song[] = [],
) {
  const cachedSong = cachedSongs.find(song => song.id === selectedSong.id);
  //@ts-ignore
  player.current.src = selectedSong.url;
  if (!cachedSong) {
    downloadAndSaveInCache(selectedSong);
  }
  //@ts-ignore
  player.current.load();
  //@ts-ignore
  player.current.play();
}

async function downloadAndSaveInCache(song: Song) {
  const fetchSongBlobResponse = await fetch(song.url);
  const songBlob = await fetchSongBlobResponse.blob();

  let coverBlob;
  if (song.artwork) {
    const fetchCoverBlobResponse = await fetch(song.artwork);
    coverBlob = await fetchCoverBlobResponse.blob();
  }

  const songToSave = {
    ...song,
    url: URL.createObjectURL(songBlob),
    artwork: coverBlob ? URL.createObjectURL(coverBlob) : undefined,
  };
  db.songs.add(songToSave);
}
