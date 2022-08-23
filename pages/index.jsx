import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import "bootstrap/dist/css/bootstrap.css";
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Bienvenue {session?.user?.name} <br />
        {/* link to list of playlists */}
        <Link href="/playlists">
          <a className='btn btn-primary mx-2'>Voir mes playlists</a>
        </Link>
        <Link href="/songs">
          <a href="" className='btn btn-primary mx-2'>Mes sons favoris</a>
        </Link>
        <button className="btn btn-outline-danger" onClick={() => signOut()}>
          Sign out
        </button>
      </>
    );
  }




  return (
    <>
      <div className="container">
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-md-6 text-center card card-body">
            Not signed in <br />
            <button
              className="btn btn-outline-success"
              onClick={() => signIn("")}
            >
              Sign in with Spotify
            </button>
          </div>
        </div>
      </div>
    </>

  );
}
