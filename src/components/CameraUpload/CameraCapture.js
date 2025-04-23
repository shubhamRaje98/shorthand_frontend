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

  const compressImage = (imageDataUrl, maxSizeKB = 100) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate the new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        const aspectRatio = width / height;
        
        if (width > height) {
          if (width > 1024) {
            width = 1024;
            height = width / aspectRatio;
          }
        } else {
          if (height > 1024) {
            height = 1024;
            width = height * aspectRatio;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        let quality = 0.7;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        while (compressedDataUrl.length > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        
        resolve(compressedDataUrl);
      };
      img.src = imageDataUrl;
    });
  };

  const capturePhoto = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const photo = canvas.toDataURL('image/jpeg');
      
      if (photos.length < 4) {
        const compressedPhoto = await compressImage(photo);
        setPhotos((prevPhotos) => [...prevPhotos, compressedPhoto]);
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
    try {
      const formData = new FormData();
      formData.append('studentId', studentId);
  
      // Convert base64 to Blob and append to FormData
      for (let i = 0; i < photos.length; i++) {
        const base64Data = photos[i].split(',')[1];
        const blob = base64ToBlob(base64Data, 'image/jpeg');
        formData.append('answerSheets', blob, `photo${i + 1}.jpg`);
      }
  
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
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      console.error('Error config:', error.config);
    }
  };

  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  const handleFileInput = async (event) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length && photos.length < 4; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = async (e) => {
          const compressedPhoto = await compressImage(e.target.result);
          setPhotos((prevPhotos) => [...prevPhotos, compressedPhoto]);
        };
        reader.readAsDataURL(file);
      }
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