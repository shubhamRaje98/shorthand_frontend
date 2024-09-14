import React, { useRef, useState, useEffect } from 'react';
import './CameraCapture.css'; // Ensure this path is correct
import { IoCameraReverseOutline } from 'react-icons/io5'; // For camera toggle button

const videoConstraintsEnvironment = {
  facingMode: "environment",
};
const videoConstraintsUser = {
  facingMode: "user",
};

const CameraCapture = () => {
  const [photos, setPhotos] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [activeCamera, setActiveCamera] = useState(videoConstraintsEnvironment);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (showCamera) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [showCamera, activeCamera]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: activeCamera
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      setCameraError('Unable to access the camera. Please check permissions or try a different browser.');
      console.error('Error accessing camera:', error);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL('image/jpeg');
      setPhotos((prevPhotos) => [...prevPhotos, photo]);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const toggleCamera = () => {
    setShowCamera((prev) => !prev);
  };

  const switchCamera = () => {
    setActiveCamera((prevCamera) =>
      prevCamera === videoConstraintsUser ? videoConstraintsEnvironment : videoConstraintsUser
    );
  };

  return (
    <div className="camera-capture">
      <h1 className="camera-capture-title">Capture Photo</h1>

      {cameraError && <p className="camera-error">{cameraError}</p>}

      <button className="camera-toggle-button" onClick={toggleCamera}>
        {showCamera ? 'Hide Camera' : 'Show Camera'}
      </button>

      {showCamera && (
        <>
          <div className="camera-container">
            <video
              ref={videoRef}
              className="camera-video"
              autoPlay
              playsInline
              style={{ width: '100%', height: '100%' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          <button className="camera-capture-button" onClick={capturePhoto}>
            Capture Photo
          </button>

          <button
            className="camera-toggle-button"
            onClick={switchCamera}
            style={{ marginTop: '10px' }}
          >
            <IoCameraReverseOutline size={20} /> Switch Camera
          </button>
        </>
      )}

      <div className="camera-capture-gallery">
        {photos.map((photo, index) => (
          <div key={index} className="camera-capture-item">
            <img src={photo} alt={`Captured ${index}`} className="camera-capture-image" />
          </div>
        ))}
      </div>

      {photos.length === 5 && (
        <p className="camera-capture-limit">Maximum of 5 photos uploaded.</p>
      )}
    </div>
  );
};

export default CameraCapture;
