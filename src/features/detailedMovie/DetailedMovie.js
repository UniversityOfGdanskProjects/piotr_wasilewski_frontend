import React, {Fragment, useEffect, useState} from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchMovieById, sendComment } from './detailedMovieSlice';
import { fetchFavorites, fetchWishlisted, favoritesThunk, wishlistedThunk } from '../resources/resourceSlice';
// import myAxios from '../../myAxios';
import NavProfile from '../user/NavProfile';
import Actor from './Actor';
import Director from './Director';
import Comments from './Comments';

const DetailedMovie = () => {
    const {name} = useSelector(state => state.user);
    const {title,tagline,poster_path,director,actors,image_urls,rating,genre,error,released,comments} = useSelector(state => state.detailedMovie);
    const movieLoading = useSelector(state => state.detailedMovie.loading);
    const {favorites, wishlisted} = useSelector(state => state.genres);
    const resourcesLoading = useSelector(state => state.genres.loading);
    const { id } = useParams();
    const dispatch = useDispatch();
    const fetchDetailedMovie = async () => {
        await dispatch(fetchMovieById(id));
    };
    const fetchFavoritesList = async () => {
        await dispatch(fetchFavorites());
    };
    const fetchWishlistedList = async () => {
        await dispatch(fetchWishlisted());
    };
    const fetchAll = async () => {
        await fetchDetailedMovie();
        await fetchFavoritesList();
        await fetchWishlistedList();
    };
    useEffect(() => {
        fetchAll();
    }, []);

  const [comment, setComment] = useState('');

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(sendComment({id, comment}));
  };

  const handleFavorites = async (e) => {
    e.preventDefault();
    const fav = favorites.map(fav => fav.id).includes(id);
    await dispatch(favoritesThunk({fav,id}))
    
  };
  
  const handleWishlist = async (e) => {
    e.preventDefault();
    const wish = wishlisted.map(wish => wish.id).includes(id);
    await dispatch(wishlistedThunk({wish,id}))
  };

  return (
    <>
    <div className="bg-white rounded-lg overflow-hidden">
      <Carousel showThumbs={false}>
        {image_urls.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Image ${index + 1}`} className="w-full h-64 object-cover" />
          </div>
        ))}
      </Carousel>
      <NavProfile name={name} className="navbar"/>
      <div className="px-6 py-4">
        <div className="px-6 py-4" onClick={handleFavorites}>
        {
          
          favorites.map(fav => fav.id).includes(id) ?  
          <button  className="bg-gray-900 text-white font-bold py-2 px-4 rounded-full"> Remove from favorites </button>
          : <button  className="bg-gray-900 text-white font-bold py-2 px-4 rounded-full"> Add to favorites </button>
        }
        </div>
        <div className="px-6 py-4" onClick={handleWishlist}>
        {
          wishlisted.map(wish => wish.id).includes(id) ?
            <button  className="bg-gray-900 text-white font-bold py-2 px-4 rounded-full"> Remove from watchlist </button> 
            : <button  className="bg-gray-900 text-white font-bold py-2 px-4 rounded-full"> Add to watchlist </button>
        }
        </div>
        {/* <button className="bg-gray-900 text-white font-bold py-2 px-4 rounded-full">
          Add to watchlist
        </button>
        <button className="bg-gray-900 text-white font-bold py-2 px-4 rounded-full">
          Add to favorites
        </button> */}
        <div className="font-bold text-xl mb-2">{title}</div>
        <div className="text-gray-700 text-base">
          <span className="font-medium">Rating:</span> {rating}
        </div>
        <div className="text-gray-700 text-base">
          <span className="font-medium">Tagline:</span> {tagline}
        </div>
        <div className="text-gray-700 text-base">
          <span className="font-medium">Genre:</span> {genre}
        </div>
        <div className="text-gray-700 text-base">
          <span className="font-medium">Release date:</span> {released}
        </div>
        <div className="text-gray-700 text-base">
          <span className="font-medium">Director:</span> 
          {
            director.map((director, index) => (
              <Director key={index} {...director} />
            ))
          }
        </div>
        <div className="text-gray-700 text-base">
          <span className="font-medium">Actors:</span> 
          {
            actors.map((actor, index) => (
              <Actor key={index} {...actor} />
            ))
          }
        </div>
      </div>
      <div className="px-6 py-4">
        <img src={poster_path} alt={title} className="w-full h-64 object-cover" />
      </div>
      <Comments comments={comments}/>
      <div className="px-6 py-4">
        <div className="font-medium">Comments:</div>
        <textarea onChange={handleChange} className="bg-gray-200 rounded-lg w-full py-2 px-3" placeholder="Leave a comment"></textarea>
      </div>
    </div>
    <button
        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        type="submit"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </>
  );
};

export default DetailedMovie;
