import { initializeCounters } from '../models/counter.js';
import connectDB from './conex.js';
import Song from '../models/songs_schema.js';
import Album from '../models/albums_schema.js';
import Playlist from '../models/playlists_schema.js';
import { fetchAndSaveSongs, fetchAndSaveAlbums, fetchAndSavePlaylists } from './fetch_items.js';
const initializeDatabase = async () => {
    try {
        ///conectar a la base de datos
        await connectDB();
        console.log('Conectado a la base de datos.');
        //inicializar contadores
        await initializeCounters();
        // verificar si hay canciones en la base de datos
        const countSongs = await Song.countDocuments();
        if (countSongs > 0) {
            console.log('Canciones ya inicializadas en la base de datos.');
        }
        else {
            await fetchAndSaveSongs();
            console.log('Canciones inicializadas en la base de datos.');
        }
        // verificar si hay albums en la base de datos
        const countAlbums = await Album.countDocuments();
        if (countAlbums > 0) {
            console.log('Albums ya inicializados en la base de datos.');
            return;
        }
        else {
            await fetchAndSaveAlbums();
            console.log('Albums inicializados en la base de datos.');
        }
        // verificar si hay playlists en la base de datos
        const countPlaylists = await Playlist.countDocuments();
        if (countPlaylists > 0) {
            console.log('Playlists ya inicializadas en la base de datos.');
            return;
        }
        else {
            await fetchAndSavePlaylists();
            console.log('Playlists inicializadas en la base de datos.');
        }
    }
    catch (err) {
        console.log('No se ha podido conectar a la base de datos', err);
    }
};
// ejecutar script
initializeDatabase()
    .then(() => {
    console.log('Inicialización completada.');
    process.exit(0);
})
    .catch((err) => {
    console.error('Error al inicializar la base de datos:', err);
    process.exit(1);
});
export default initializeDatabase;
