import React from 'react';

const JobPosts = ({ jobPosts,  }) => {
  const jobRoles = Object.entries(jobPosts)
    .filter(([role, isAvailable]) => isAvailable)
    .map(([role]) => role);

  return (
    <div>
      <h4>Available Job Posts: {jobRoles.length}</h4>
      <ul>
        {jobRoles.length > 0 ? (
          jobRoles.map((role, index) => (
            <li key={index} >
              <h6>{role}</h6>
            </li>
          ))
        ) : (
          <li>No job posts available</li>
        )}
      </ul>
    </div>
  );
};

export default JobPosts;
