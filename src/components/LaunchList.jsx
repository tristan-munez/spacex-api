import React, { useState, useEffect, useRef } from 'react';
import LaunchItem from './LaunchItem';
import Spinner from './Spinner'; // Assuming you have a Spinner component

import { fetchLaunches } from '../api/launches';

const LaunchList = () => {
    const [launches, setLaunches] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef(null); // Reference for the loader element
  
    useEffect(() => {
      const loadLaunches = async () => {
        if (loading || !hasMore) return;
  
        setLoading(true);
        try {
          const newLaunches = await fetchLaunches(offset);
          if (newLaunches.length > 0) {
            setLaunches((prevLaunches) => [...prevLaunches, ...newLaunches]);
            setOffset((prevOffset) => prevOffset + 5);
          } else {
            setHasMore(false); // No more data to fetch
          }
        } catch (error) {
          console.error('Error fetching launches:', error);
        } finally {
          setLoading(false);
        }
      };
  
      loadLaunches();
    }, [offset, loading, hasMore]);
  
    useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
              console.log('Observer triggered:', entries[0].isIntersecting);
              if (entries[0].isIntersecting && hasMore && !loading) {
                  console.log('Loading more data...');
                  setOffset((prevOffset) => prevOffset + 5); // Trigger fetch
              }
          },
          { root: document.querySelector('.container'), rootMargin: '0px', threshold: 1.0 }
        );
          
      if (loaderRef.current) observer.observe(loaderRef.current);
  
      return () => {
        if (loaderRef.current) observer.unobserve(loaderRef.current);
      };
    }, [loaderRef, hasMore, loading]);

    return (
        <div className="launch__wrapper launch__list">
            {launches.map((launch) => (
                <LaunchItem key={launch.flight_number} launch={launch} />
            ))}
            {loading && <Spinner />}
            <div ref={loaderRef} style={{ height: '1px', marginBottom: '10px', background: 'transparent' }} />
            {!hasMore && <p className="max-reached">End of List.</p>}
        </div>
    );
};

export default LaunchList;
