import {useLiveQuery} from 'dexie-react-hooks';
import React, {useEffect, useRef, useState} from 'react';
import {db} from '../db/web/db';
import {useSongs} from '../hooks/useSongs';
import {playSong} from '../utils/web/utils';

const MusicPlayer = () => {
  const player = useRef<HTMLDivElement>(null);

  const {isLoading, error, data} = useSongs();
  const [currentIndex, setCurrentIndex] = useState(0);
  const cachedSongs = useLiveQuery(() => db.songs.toArray());

  const attachActionHandlersForMobileDevices = () => {
    //@ts-ignore
    navigator.mediaSession.setActionHandler('play', () =>
      //@ts-ignore
      player.current.play(),
    );
    //@ts-ignore
    navigator.mediaSession.setActionHandler('pause', () =>
      //@ts-ignore
      player.current.pause(),
    );
    // navigator.mediaSession.setActionHandler('nexttrack', () =>
    // 		// @ts-expect-error
    // 		playNextSong(player.current, data.baseStorageUrl, data.songs, playerState, $cachedSongs)
    // 	);
    // 	navigator.mediaSession.setActionHandler('seekbackward', (details) => {
    // 		const skipTime = details.seekOffset || 1;
    // 		player.current.currentTime = Math.max(player.current.currentTime - skipTime, 0);
    // 	});
    // 	navigator.mediaSession.setActionHandler('seekforward', (details) => {
    // 		const skipTime = details.seekOffset || 1;
    // 		player.current.currentTime = Math.min(player.current.currentTime + skipTime, player.current.duration);
    // 	});
    // 	navigator.mediaSession.setActionHandler('seekto', (details) => {
    // 		if (details.seekTime) {
    // 			if (details.fastSeek && 'fastSeek' in player) {
    // 				player.fastSeek(details.seekTime);
    // 				return;
    // 			}
    // 			player.currentTime = details.seekTime;
    // 		}
    // 	});
  };
  useEffect(() => {
    attachActionHandlersForMobileDevices();
    if (player.current) {
      //@ts-ignore
      player.current.onended = () =>
        setCurrentIndex(index => {
          if (data && index === data.songs.length - 1) {
            return 0;
          }
          return index + 1;
        });
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      playSong(player, data.songs[currentIndex], cachedSongs);
    }
  }, [data, cachedSongs, currentIndex]);

  if (isLoading) {
    return 'Loading...';
  }

  if (error) {
    //@ts-ignore
    return 'An error has occurred: ' + error.message;
  }

  return (
    <div>
      {data && <img src={data.songs[currentIndex].artwork} />}
      <audio ref={player} controls>
        {data && (
          <source type="audio/mpeg" src={data.songs[currentIndex].url} />
        )}
      </audio>
    </div>
  );
};

export default MusicPlayer;
