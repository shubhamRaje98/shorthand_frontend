import React, { useRef, useState, useEffect } from 'react';
import './CameraCapture.css'; // Ensure this path is correct
import { IoCameraReverseOutline } from 'react-icons/io5'; // For camera toggle button
import axios from 'axios'; // To handle image upload

const videoConstraintsEnvironment = {
  facingMode: "environment",
};
const videoConstraintsUser = {
  facingMode: "user",
};

const CameraCapture = ({ studentId }) => {
  const [photos, setPhotos] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [activeCamera, setActiveCamera] = useState(videoConstraintsEnvironment);
  const [uploadError, setUploadError] = useState('');
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
      
      if (photos.length < 4) {
        setPhotos((prevPhotos) => [...prevPhotos, photo]);
      }
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

  const uploadPhotos = async () => {
  try {
    const formData = new FormData();
    formData.append('studentId', studentId);

    // Convert base64 to Blob and append to FormData
    photos.forEach((photo, index) => {
      // Remove the data URL prefix
      const base64Data = photo.split(',')[1];
      const blob = base64ToBlob(base64Data, 'image/jpeg');
      formData.append('answerSheets', blob, `photo${index + 1}.jpg`);
    });

    // Log FormData contents (for debugging)
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const response = await axios.post('http://localhost:3000/upload-answersheet', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      alert('Photos uploaded successfully!');
      setPhotos([]);
    } else {
      setUploadError(`Failed to upload photos. Server responded with status ${response.status}`);
    }
  } catch (error) {
    setUploadError('Error uploading photos. Please try again.');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    console.error('Error config:', error.config);
  }
};

// Helper function to convert base64 to Blob
function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

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

          <button className="camera-capture-button" onClick={capturePhoto} disabled={photos.length >= 4}>
            {photos.length < 4 ? 'Capture Photo' : 'Limit Reached'}
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

      {photos.length === 4 && (
        <p className="camera-capture-limit">Maximum of 4 photos captured.</p>
      )}

      {photos.length > 0 && (
        <button className="upload-button" onClick={uploadPhotos}>
          Upload Photos
        </button>
      )}

      {uploadError && <p className="upload-error">{uploadError}</p>}
    </div>
  );
};

export default CameraCapture;
