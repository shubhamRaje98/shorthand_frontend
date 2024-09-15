import React, { useRef, useState, useEffect } from 'react';
import './CameraCapture.css';
import { IoCameraReverseOutline } from 'react-icons/io5';
import axios from 'axios';

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
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (showCamera && !isMobile) {
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
      const constraints = { video: activeCamera };
      console.log('Requesting media with constraints:', constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      if (error.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please check your browser settings and ensure camera access is allowed.');
      } else if (error.name === 'NotFoundError') {
        setCameraError('No camera found. Please ensure your device has a camera and it\'s not being used by another application.');
      } else {
        setCameraError(`Unable to access the camera: ${error.message}`);
      }

      // Try again without facingMode constraint
      try {
        const fallbackConstraints = { video: true };
        console.log('Retrying with fallback constraints:', fallbackConstraints);
        const mediaStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);

        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          await videoRef.current.play();
        }
      } catch (fallbackError) {
        console.error('Error accessing camera with fallback:', fallbackError);
      }
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
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleCamera = () => {
    setShowCamera((prev) => !prev);
  };

  const switchCamera = () => {
    stopCamera();
    setActiveCamera((prevCamera) =>
      prevCamera === videoConstraintsUser ? videoConstraintsEnvironment : videoConstraintsUser
    );
  };

  const uploadPhotos = async () => {
    // ... (uploadPhotos function remains the same)
  };

  function base64ToBlob(base64, mimeType) {
    // ... (base64ToBlob function remains the same)
  }

  const handleFileInput = (event) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (photos.length < 4) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPhotos((prevPhotos) => [...prevPhotos, e.target.result]);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removePhoto = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  return (
    <div className="camera-capture">
      <h1 className="camera-capture-title">Capture Photo</h1>

      {cameraError && <p className="camera-error">{cameraError}</p>}

      {!isMobile && (
        <button className="camera-toggle-button" onClick={toggleCamera}>
          {showCamera ? 'Hide Camera' : 'Show Camera'}
        </button>
      )}

      {showCamera && !isMobile && (
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

      {isMobile && (
        <div className="mobile-input-container">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment"
            onChange={handleFileInput}
            ref={fileInputRef}
            style={{ display: 'none' }}
            multiple
          />
          <button onClick={triggerFileInput} className="mobile-file-button" disabled={photos.length >= 4}>
            {photos.length < 4 ? 'Choose File or Capture' : 'Limit Reached'}
          </button>
        </div>
      )}

      <div className="camera-capture-gallery">
        {photos.map((photo, index) => (
          <div key={index} className="camera-capture-item">
            <img src={photo} alt={`Captured ${index}`} className="camera-capture-image" />
            <button className="remove-photo-button" onClick={() => removePhoto(index)}>Remove</button>
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