import React, { useState, useEffect } from 'react';

const DepartmentStudentCount = () => {
    const [batchNo, setBatchNo] = useState('');
    const [batches, setBatches] = useState([]);
    const [center, setCenter] = useState('');
    const [centers, setCenters] = useState([]);
    const [allData, setAllData] = useState([]);
    const [aggregatedSubjects, setAggregatedSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
        fetchAllData();

        // Auto-refresh every 30 seconds
        const intervalId = setInterval(() => {
            fetchAllData();
        }, 30000); // 30,000 milliseconds = 30 seconds

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, [batchNo, center]);

    useEffect(() => {
        aggregateSubjects();
    }, [allData, center]);

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'https://www.shorthandonlineexam.in/track-students-on-department-code';
            
            console.log("Fetching data from URL:", url);
            const response = await fetch(url, { 
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();
            
            const distinctBatches = [...new Set(data.map(item => item.batchNo))];
            setBatches(prevBatches => {
                const newBatches = [...new Set([...prevBatches, ...distinctBatches])];
                return newBatches.sort();
            });
            const distinctCenters = [...new Set(data.map(item => item.center))];
            setCenters(prevCenters => {
                const newCenters = [...new Set([...prevCenters, ...distinctCenters])];
                return newCenters.sort();
            });

        } catch (error) {
            console.error("Error fetching data:", error);
            setError("No students found for provided filter parameters. Please check the parameters!");
        }
        setLoading(false);
    };

    const fetchAllData = async () => {
        setLoading(true);
        setError('');
        try {
            let url = `https://www.shorthandonlineexam.in/get-department-batch-student-count`
            if(batchNo || center){
                url += '?';
                if(batchNo) url += `batchNo=${batchNo}&`;
                if(center) url += `center=${center}&`;
                url = url.slice(0, -1);
            }
        
            const response = await fetch(url, { 
                method: 'GET',
                credentials: 'include'
            });
            const responseData = await response.json();
            
            if (responseData && responseData.results && Array.isArray(responseData.results)) {
                console.log(responseData)
                setAllData(responseData.results);
            } else {
                setError('Received unexpected data format from server');
            }
        } catch (error) {
            console.error('Error fetching all data:', error);
            setError(error.response?.data?.message || 'Failed to fetch all data');
        }
        setLoading(false);
    };

    const aggregateSubjects = () => {
        if (allData.length === 0) return;

        const subjectMap = new Map();

        allData.forEach(item => {
            if (item.subjects && Array.isArray(item.subjects)) {
                item.subjects.forEach(subject => {
                    const subjectId = subject.id.toString();
                    const count = parseInt(subject.count, 10) || 0;
                    const loggedIn = parseInt(subject.loggedIn, 10) || 0;
                    const completed = parseInt(subject.completed, 10) || 0;
                    
                    if (subjectMap.has(subjectId)) {
                        const existingSubject = subjectMap.get(subjectId);
                        existingSubject.count += count;
                        existingSubject.loggedIn += loggedIn;
                        existingSubject.completed += completed;
                    } else {
                        subjectMap.set(subjectId, { 
                            ...subject, 
                            count, 
                            loggedIn, 
                            completed 
                        });
                    }
                });
            }
        });

        const aggregatedSubjectsArray = Array.from(subjectMap.values());
        setAggregatedSubjects(aggregatedSubjectsArray);
    };

    // Calculate totals for the main table
    const calculateMainTableTotals = () => {
        return allData.reduce((totals, item) => {
            totals.totalStudents += parseInt(item.total_students, 10) || 0;
            totals.loggedInStudents += parseInt(item.logged_in_students, 10) || 0;
            totals.completedStudents += parseInt(item.completed_student, 10) || 0;
            return totals;
        }, { totalStudents: 0, loggedInStudents: 0, completedStudents: 0 });
    };

    // Calculate totals for the subjects table
    const calculateSubjectTotals = () => {
        const subjects = center ? (allData[0]?.subjects || []) : aggregatedSubjects;
        return subjects
            .filter(subject => subject.count > 0)
            .reduce((totals, subject) => {
                totals.count += parseInt(subject.count, 10) || 0;
                totals.loggedIn += parseInt(subject.loggedIn, 10) || 0;
                totals.completed += parseInt(subject.completed, 10) || 0;
                return totals;
            }, { count: 0, loggedIn: 0, completed: 0 });
    };

    // FIXED: Updated formatting functions to handle backend format correctly
    const formatDateTime = (timeString) => {
        if (!timeString) return '';
        // Backend sends time in HH:mm:ss format, convert to 12-hour format with AM/PM
        const [hours, minutes, seconds] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds));
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: true 
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        // Backend sends date in DD-MM-YYYY format, keep it as is
        return dateString;
    };

    const mainTableTotals = calculateMainTableTotals();
    const subjectTotals = calculateSubjectTotals();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation Bar */}
            <div className="bg-blue-600 text-white p-4 shadow-md">
                <h1 className="text-xl font-bold">Department Navigation</h1>
            </div>

            <div className="container mx-auto p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Current Student Details</h2>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="batchNo" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Batch Number:
                            </label>
                            <select 
                                id="batchNo" 
                                value={batchNo} 
                                onChange={(e) => setBatchNo(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Batches</option>
                                {batches.map((batch, index) => (
                                    <option key={index} value={batch}>{batch}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="center" className="block text-sm font-medium text-gray-700 mb-2">
                                Select Center Number:
                            </label>
                            <select 
                                id="center" 
                                value={center} 
                                onChange={(e) => setCenter(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Centers</option>
                                {centers.map((centerOption, index) => (
                                    <option key={index} value={centerOption}>{centerOption}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {loading && <p className="text-center text-blue-600 text-lg py-4">Loading...</p>}
                {error && <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</p>}

                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <div className="bg-gray-50 px-6 py-4 border-b">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {batchNo ? `Batch ${batchNo}` : 'All Batches'} {center ? `- Center ${center}` : ''}
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Students</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logged In Students</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Students</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allData.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.center}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.batchNo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.total_students || 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.logged_in_students || 0}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.completed_student || 0}</td>
                                    </tr>
                                ))}
                                {/* Total row for main table */}
                                {allData.length > 0 && (
                                    <tr className="bg-blue-50 border-t-2 border-blue-200 font-semibold">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900" colSpan="2">TOTAL</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{mainTableTotals.totalStudents}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{mainTableTotals.loggedInStudents}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-900">{mainTableTotals.completedStudents}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {allData.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b">
                            <h4 className="text-lg font-semibold text-gray-800">Subjects:</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logged In</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {(center ? allData[0]?.subjects || [] : aggregatedSubjects)
                                        .filter(subject => subject.count > 0)
                                        .map((subject, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.count}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.loggedIn}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.completed}</td>
                                        </tr>
                                    ))}
                                    {/* Total row for subjects table */}
                                    {((center ? allData[0]?.subjects || [] : aggregatedSubjects).filter(subject => subject.count > 0).length > 0) && (
                                        <tr className="bg-green-50 border-t-2 border-green-200 font-semibold">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900" colSpan="2">TOTAL</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{subjectTotals.count}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{subjectTotals.loggedIn}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-900">{subjectTotals.completed}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartmentStudentCount;