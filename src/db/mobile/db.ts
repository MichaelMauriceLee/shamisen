import {Song} from '../../api/songs';
import RNFS from 'react-native-fs';
import uuid from 'react-native-uuid';
import {QuickSQLiteConnection} from 'react-native-quick-sqlite';

const tableName = 'songs';

export const createTable = async (db: QuickSQLiteConnection) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        url TEXT NOT NULL,
        artwork TEXT,
        title TEXT,
        artist TEXT
    );`;

  await db.executeAsync(query);
};

export const getSongs = async (db: QuickSQLiteConnection): Promise<Song[]> => {
  try {
    const songs: Song[] = [];
    const {rows} = await db.executeAsync(`SELECT * FROM ${tableName}`);
    (rows as unknown as Song[]).forEach(row => {
      songs.push(row);
    });
    return songs;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get songs !!!');
  }
};

export const saveSong = async (db: QuickSQLiteConnection, song: Song) => {
  const songFileLocation = RNFS.DocumentDirectoryPath + '/' + uuid.v4();
  const coverFileLocation = RNFS.DocumentDirectoryPath + '/' + uuid.v4();

  const {promise: downloadSongPromise} = RNFS.downloadFile({
    fromUrl: song.url,
    toFile: songFileLocation,
  });
  const {promise: downloadCoverPromise} = RNFS.downloadFile({
    fromUrl: song.url,
    toFile: coverFileLocation,
  });
  await Promise.all([downloadCoverPromise, downloadSongPromise]);

  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(id, url, artwork, title, artist) values` +
    `(${song.id}, '${songFileLocation}', '${coverFileLocation}', '${song.title}', '${song.artist}')`;

  return db.executeAsync(insertQuery);
};
