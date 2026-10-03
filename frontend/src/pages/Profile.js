import React from "react";
import { ProfileIcon } from "../components/icons";
import "./Profile.css";

function Profile() {
  return (
    <section className="profile-view" aria-labelledby="profile-title">
      <div className="profile-avatar" aria-hidden="true">
        <ProfileIcon />
      </div>
      <h2 id="profile-title">Your profile</h2>
      <p>Profile details will appear here when account access is connected.</p>
    </section>
  );
}

export default Profile;