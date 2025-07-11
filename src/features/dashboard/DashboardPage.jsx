// src/features/dashboard/DashboardPage.jsx

import React, { useState } from 'react';
import LiveMap from './components/LiveMap';
import EmployeeList from './components/EmployeeList';
import { useRealtimeLocations } from './hooks/useRealtimeLocations';
import { IconButton } from '@mui/material';
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import CircularProgress from '@mui/material/CircularProgress';

function DashboardPage() {
  const { locations, loading } = useRealtimeLocations();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFloatingListOpen, setIsFloatingListOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployeeId(prevId => prevId === employeeId ? null : employeeId);
  };

  return (
    <div className="flex flex-row h-[calc(100vh-70px)] w-full bg-gray-100 dark:bg-gray-900">

      {/* Kolom Sidebar Karyawan (Mode Normal) */}
      <div
        className={`
          flex flex-col bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-24' : 'w-80'}
          ${isFullscreen ? 'hidden' : ''} 
        `}
      >
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          {!isSidebarCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 m-0 flex-grow">
              Daftar Karyawan
            </h2>
          )}
          <IconButton
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            size="small"
            className="bg-gray-200 dark:bg-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            {isSidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </IconButton>
        </div>
        <div className="overflow-y-auto flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-full"><CircularProgress /></div>
          ) : (
            <EmployeeList
              locations={locations}
              onEmployeeSelect={handleEmployeeSelect}
              selectedEmployeeId={selectedEmployeeId}
              isCollapsed={isSidebarCollapsed}
            />
          )}
        </div>
      </div>

      {/* Kolom Peta */}
      <div className={`flex-grow relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        <LiveMap
          locations={locations}
          selectedEmployeeId={selectedEmployeeId}
        />
        
        {/* --- [PERBAIKAN DI SINI] --- */}
        <IconButton
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="!absolute !bottom-4 !right-4 bg-white hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 z-[1000] shadow-md"
          title={isFullscreen ? 'Keluar Fullscreen' : 'Mode Fullscreen'}
        >
          {isFullscreen ? <BiExitFullscreen size={20} /> : <BiFullscreen size={20} />}
        </IconButton>
        
        {/* Panel Floating untuk mode fullscreen */}
        {isFullscreen && (
          <div 
            className={`
              absolute top-4 left-4 z-[1000] h-auto max-h-[85vh]
              bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl 
              flex flex-col transition-all duration-300 ease-in-out
              w-72
            `}
          >
            <button
              onClick={() => setIsFloatingListOpen(!isFloatingListOpen)}
              className="flex items-center justify-between w-full p-4 text-left border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 rounded-t-xl"
            >
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 m-0">
                Daftar Karyawan
              </h2>
              <IconButton size="small" className="bg-gray-200 dark:bg-gray-600 dark:text-gray-200">
                {isFloatingListOpen ? <FaChevronUp /> : <FaChevronDown />}
              </IconButton>
            </button>
            
            <div 
              className={`
                transition-all duration-300 ease-in-out overflow-hidden
                ${isFloatingListOpen ? 'max-h-[75vh]' : 'max-h-0'}
              `}
            >
              <div className="overflow-y-auto p-4">
                {loading ? (
                  <div className="flex justify-center items-center p-8"><CircularProgress /></div>
                ) : (
                  <EmployeeList
                    locations={locations}
                    onEmployeeSelect={handleEmployeeSelect}
                    selectedEmployeeId={selectedEmployeeId}
                    isCollapsed={false}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;