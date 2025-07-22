import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import defaultPic from "../assets/defaultimage.png";

const initialContributors = [
  {
    name: "Abdullahi Mohamed",
    imageUrl: "https://ui-avatars.com/api/?name=Abdullahi+Mohamed&background=0D8ABC&color=fff",
    github: "https://github.com/Abdul-zaki",
  },
  {
    name: "Mohamed Nuradin",
    imageUrl: "https://ui-avatars.com/api/?name=Mohamed+Nuradin&background=0D8ABC&color=fff",
    github: "https://github.com/eng-ayzer",
  },
  {
    name: "Fatuma Gabow",
    imageUrl: "https://ui-avatars.com/api/?name=Fatuma+Gabow&background=0D8ABC&color=fff",
    github: "https://github.com/Hafsa2356",
  },
];

const AboutPage = () => {
  const [contributors, setContributors] = useState(initialContributors);

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...contributors];
        updated[index].imageUrl = reader.result;
        setContributors(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar />

      <div className="flex flex-col flex-grow px-4 sm:px-6 lg:px-12 py-8 sm:py-12 bg-gray-100 items-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-blue-700 text-center">
          About ConnectHub
        </h1>

        <p className="text-center max-w-3xl mb-8 text-gray-700 leading-relaxed px-4">
          ConnectHub is a lightweight social networking platform designed for niche communities and focused peer sharing. 
          In contrast to bloated platforms like Twitter or Facebook, ConnectHub brings back the simplicity of meaningful 
          content sharing without distractions, ads, or toxic algorithms. The app allows users to create posts 
          (text + optional image), follow other users, and view a personalized feed of content from those they follow. 
          Its clean UI and minimal features are ideal for hobbyists, study groups, small online communities, and student cohorts — 
          allowing people to connect around shared interests with clarity and intention.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          {contributors.map((person, index) => (
            <div
              key={person.name}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
              title={person.bio}
            >
              <img
                src={person.imageUrl && person.imageUrl.trim() !== "" ? person.imageUrl : defaultPic}
                alt={person.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 object-cover border-2 border-blue-500 hover:scale-105 transition-transform duration-300"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, index)}
                className="mb-2 text-sm"
              />

              <h2 className="text-lg font-semibold">{person.name}</h2>
              <p className="text-sm text-gray-600 mb-1">{person.role}</p>
              <p className="text-xs text-gray-500 mb-2">{person.bio}</p>

              {person.github && (
                <a
                  href={person.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  GitHub
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
