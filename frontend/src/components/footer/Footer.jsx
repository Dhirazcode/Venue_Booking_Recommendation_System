import React, { useState } from 'react';
import './footer.css';

const Footer = () => {
  const [showDevelopers, setShowDevelopers] = useState(false);

  const toggleDevelopers = () => {
    setShowDevelopers(!showDevelopers);
  };

  return (
    <div className="footer">
      <p>This web application is developed to facilitate users to book venues and get recommendations of venues. It is developed as the project work for B.Sc. CSIT 7th semester in 2024.</p>
      <button className="cbtn" onClick={toggleDevelopers}>
        {showDevelopers ? 'Hide Developers' : 'Show Developers'}
      </button>
      {showDevelopers && (
        <h1>Madan B.K. | Samir Basyal | Dhiraj Kumar Kushuwah</h1>
      )}
      <div className="fText">Copyright © 2024 VenueNow</div>
    </div>
  );
};

export default Footer;
