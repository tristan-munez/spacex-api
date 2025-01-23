import React, { useState } from 'react';

const LaunchItem = ({ launch }) => {
  const {
    mission_name,
    links,
    launch_success,
    details,
    launch_year,
    launch_date_unix,
  } = launch;

  const [showDetails, setShowDetails] = useState(false);

  const getStatusClass = () => {
    if (launch_success) return 'launch__status--success';
    if (launch.upcoming) return 'launch__status--warning';
    return 'launch__status--danger';
  };

  const getStatusLabel = () => {
    if (launch_success) return 'Success';
    if (launch.upcoming) return 'Upcoming';
    return 'Failed';
  };

  const timeSinceLaunch = () => {
    const seconds = Math.floor((Date.now() - launch_date_unix * 1000) / 1000);
    const years = Math.floor(seconds / (60 * 60 * 24 * 365));
    return years > 0 ? `${years} years ago` : 'recently';
  };

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <div className="launch__item">
      <h2>{mission_name}</h2>
      <span className={`launch__status ${getStatusClass()}`}>{getStatusLabel()}</span>

      {showDetails && (
        <>
      <p className="launch__meta">
        {timeSinceLaunch()} |{' '}
        {links.article_link && (
          <a href={links.article_link} target="_blank" rel="noopener noreferrer">
            Article
          </a>
        )}
        {links.video_link && (
          <>
            {' | '}
            <a href={links.video_link} target="_blank" rel="noopener noreferrer">
              Video
            </a>
          </>
        )}
      </p>
      <div className="media">
        {links.mission_patch_small ? (
          <img src={links.mission_patch_small} alt={`${mission_name} patch`} />
        ) : (
          <div className="no-content">No Image Yet</div>
        )}
        <p>{details || 'No details available for this mission.'}</p>
      </div>
      </>
    )}
      <button onClick={toggleDetails} className="btn btn--primary">
        {showDetails ? 'HIDE' : 'SHOW'}
      </button>
    </div>
  );
};

export default LaunchItem;
