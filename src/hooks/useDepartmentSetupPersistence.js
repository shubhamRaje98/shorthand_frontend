// src/hooks/useDepartmentSetupPersistence.js
import { useState, useEffect } from 'react';

export const useDepartmentSetupPersistence = (stepKey, initialData) => {
  const [formData, setFormData] = useState(initialData);

  // Load persisted data on component mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Persist form data whenever it changes
  useEffect(() => {
    persistFormData();
  }, [formData]);

  const loadPersistedData = () => {
    try {
      const persisted = localStorage.getItem('departmentSetupData');
      if (persisted) {
        const data = JSON.parse(persisted);
        if (data[stepKey]) {
          setFormData(data[stepKey]);
        }
      }
    } catch (error) {
      console.error(`Error loading persisted data for ${stepKey}:`, error);
    }
  };

  const persistFormData = () => {
    try {
      const existingData = JSON.parse(localStorage.getItem('departmentSetupData') || '{}');
      const dataToPersist = {
        ...existingData,
        [stepKey]: formData,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('departmentSetupData', JSON.stringify(dataToPersist));
    } catch (error) {
      console.error(`Error persisting data for ${stepKey}:`, error);
    }
  };

  const updateCurrentStep = (stepNumber) => {
    try {
      const existingData = JSON.parse(localStorage.getItem('departmentSetupData') || '{}');
      const dataToPersist = {
        ...existingData,
        currentStep: stepNumber,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('departmentSetupData', JSON.stringify(dataToPersist));
    } catch (error) {
      console.error('Error updating current step:', error);
    }
  };

  const clearStepData = () => {
    try {
      const existingData = JSON.parse(localStorage.getItem('departmentSetupData') || '{}');
      const { [stepKey]: _, ...rest } = existingData;
      localStorage.setItem('departmentSetupData', JSON.stringify(rest));
    } catch (error) {
      console.error(`Error clearing step data for ${stepKey}:`, error);
    }
  };

  const getCurrentStep = () => {
    try {
      const persisted = localStorage.getItem('departmentSetupData');
      if (persisted) {
        const data = JSON.parse(persisted);
        return data.currentStep || 1;
      }
    } catch (error) {
      console.error('Error getting current step:', error);
    }
    return 1;
  };

  const clearAllData = () => {
    try {
      localStorage.removeItem('departmentSetupData');
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  };

  return {
    formData,
    setFormData,
    updateCurrentStep,
    clearStepData,
    getCurrentStep,
    clearAllData
  };
};