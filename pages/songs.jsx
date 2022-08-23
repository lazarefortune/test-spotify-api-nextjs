import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { useSession } from "next-auth/react";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export default function Songs() {
    // on définie la session
    const { data: session } = useSession();
    // on définie le state pour les sons
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // on définie le state pour la pagination
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);
    // on définie le state pour la recherche
    const [search, setSearch] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);

    const [searchOffset, setSearchOffset] = useState(0);
    const [searchLimit, setSearchLimit] = useState(3);
    const [searchTotal, setSearchTotal] = useState(0);
    const [searchNext, setSearchNext] = useState(null);
    const [searchPrevious, setSearchPrevious] = useState(null);
    // on définie le state pour la recherche par artiste
    const [searchSongs, setSearchSongs] = useState([]);

    useEffect(() => {
        if (session) {
            setLoading(true);
            spotifyApi.setAccessToken(session.accessToken);
            spotifyApi.getMySavedTracks({
                limit: limit,
                offset: offset,
            })
                .then(data => {
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
    ,
    [session, offset, limit]);
    
    useEffect(() => {
        if (!search) {
            return;
        }
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
        ,
    [session, search, searchOffset, searchLimit]);
    
    return (
        <div>
            <h1>Musiques</h1>
            <div>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
                <button onClick={() => setSearchOffset(0)}>Search</button>
            </div>
            <div>
                {search && 
                    <h3>Résultats de la recherche ({searchTotal} résultats) : </h3>
                }
                {searchLoading && <p>Loading...</p>}
                {searchError && <p>Error: {searchError.message}</p>}
                {search && searchSongs.map(song => (
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
                {search && searchTotal > 0 && <div>
                    <button onClick={() => setSearchOffset(searchOffset - searchLimit)}>Previous</button>
                    <button onClick={() => setSearchOffset(searchOffset + searchLimit)}>Next</button>
                </div>}
            </div>
            
            <div>
                <h1> Mes favoris ( {total} ) </h1>
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
                {total > 0 &&
                    <div>
                        <button onClick={() => setOffset(offset - limit)}>Previous</button>
                        <button onClick={() => setOffset(offset + limit)}>Next</button>
                    </div>
                }
            </div>
        </div>
    );
}
