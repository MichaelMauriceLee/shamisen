import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Slider} from '@miblanchard/react-native-slider';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
  Event,
} from 'react-native-track-player';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSongs} from '../hooks/useSongs';
import {encode as btoa} from 'base-64';

const jsmediatags = require('jsmediatags');

const MusicPlayer = () => {
  const {isLoading, error, data} = useSongs();
  const [trackIndex, setTrackIndex] = useState(0);
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();

  const playBackState = usePlaybackState();
  const progress = useProgress();

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
    } catch (error) {
      console.log(error);
    }
  };

  const queueSongsAndPlay = async () => {
    if (data) {
      const songs = data?.songs.map(songName => ({
        url: `https://shamisenstorage.blob.core.windows.net/songs/${songName}`,
      }));
      await TrackPlayer.add(songs);
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });
      await getTrackData();
      await getMusicMetadata(songs[0].url);
      await TrackPlayer.play();
    }
  };

  const getMusicMetadata = async (url: string) => {
    jsmediatags.read(url, {
      onSuccess: info => {
        const {
          tags: {artist, title, picture},
        } = info;

        const {data, format} = picture;
        let base64String = '';
        for (let i = 0; i < data.length; i++) {
          base64String += String.fromCharCode(data[i]);
        }

        setTrackTitle(title);
        setTrackArtist(artist);
        setTrackArtwork(`data:${format};base64,${btoa(base64String)}`);
      },
      onError: err => console.log(err),
    });
  };

  useEffect(() => {
    if (data && playBackState === State.None) {
      queueSongsAndPlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, playBackState]);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      await getMusicMetadata(track.url);
      setTrackIndex(event.nextTrack);
    }
  });

  const getTrackData = async () => {
    const currentTrackIndex = await TrackPlayer.getCurrentTrack();
    if (currentTrackIndex) {
      const trackIndex = await TrackPlayer.getCurrentTrack();
      const trackObject = await TrackPlayer.getTrack(trackIndex);
      setTrackIndex(trackIndex);
      await getMusicMetadata(trackObject?.url);
    }
  };

  const togglePlayBack = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack != null) {
      if (playBackState === State.Paused || playBackState === State.Ready) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };

  const goToNextTrack = async () => {
    if (data && trackIndex < data.songs.length - 1) {
      await TrackPlayer.skipToNext();
      getTrackData();
    }
  };

  const goToPreviousTrack = async () => {
    if (trackIndex > 0) {
      await TrackPlayer.skipToPrevious();
      getTrackData();
    }
  };

  useEffect(() => {
    setupPlayer();
  }, []);

  if (isLoading) {
    return <Text>...Loading</Text>;
  }

  if (error) {
    //@ts-ignore
    return <Text>'An error has occurred: ' + {error.message}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.mainWrapper}>
          {trackArtwork && (
            <Image source={trackArtwork} style={styles.imageWrapper} />
          )}
        </View>
        <View style={styles.songText}>
          <Text
            style={[styles.songContent, styles.songTitle]}
            numberOfLines={3}>
            {trackTitle}
          </Text>
          <Text
            style={[styles.songContent, styles.songArtist]}
            numberOfLines={2}>
            {trackArtist}
          </Text>
        </View>
        <View>
          <Slider
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#fff"
            onSlidingComplete={async (value: any) =>
              await TrackPlayer.seekTo(value)
            }
          />
          <View style={styles.progressLevelDuraiton}>
            <Text style={styles.progressLabelText}>
              {new Date(progress.position * 1000)
                .toLocaleTimeString()
                .substring(3)}
            </Text>
            <Text style={styles.progressLabelText}>
              {new Date((progress.duration - progress.position) * 1000)
                .toLocaleTimeString()
                .substring(3)}
            </Text>
          </View>
        </View>
        <View style={styles.musicControlsContainer}>
          <TouchableOpacity onPress={goToPreviousTrack}>
            <AntDesign name="fastbackward" size={35} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePlayBack}>
            <AntDesign
              name={playBackState === State.Playing ? 'pause' : 'caretright'}
              size={75}
              color="#FFD369"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNextTrack}>
            <AntDesign name="fastforward" size={35} color="#FFD369" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MusicPlayer;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainWrapper: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    alignSelf: 'center',
    width: '90%',
    height: '90%',
    borderRadius: 15,
  },
  songText: {
    marginTop: 2,
    height: 70,
  },
  songContent: {
    textAlign: 'center',
    color: '#EEEEEE',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 16,
    fontWeight: '300',
  },
  progressBar: {
    alignSelf: 'stretch',
    marginTop: 40,
    marginLeft: 5,
    marginRight: 5,
  },
  progressLevelDuraiton: {
    width: width,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#FFF',
  },
  musicControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: '60%',
  },
});
