import React, {useEffect, useRef} from 'react';
import {useSongs} from '../hooks/useSongs';

const MusicPlayer = () => {
  const player = useRef<HTMLDivElement>(null);

  const {isLoading, error, data} = useSongs();

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
    // player.current.onended = () =>
    //   playNextSong();
  }, []);

  if (isLoading) {
    return 'Loading...';
  }

  if (error) {
    //@ts-ignore
    return 'An error has occurred: ' + error.message;
  }

  return (
    <audio ref={player} controls>
      {data && (
        <source
          type="audio/mpeg"
          src={data.baseStorageUrl + '/' + data.songs[0]}
        />
      )}
    </audio>
  );
};

export default MusicPlayer;
