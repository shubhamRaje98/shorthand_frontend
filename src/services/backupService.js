import axios from 'axios';

export const downloadBackup = async (filename) => {
    try {
        const response = await axios.get('https://www.shorthandonlineexam.in/download-backup', {
            params: { filename },
            responseType: 'blob'
        });
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        return { success: true, message: 'Backup downloaded successfully' };
    } catch (error) {
        console.error('Backup download error:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to download backup' 
        };
    }
};