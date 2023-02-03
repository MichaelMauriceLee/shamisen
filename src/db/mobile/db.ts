// import {
//   enablePromise,
//   openDatabase,
//   SQLiteDatabase,
// } from 'react-native-sqlite-storage';
import {Song} from '../../api/songs';
import RNFS from 'react-native-fs';

const tableName = 'songs';

// enablePromise(true);

// export const getDBConnection = async () => {
//   return openDatabase({name: 'shamisen.db', location: 'default'});
// };

// export const createTable = async (db: SQLiteDatabase) => {
//   const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
//         url TEXT NOT NULL,
//         artwork TEXT,
//         title TEXT,
//         artist TEXT
//     );`;

//   await db.executeSql(query);
// };

// export const getSongs = async (db: SQLiteDatabase): Promise<Song[]> => {
//   try {
//     const songs: Song[] = [];
//     const results = await db.executeSql(`SELECT * FROM ${tableName}`);
//     results.forEach(result => {
//       for (let index = 0; index < result.rows.length; index++) {
//         songs.push(result.rows.item(index));
//       }
//     });
//     return songs;
//   } catch (error) {
//     console.error(error);
//     throw Error('Failed to get songs !!!');
//   }
// };

export const saveSong = async (song: Song) => {
  const songFileLocation = RNFS.DocumentDirectoryPath + '/test';
  const coverFileLocation = RNFS.DocumentDirectoryPath + '/test';

  const {promise: downloadSongPromise} = RNFS.downloadFile({
    fromUrl: song.url,
    toFile: songFileLocation,
  });
  const {promise: downloadCoverPromise} = RNFS.downloadFile({
    fromUrl: song.url,
    toFile: coverFileLocation,
  });
  await Promise.all([downloadCoverPromise, downloadSongPromise]);

  console.log(songFileLocation);

  // const insertQuery =
  //   `INSERT OR REPLACE INTO ${tableName}(id, url, artwork, title, artist) values` +
  //   `(${song.id}, '${songFileLocation}', '${coverFileLocation}', '${song.title}', '${song.artist}')`;

  // return db.executeSql(insertQuery);
};
