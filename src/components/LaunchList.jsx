import React, { useState, useEffect, useRef } from 'react';
import LaunchItem from './LaunchItem';
import Spinner from './Spinner';
import SearchBar from './SearchBar';
import { fetchLaunches } from '../api/launches';

const LaunchList = () => {
  const [launches, setLaunches] = useState([]);
  const [filteredLaunches, setFilteredLaunches] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const loaderRef = useRef(null);

  const removeDuplicates = (launchesList) => {
    return launchesList.filter(
      (value, index, self) => index === self.findIndex((t) => t.flight_number === value.flight_number)
    );
  };

  const loadLaunches = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const newLaunches = await fetchLaunches(offset);
      if (newLaunches.length > 0) {
        setLaunches((prevLaunches) => {
          const allLaunches = [...prevLaunches, ...newLaunches];
          return removeDuplicates(allLaunches);
        });
        setFilteredLaunches((prevLaunches) => {
          const allFilteredLaunches = [...prevLaunches, ...newLaunches];
          return removeDuplicates(allFilteredLaunches);
        });
        setOffset((prevOffset) => prevOffset + 5);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching launches:', error);
    } finally {
      setLoading(false);
      if (firstLoad) {
        setFirstLoad(false);
      }
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadLaunches();
        }
      },
      { root: document.querySelector('.container'), rootMargin: '0px', threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loaderRef, hasMore, loading]);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredLaunches(launches);
    } else {
      const filtered = launches.filter((launch) =>
        launch.mission_name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredLaunches(filtered);
    }
  };

  useEffect(() => {
    loadLaunches();
  }, []);

  return (
    <>
      <div style={{ padding: "1rem" }}>
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="launch__wrapper launch__list">
        {firstLoad || filteredLaunches.length > 0 ? (
          filteredLaunches.map((launch) => (
            <LaunchItem key={launch.flight_number} launch={launch} />
          ))
        ) : (
          <p>No launches found</p>
        )}

        {loading && <Spinner />}
        <div ref={loaderRef} style={{ height: '1px', marginBottom: '10px', background: 'transparent' }} />
        {!hasMore && <p className="max-reached">End of List.</p>}
      </div>
    </>
  );
};

export default LaunchList;
