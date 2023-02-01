import Dexie, {Table} from 'dexie';
import {Song} from '../../api/songs';

export class MySubClassedDexie extends Dexie {
  songs!: Table<Song>;

  constructor() {
    super('shamisen');
    this.version(1).stores({
      songs: '++id, url, artwork, title, artist',
    });
  }
}

export const db = new MySubClassedDexie();
