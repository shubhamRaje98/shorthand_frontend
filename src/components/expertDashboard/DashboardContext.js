import React, { createContext, useState, useContext } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedQSet, setSelectedQSet] = useState(null);

  return (
    <DashboardContext.Provider value={{ selectedSubject, setSelectedSubject, selectedQSet, setSelectedQSet }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);