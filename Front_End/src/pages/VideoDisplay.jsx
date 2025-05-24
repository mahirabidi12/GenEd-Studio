import React, { useState, useRef } from 'react';
import GradientText from '../components/GradientText';
import { FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaExpand } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { FaMicrophone } from "react-icons/fa6";

const VideoDisplay = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [videoFade, setVideoFade] = useState(false);
  const videoRef = useRef(null);
  const videoUrl = "https://www.example.com/sample-video.mp4";

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
  };

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = (e.pageX - progressBar.offsetLeft) / progressBar.offsetWidth;
    videoRef.current.currentTime = clickPosition * videoRef.current.duration;
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  const toggleModal = () => {
    setShowModal(prev => !prev);
  };

  return (
    <>
      {/* Inline styles for animation */}
      <style>{`
        @keyframes modalSlideIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -40%) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .modal-enter {
          animation: modalSlideIn 0.4s ease-out forwards;
        }
        .overlay-fade-in {
          animation: overlayFadeIn 0.5s forwards;
        }
        @keyframes overlayFadeIn {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        .overlay-fade-out {
          animation: overlayFadeOut 0.5s forwards;
        }
        @keyframes overlayFadeOut {
          from {opacity: 1;}
          to {opacity: 0;}
        }
      `}</style>

      <div className="min-h-screen pt-20 pb-12 flex flex-col items-center bg-black px-4 relative">
        <div className="w-full max-w-6xl">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-emerald-500 shadow-lg p-6 transition-all duration-300 hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:shadow-emerald-500/30">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-900">
              <video
                ref={videoRef}
                src={videoUrl}
                className={`w-full h-full transition-opacity duration-500 ${videoFade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                style={{ zIndex: 1 }}
              />
              {/* Custom Controls */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-500 ${videoFade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} style={{ zIndex: 2 }}>
                {/* Progress Bar */}
                <div 
                  className="h-1 w-full bg-gray-600 rounded-full mb-4 cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={togglePlay}
                      className="p-2 hover:bg-emerald-500/20 rounded-full transition-colors"
                    >
                      {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <button 
                      onClick={toggleMute}
                      className="p-2 hover:bg-emerald-500/20 rounded-full transition-colors"
                    >
                      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                  </div>
                  <button 
                    onClick={handleFullscreen}
                    className="p-2 hover:bg-emerald-500/20 rounded-full transition-colors"
                  >
                    <FaExpand />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={toggleModal}
          className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 z-10"
        >
          <FaMicrophone size={24} />
        </button>

        {/* Modal and Overlay */}
        {showModal && (
          <>
            {/* Blur Overlay with fade-in animation */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 overlay-fade-in"
              onClick={toggleModal}
            />
            {/* Modal Content with slide-in animation */}
            <div className="fixed top-1/2 left-1/2 w-full max-w-lg bg-gray-800/90 backdrop-blur-md rounded-2xl border border-emerald-500 shadow-lg p-6 z-30 modal-enter" style={{ transform: 'translate(-50%, -50%)' }}>
              <div className="flex justify-between items-center mb-4">
                <GradientText as="h3" size="text-2xl">
                  Video Information
                </GradientText>
                <button
                  onClick={toggleModal}
                  className="p-2 hover:bg-emerald-500/20 rounded-full transition-colors"
                >
                  <IoMdClose size={24} className="text-gray-400 hover:text-white" />
                </button>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>This is an educational video about React fundamentals. Here you can add any relevant information about the video content.</p>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <h4 className="text-emerald-400 font-medium mb-2">Key Points:</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Introduction to React Concepts</li>
                    <li>Understanding Components</li>
                    <li>State Management</li>
                    <li>Props and Data Flow</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default VideoDisplay;
