// ComingSoon.js
import React from 'react';
import './ApplicationLink.css';
import androidLogo from '@/assets/android-logo.png'
import iosLogo from '@/assets/ios-logo.png'

const ApplicationLink = () => {
  return (
    <div className="coming-soon-container">
      <h2>בקרוב השקת אפליקציות</h2>
      <p>היישום שלנו זמין בקרוב להורדה ב-Android וב-iOS. הישארו מעודכנים</p>
      <div className="app-links">
        <a
          href="https://play.google.com/store/apps"
          target="_blank"
          rel="noopener noreferrer"
          className="android-link"
        >
          <img src={androidLogo} alt="Android" loading='lazy'/>
        </a>
        <a
          href="https://apps.apple.com"
          target="_blank"
          rel="noopener noreferrer"
          className="ios-link"
        >
          <img src={iosLogo} alt="iOS" loading='lazy'/>
        </a>
      </div>
    </div>
  );
};

export default ApplicationLink;
