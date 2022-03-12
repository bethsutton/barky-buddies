import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Spinner from './Spinner';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Slider() {
  const [loading, setLoading] = useState(true);
  const [buddies, setBuddies] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBuddies = async () => {
      const buddiesRef = collection(db, 'buddies');
      const q = query(buddiesRef, orderBy('timestamp', 'desc'), limit(5));
      const querySnap = await getDocs(q);

      let buddies = [];

      querySnap.forEach((doc) => {
        return buddies.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setBuddies(buddies);
      setLoading(false);
    };

    fetchBuddies();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (buddies.length === 0) {
    return <></>;
  }

  return (
    buddies && (
      <>
        <p className="exploreTitle">New Buddies</p>

        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {buddies.map(({ data, id }) => (
            <SwiperSlide key={id} onClick={() => navigate(`/${id}`)}>
              <div
                style={{
                  background: `url(${data.imageUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover',
                }}
                className="exploreSwiperSlideDiv"
              >
                <p className="swiperSlideText">{data.name}</p>
                {/* <p className="swiperSlidePrice">
                  ${data.discountedPrice ?? data.regularPrice}{' '}
                  {data.type === 'rent' && '/ Month'}
                </p> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}

export default Slider;
