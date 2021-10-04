import React, { useEffect, useState } from 'react'
import logo from '../../img/logo.jpg'
import './SideBar.css'

const GENRE_API = "https://api.themoviedb.org/3/genre/movie/list?api_key=1a679a2bc4e6ac566c452b0ff2a58eb8&language=en-US";

const SideBar = ({changeCategory}) => {
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        fetch(GENRE_API)
          .then((res) => res.json())
          .then((data) => {
            setGenres(data.genres);
          });
    }, []);

    return (
        <div className="sidebar">
            <div className="logo">
            <a href="/"><img className="logo" src={logo} alt="logo" /></a>
            </div>
            <div className="discover">
                <h3>Discover</h3>
                <div className="category-link current" value="popularity" onClick={changeCategory}>Popular</div>
                <div className="category-link" value="vote_average" onClick={changeCategory}>Top Rated</div>
            </div>
            <div className="genres">
                <h3>Genres</h3>
                {genres && genres.map((genre) => <div className="genre-link" value={genre.id} onClick={changeCategory} key={genre.id}>{genre.name}</div>)}
            </div>
        </div>
    );
}

export default SideBar;