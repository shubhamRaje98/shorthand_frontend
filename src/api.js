// src\api.js
import axios from 'axios'
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const API_ENDPOINTS = {
    UPLOAD_STUDENT_DATA: '/upload-student-data',
    DOWNLOAD_STUDENT_HALLTICKET: '/download-student-hall-ticket',
    DOWNLOAD_ALL_STUDENT_HALLTICKET: '/download-all-hall-tickets'
}

// Create axios instance with base URL
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": 'application/json'
    }
})

// Helper function for file uploads
const uploadExcelFile = async (file) => {
    const formData = new FormData();
    formData.append('excelFile', file);

    return api.post(API_ENDPOINTS.UPLOAD_STUDENT_DATA, formData, {
        headers: {
            "Content-Type": 'multipart/form-data'
        }
    })
}

export const downloadAllHallTickets = (seatNo) => {
    return `${API_BASE_URL}${DOWNLOAD_ALL_STUDENT_HALLTICKET}`;
}

