import React,{ useState, useEffect } from 'react'
import {FaPlusCircle} from 'react-icons/fa'
import {AiFillStar, AiOutlineSearch, AiFillLeftCircle} from 'react-icons/ai'
import SideBar from '../SideBar/SideBar'
import ReactModal from 'react-modal'

import './HomePage.css';

const HomePage = () => {

  const API_KEY = '&api_key=1a679a2bc4e6ac566c452b0ff2a58eb8'
  const API_SORTBY = 'https://api.themoviedb.org/3/discover/movie?sort_by='
  const API_GENRES = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&with_genres=";
  const IMG_API = "https://image.tmdb.org/t/p/w1280";

  const [currentPage, setCurrentPage] = useState(1)
  const [movies, setMovies] = useState([])
  const [category, setCategory] = useState('popularity')
  const [showCategory, setShowCategory] = useState('Popular')
  const [searchValue, setSearchValue] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [movieInfos, setMovieInfos] = useState([])
  const [movieCast, setMovieCast] = useState([])

  useEffect (() => {
    if (category === 'vote_average') {
      fetch(API_SORTBY+category+'.desc&vote_count.gte=50&language=en-US&page='+currentPage+API_KEY)
      .then(res => res.json())
      .then(data => {
          if (currentPage === 1) {
              setMovies(data.results)
          } else {
            setMovies(movies => [...movies, ...data.results])
          }
      })
    } else if (category === 'popularity') {
        fetch(API_SORTBY+category+'.desc&language=en-US&page='+currentPage+API_KEY)
        .then(res => res.json())
        .then(data => {
            if (currentPage === 1) {
                setMovies(data.results)
            } else {
                setMovies(movies => [...movies, ...data.results])
            }
        })
    } else if (category === 'Search') {
      fetch('https://api.themoviedb.org/3/search/movie?api_key=1a679a2bc4e6ac566c452b0ff2a58eb8&language=en-US&page='+currentPage+'&query='+searchValue)
      .then(res => res.json())
      .then(data => {
          if (currentPage === 1) {
              setMovies(data.results)
          } else {
            setMovies(movies => [...movies, ...data.results])
          }
      })
    } else {
      fetch(API_GENRES+category+'&language=en-US&page='+currentPage+API_KEY)
        .then(res => res.json())
        .then(data => {
            if (currentPage === 1) {
                setMovies(data.results)
            } else {
              setMovies(movies => [...movies, ...data.results])
            }
        })
    }
  }, [currentPage, category, searchValue])

  useEffect (() => {
    if (category !== 'Search') {
      const current = document.getElementsByClassName('current')
      current[0].classList.remove('current')
      document.querySelector('div[value="'+category+'"]').classList.add('current')
    } else {
      setShowCategory('Search')
    }
  }, [category])

  const getCategoryChange = (e) => {
    setCurrentPage(1)
    if (e === 'vote_average') {
      fetch(API_SORTBY+e+'.desc&vote_count.gte=50&language=en-US&page='+currentPage+API_KEY)
      .then(res => res.json())
      .then(data => {
          if (currentPage === 1) {
              setMovies(data.results)
          } else {
              data.results.map (movie => (
                  movies.push(movie)
              ))
          }
      })
    } else if (e === 'popularity') {
        fetch(API_SORTBY+e+'.desc&language=en-US&page='+currentPage+API_KEY)
        .then(res => res.json())
        .then(data => {
            if (currentPage === 1) {
                setMovies(data.results)
            } else {
                data.results.map (movie => (
                    movies.push(movie)
                ))
            }
        })
    } else {
      fetch(API_GENRES+e+'&language=en-US&page='+currentPage+API_KEY)
        .then(res => res.json())
        .then(data => {
            if (currentPage === 1) {
                setMovies(data.results)
            } else {
                data.results.map (movie => (
                    movies.push(movie)
                ))
            }
        })
    }
  }

  const handleOnClick = () => {
    setCurrentPage(currentPage + 1)
  }

  const getMovieInfos = (e) => {
    fetch('https://api.themoviedb.org/3/movie/'+e.getAttribute('data-id')+'?language=en-US'+API_KEY)
    .then(res => res.json())
    .then(data => {
      setMovieInfos(data)
    })
    fetch('https://api.themoviedb.org/3/movie/'+e.getAttribute('data-id')+'/credits?language=en-US'+API_KEY)
    .then(res => res.json())
    .then(data => {
      setMovieCast(data)
    })
  }

  const emptySearch = () => {
    setCategory('popularity')
    setShowCategory('Popular')
  }

  const search = () => {
    setCurrentPage(1)
    setCategory('Search')
  }

  return (
    <div className="container">
        <div className="search">
          <div className="search-bar">
            <input type="text" value={searchValue} onChange={e => {setSearchValue(e.target.value); e.target.value.length !== 0 ? search() : emptySearch() }}></input>
            <button><AiOutlineSearch /></button>
          </div>
        </div>
        <SideBar changeCategory={e => {setShowCategory(e.target.textContent); setCategory(e.target.attributes.value.value); getCategoryChange(e.target.attributes.value.value)}}/>
        <div className="content">
            <div className="titles">
                <h1>{showCategory}</h1>
                <h2>movies</h2>
            </div>
            <div className="movie">
                {movies.map(movie => {
                    return movie.poster_path != null ?
                    <div onClick={e => {setShowModal(true); getMovieInfos(e.target); document.body.style.overflowY = 'hidden'}} key={movie.id} className="movie-card">
                        <img data-id={movie.id} src={IMG_API + movie.poster_path} alt={movie.title}></img>
                        <div data-id={movie.id} className="movie-content">
                            <h2 data-id={movie.id}>{movie.title}</h2>
                            <span data-id={movie.id}><AiFillStar data-id={movie.id} />{movie.vote_average}</span>
                        </div>
                    </div>
                    : ""
                })}
            </div>
            <div className="pagination-content">
              <i onClick={() => {handleOnClick(); }}><FaPlusCircle /></i>
            </div>
            <ReactModal ariaHideApp={false} isOpen={showModal}>
                <div className="modal">
                  <img src={IMG_API + movieInfos.poster_path} alt={movieInfos.title}></img>
                  <div className="modal-content">
                    <h1>{movieInfos.title}</h1>
                    <h3>{movieInfos.tagline}</h3>
                    <div className="modal-subdata">
                      <span><AiFillStar />{movieInfos.vote_average}</span>
                      <span>{movieInfos.release_date} / {movieInfos.runtime} MIN</span>
                    </div>
                    <div className="modal-genres-content">
                      <h4>The Genres</h4>
                      <div className="modal-genres">
                        {movieInfos.genres && movieInfos.genres.map((genre) => (
                          <div className="modal-genre">{genre.name}</div>
                        ))}
                      </div>
                    </div>
                    <div className="modal-synopsis-content">
                      <h4>The Synopsis</h4>
                      <p>{movieInfos.overview}</p>
                    </div>
                    <div className="modal-actors-content">
                      <h4>The Actors</h4>
                      <div className="modal-actors">
                        {movieCast.cast && movieCast.cast.slice(0, 3).map((cast) => (
                          <div className="modal-actor">{cast.name}</div>
                        ))}
                      </div>
                    </div>
                    <button onClick={e => {setShowModal(false); document.body.style.overflowY = 'visible'}}><AiFillLeftCircle /></button>
                  </div>
                </div>
            </ReactModal>
        </div>
    </div>
  );
}

export default HomePage;
