import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import defaultPic from "../assets/defaultimage.png";

const contributors = [
  {
    name: "Abdullahi",
    imageUrl: "https://ui-avatars.com/api/?name=Abdullahi&background=0D8ABC&color=fff",
    github: "https://github.com/abdullahi",
    role: "Frontend Developer",
    bio: "UI-focused engineer",
  },
  {
    name: "Mohamed",
    imageUrl: "",
    github: "https://github.com/eng-ayzer",
    role: "Backend Developer",
    bio: "Java Spring & APIs",
  },
  {
    name: "Fatuma",
    imageUrl: null,
    github: "https://github.com/Hafsa2356",
    role: "Designer",
    bio: "Minimalist UI/UX",
  },
];

const AboutPage = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-grow px-6 py-12 bg-gray-100 items-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700 text-center">About ConnectHub</h1>

        <p className="text-center max-w-3xl mb-8 text-gray-700 leading-relaxed">
          ConnectHub is a lightweight social networking platform designed for niche communities and focused peer sharing. 
          In contrast to bloated platforms like Twitter or Facebook, ConnectHub brings back the simplicity of meaningful 
          content sharing without distractions, ads, or toxic algorithms. The app allows users to create posts 
          (text + optional image), follow other users, and view a personalized feed of content from those they follow. 
          Its clean UI and minimal features are ideal for hobbyists, study groups, small online communities, and student cohorts — 
          allowing people to connect around shared interests with clarity and intention.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {contributors.map((person) => (
            <div
              key={person.name}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={person.imageUrl && person.imageUrl.trim() !== "" ? person.imageUrl : defaultPic}
                alt={person.name}
                className="w-20 h-20 rounded-full mb-4 object-cover border-2 border-blue-500"
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
