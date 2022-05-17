import React from 'react';
import { useParams } from 'react-router-dom'; // A React hook that gives us access to the dynamic segments of a URL i.e the Route Parameters

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous skyscrappers in the world',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu.jpg/640px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484445,
      lng: -73.9878531,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous skyscrappers in the world',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu.jpg/640px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu.jpg',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484445,
      lng: -73.9878531,
    },
    creator: 'u2',
  },
];
const UserPlaces = () => {
  const userId = useParams().userId; // This gives us access to the userId that is encoded in the Route Parameter
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId); // Only returns an array of elements where creator matched the userId Route Parameter
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
