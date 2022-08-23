import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { useSession } from "next-auth/react";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export default function Songs() {
    const { data: session } = useSession();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [total, setTotal] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    const [search, setSearch] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [searchOffset, setSearchOffset] = useState(0);
    const [searchLimit, setSearchLimit] = useState(20);
    const [searchTotal, setSearchTotal] = useState(0);
    const [searchNext, setSearchNext] = useState(null);
    const [searchPrevious, setSearchPrevious] = useState(null);
    const [searchSongs, setSearchSongs] = useState([]);
    const [searchPlaylists, setSearchPlaylists] = useState([]);
    const [searchArtists, setSearchArtists] = useState([]);
    const [searchAlbums, setSearchAlbums] = useState([]);
    const [searchTracks, setSearchTracks] = useState([]);
    const [searchUsers, setSearchUsers] = useState([]);
    const [searchPlaylist, setSearchPlaylist] = useState([]);
    const [searchPlaylistTracks, setSearchPlaylistTracks] = useState([]);
    const [searchPlaylistTotal, setSearchPlaylistTotal] = useState(0);
    const [searchPlaylistNext, setSearchPlaylistNext] = useState(null);
    const [searchPlaylistPrevious, setSearchPlaylistPrevious] = useState(null);
    const [searchPlaylistOffset, setSearchPlayListOffset] = useState(0);

    useEffect(() => {
        if (session) {
            setLoading(true);
            spotifyApi.setAccessToken(session.accessToken);
            spotifyApi.getMySavedTracks({
                limit: limit,
                offset: offset,
            })
                .then(data => {
                    console.log(data.body.items);
                    setSongs(data.body.items);
                    setTotal(data.body.total);
                    setNext(data.body.next);
                    setPrevious(data.body.previous);
                    setLoading(false);
                }).catch(error => {
                    setError(error);
                    setLoading(false);
                }
            );
        }
    }
        , [session, offset, limit]);
    
    useEffect(() => {
        if (session) {
            setSearchLoading(true);
            spotifyApi.setAccessToken(session.accessToken);
            spotifyApi.searchTracks(search, {
                limit: searchLimit,
                offset: searchOffset,
            })
                .then(data => {
                    setSearchSongs(data.body.tracks.items);
                    setSearchTotal(data.body.tracks.total);
                    setSearchNext(data.body.tracks.next);
                    setSearchPrevious(data.body.tracks.previous);
                    setSearchLoading(false);
                }).catch(error => {
                    setSearchError(error);
                    setSearchLoading(false);
                }
            );
        }
    }
        , [session, search, searchOffset, searchLimit]);
    
    return (
        <div>
            <h1>Songs</h1>
            <div>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
                <button onClick={() => setSearchOffset(0)}>Search</button>
            </div>
            <div>
                {searchLoading && <p>Loading...</p>}
                {searchError && <p>Error: {searchError.message}</p>}
                {searchSongs.map(song => (
                    <div key={song.id}>
                        <p>{song.name}</p>
                        <p>{song.artists.map(artist => artist.name).join(", ")}</p>
                        <p>{song.album.name}</p>
                        {/* <p>{song.album.release_date}</p> */}
                        {/* <p>{song.album.release_date_precision}</p> */}
                        {/* <p>{song.album.type}</p> */}
                        {/* <p>{song.album.available_markets.join(", ")}</p> */}
                        {/* <p>{song.album.external_urls.spotify}</p> */}
                        {/* <p>{song.album.href}</p> */}
                        {/* <p>{song.album.uri}</p> */}
                        <hr />
                    </div>
                ))}
                {searchTotal > 0 && <div>
                    <button onClick={() => setSearchOffset(searchOffset - searchLimit)}>Previous</button>
                    <button onClick={() => setSearchOffset(searchOffset + searchLimit)}>Next</button>
                </div>}
            </div>
            <div>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error.message}</p>}
                {songs.map(song => (
                    <div key={song.track.id} className="border border-danger">
                        <p>{song.track.name}</p>
                        <p>{song.track.artists.map(artist => artist.name).join(", ")}</p>
                        <p>{song.track.album.name}</p>
                        <p>{song.track.album.release_date}</p>
                        <hr />
                    </div>
                ))}
                {total > 0 && <div>
                    <button onClick={() => setOffset(offset - limit)}>Previous</button>
                    <button onClick={() => setOffset(offset + limit)}>Next</button>
                </div>}
            </div>
        </div>
    );
}
