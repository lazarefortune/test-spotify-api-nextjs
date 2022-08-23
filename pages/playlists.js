import SpotifyWebApi from "spotify-web-api-node";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

function PlayLists() {

    const { data: session } = useSession();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (session) {
            setLoading(true);
            spotifyApi.setAccessToken(session.accessToken);
            spotifyApi.getUserPlaylists()
                .then(data => {
                    setPlaylists(data.body.items);
                    setLoading(false);
                }).catch(error => {
                    setError(error);
                    setLoading(false);
                }
            );
        }
    }, [session]);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
      <div>
            <div className="container">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-md-6 text-center card card-body">
                        {playlists.map(playlist => (
                            <div key={playlist.id}>
                                <h3>{playlist.name}</h3>
                                <p>{playlist.description}</p>
                                <p>{playlist.tracks.total} tracks</p>
                                <p>{playlist.owner.display_name}</p>
                                <p>{playlist.owner.id}</p>
                                <p>{playlist.owner.type}</p>
                                <p>{playlist.owner.uri}</p>
                                <p>{playlist.uri}</p>
                                {/* link to playlist page  */}
                                <a href={playlist.external_urls.spotify}>
                                    <img src={playlist.images[0].url} alt={playlist.name} height="70px" />
                                </a>
                                {/* link to playlist single page  */}
                                <Link href={`/playlist/${playlist.id}`}>
                                    <a>View Playlist</a>
                                </Link>
                                <hr />

                            </div>
                        ))}
                    </div>
                </div>
                </div>
                        
      </div>
    );


    
    // useEffect(
    //     () => {
    //     //   const { accessToken } = session;
    //     if (!accessToken) return;
    //         spotifyApi.setAccessToken(accessToken);
            
    //     spotifyApi.getNewReleases().then((res) => {
    //         console.log(res);
    //     });
            
        
    //   },
    //   []
    // );


}

export default PlayLists;