
export default function Playlist( {playlist} ) {
  return (
    <div className="container">
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-md-6 text-center card card-body">
          <h1>{playlist.name}</h1>
          <p>{playlist.description}</p>
          <p>{playlist.tracks.items.length} tracks</p>
          <p>{playlist.tracks.items.map(track => track.track.name).join(", ")}</p>
        </div>
      </div>
    </div>
  );
}