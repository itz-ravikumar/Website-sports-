/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Menu,
  X,
  ChevronRight,
  Download
} from 'lucide-react';


export default function App() {
  const [records, setRecords] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [studentStatusRoll, setStudentStatusRoll] = useState('');
  const [showStatusResult, setShowStatusResult] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [returnTargetId, setReturnTargetId] = useState(null);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    branch: 'CSE',
    program: 'B.Tech',
    year: '1st Year',
    itemName: '',
    category: 'Outdoor',
    issueDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: ''
  });

  const [inventoryFormData, setInventoryFormData] = useState({
    name: '',
    totalQuantity: 0,
    condition: 'Good'
  });

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const [requestFormData, setRequestFormData] = useState({
    studentName: '',
    rollNumber: '',
    branch: 'CSE',
    program: 'B.Tech',
    year: '1st Year',
    itemName: ''
  });

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, recRes, reqRes] = await Promise.all([
          fetch('/api/inventory'),
          fetch('/api/records'),
          fetch('/api/requests')
        ]);
        
        if (invRes.ok) setInventory(await invRes.json());
        if (recRes.ok) setRecords(await recRes.json());
        if (reqRes.ok) setRequests(await reqRes.json());
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();

    const savedAdmin = localStorage.getItem('citk_is_admin');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
    }

    // Check for #admin hash to open login modal
    if (window.location.hash === '#admin') {
      setShowLogin(true);
    }

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Remove localStorage sync effects

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      
      const data = await response.json();
      if (data.success) {
        setIsAdmin(true);
        localStorage.setItem('citk_is_admin', 'true');
        setShowLogin(false);
        setLoginError('');
        setLoginForm({ username: '', password: '' });
      } else {
        setLoginError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again later.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('citk_is_admin');
    setCurrentPage('home');
  };

  const navigateToSection = (sectionId) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Roll number validation for CITK (12 digits)
    const rollRegex = /^\d{12}$/;
    if (!rollRegex.test(formData.rollNumber)) {
      alert("Invalid Roll Number! CITK Roll Numbers must be 12 digits (e.g., 202401021002).");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const isOverdue = today > formData.expectedReturnDate;
    
    const newRecord = {
      ...formData,
      status: isOverdue ? 'Overdue' : 'Active'
    };

    try {
      const response = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
      
      if (response.ok) {
        const savedRecord = await response.json();
        setRecords(prev => [savedRecord, ...prev]);
        setFormData({
          studentName: '',
          rollNumber: '',
          branch: 'CSE',
          program: 'B.Tech',
          year: '1st Year',
          itemName: '',
          category: 'Outdoor',
          issueDate: new Date().toISOString().split('T')[0],
          expectedReturnDate: ''
        });
        document.getElementById('tracking-system')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      alert("Failed to save record.");
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    // Validation
    if (!inventoryFormData.name.trim()) {
      alert("Item Name cannot be empty.");
      return;
    }
    if (inventoryFormData.totalQuantity <= 0 || !Number.isInteger(inventoryFormData.totalQuantity)) {
      alert("Total Quantity must be a positive integer.");
      return;
    }

    const newItem = {
      name: inventoryFormData.name,
      totalQuantity: inventoryFormData.totalQuantity,
      availableQuantity: inventoryFormData.totalQuantity,
      condition: inventoryFormData.condition
    };

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      
      if (response.ok) {
        const savedItem = await response.json();
        setInventory(prev => [savedItem, ...prev]);
        setInventoryFormData({
          name: '',
          totalQuantity: 0,
          condition: 'Good'
        });
      }
    } catch (error) {
      alert("Failed to add inventory item.");
    }
  };

  const deleteInventoryItem = async (id) => {
    if (!isAdmin) return;
    try {
      const response = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setInventory(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      alert("Failed to delete item.");
    }
  };

  const markAsReturned = async (id) => {
    if (!isAdmin) {
      alert("Unauthorized: Only admin can perform this action.");
      return;
    }
    try {
      const response = await fetch(`/api/records/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Returned' })
      });
      
      if (response.ok) {
        setRecords(prev => prev.map(rec => 
          rec.id === id ? { ...rec, status: 'Returned' } : rec
        ));
        setShowReturnConfirm(false);
        setReturnTargetId(null);
      }
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!requestFormData.studentName || !requestFormData.rollNumber || !requestFormData.itemName) {
      alert('Please fill in all required fields.');
      return;
    }

    const newRequest = {
      ...requestFormData,
      requestDate: new Date().toISOString().split('T')[0]
    };

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest)
      });
      
      if (response.ok) {
        const savedRequest = await response.json();
        setRequests(prev => [savedRequest, ...prev]);
        setRequestFormData({
          studentName: '',
          rollNumber: '',
          branch: 'CSE',
          program: 'B.Tech',
          year: '1st Year',
          itemName: ''
        });
        alert('Request submitted successfully! Please wait for admin approval.');
      }
    } catch (error) {
      alert("Failed to submit request.");
    }
  };

  const approveRequest = async (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const item = inventory.find(i => i.name === request.itemName);
    if (!item) {
      alert('Item not found in inventory.');
      return;
    }
    
    if (item.availableQuantity <= 0) {
      alert('Item not available in stock.');
      return;
    }

    try {
      // Approve request
      const approveRes = await fetch(`/api/requests/${requestId}/approve`, { method: 'PUT' });
      if (!approveRes.ok) throw new Error("Failed to approve request");

      // Create record
      const newRecord = {
        studentName: request.studentName,
        rollNumber: request.rollNumber,
        branch: request.branch,
        program: request.program,
        year: request.year,
        itemName: request.itemName,
        category: 'Outdoor', // Default
        issueDate: new Date().toISOString().split('T')[0],
        expectedReturnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days default
        status: 'Active'
      };

      const recordRes = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord)
      });
      
      if (recordRes.ok) {
        const savedRecord = await recordRes.json();
        setRecords(prev => [savedRecord, ...prev]);
        
        // Update inventory locally (or fetch again)
        const updatedInvRes = await fetch(`/api/inventory/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ availableQuantity: item.availableQuantity - 1 })
        });

        if (updatedInvRes.ok) {
          setInventory(prev => prev.map(i => 
            i.id === item.id ? { ...i, availableQuantity: i.availableQuantity - 1 } : i
          ));
        }

        // Update request status locally
        setRequests(prev => prev.map(r => 
          r.id === requestId ? { ...r, status: 'Approved' } : r
        ));
        
        alert('Request approved and item issued.');
      }
    } catch (error) {
      alert("Failed to process approval.");
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const response = await fetch(`/api/requests/${requestId}/reject`, { method: 'PUT' });
      if (response.ok) {
        setRequests(prev => prev.map(r => 
          r.id === requestId ? { ...r, status: 'Rejected' } : r
        ));
      }
    } catch (error) {
      alert("Failed to reject request.");
    }
  };

  const exportRecordsCSV = () => {
    const headers = ['Roll Number', 'Student Name', 'Branch', 'Program', 'Year', 'Item Name', 'Issue Date', 'Expected Return', 'Status'];
    const data = records.map(r => [
      r.rollNumber,
      r.studentName,
      r.branch,
      r.program,
      r.year,
      r.itemName,
      r.issueDate,
      r.expectedReturnDate,
      r.status
    ]);
    downloadCSV(headers, data, 'CITK_Sports_Issue_Records');
  };

  const exportInventoryCSV = () => {
    const headers = ['Item Name', 'Total Quantity', 'Available Quantity', 'Condition'];
    const data = inventory.map(i => [
      i.name,
      i.totalQuantity,
      i.availableQuantity,
      i.condition
    ]);
    downloadCSV(headers, data, 'CITK_Sports_Inventory');
  };

  const downloadCSV = (headers, data, filename) => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processedRecords = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return records.map(rec => {
      if (rec.status !== 'Returned') {
        return { ...rec, status: today > rec.expectedReturnDate ? 'Overdue' : 'Active' };
      }
      return rec;
    });
  }, [records]);

  const analytics = useMemo(() => {
    const activeLoans = processedRecords.filter(r => r.status === 'Active' || r.status === 'Overdue').length;
    const overdueCount = processedRecords.filter(r => r.status === 'Overdue').length;
    const lowStockCount = inventory.filter(i => i.availableQuantity < 2).length;
    
    const itemCounts = {};
    records.forEach(r => {
      itemCounts[r.itemName] = (itemCounts[r.itemName] || 0) + 1;
    });
    let mostPopular = 'None';
    let max = 0;
    Object.entries(itemCounts).forEach(([name, count]) => {
      if (count > max) {
        max = count;
        mostPopular = name;
      }
    });

    return { activeLoans, overdueCount, lowStockCount, mostPopular };
  }, [processedRecords, inventory, records]);

  const filteredRecords = useMemo(() => {
    return processedRecords.filter(rec => 
      rec.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [processedRecords, searchQuery]);

  const studentRecords = useMemo(() => {
    if (!studentStatusRoll) return [];
    const studentRecs = processedRecords.filter(r => r.rollNumber === studentStatusRoll).map(r => ({ ...r, type: 'record' }));
    const studentReqs = requests.filter(r => r.rollNumber === studentStatusRoll).map(r => ({ ...r, type: 'request' }));
    return [...studentRecs, ...studentReqs];
  }, [processedRecords, requests, studentStatusRoll]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1) TOP HEADER BAR */}
      <header className="citk-header text-white py-4 px-4 md:px-8 border-b-4 border-yellow-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <img 
            src="https://www.cit.ac.in/wp-content/uploads/2020/09/cit-logo.png" 
            alt="CITK Logo" 
            className="h-20 w-auto bg-white p-1 rounded-sm"
            referrerPolicy="no-referrer"
          />
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl tracking-wide">CENTRAL INSTITUTE OF TECHNOLOGY KOKRAJHAR</h1>
            <p className="text-sm md:text-base opacity-90 font-normal italic">
              Deemed to be University under Ministry of Education, Government of India
            </p>
            <p className="text-xs md:text-sm mt-1 opacity-80 flex items-center justify-center md:justify-start gap-1">
              <MapPin size={12} /> Balagaon, Kokrajhar, Bodoland Territorial Region (BTR), Assam – 783370, India
            </p>
          </div>
        </div>
      </header>

      {/* 2) NAVIGATION BAR */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage('home')}
                className="font-black text-xl text-[#4a9c64] tracking-tighter flex items-center gap-1"
              >
                CITK <span className="text-gray-400 font-light">SPORTS</span>
              </button>
            </div>

            <div className="hidden lg:flex items-center space-x-1">
              <button 
                onClick={() => setCurrentPage('home')}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all ${currentPage === 'home' ? 'text-[#4a9c64] border-b-2 border-[#4a9c64]' : 'text-gray-500 hover:text-[#4a9c64]'}`}
              >
                Home
              </button>
              <button 
                onClick={() => navigateToSection('about-citk')}
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#4a9c64] transition-all"
              >
                About
              </button>
              <button 
                onClick={() => navigateToSection('sports-facilities')}
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#4a9c64] transition-all"
              >
                Facilities
              </button>
              <button 
                onClick={() => navigateToSection('student-status')}
                className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#4a9c64] transition-all"
              >
                Status
              </button>
              {!isAdmin && (
                <button 
                  onClick={() => navigateToSection('student-request')}
                  className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-[#4a9c64] transition-all"
                >
                  Request
                </button>
              )}
              <button 
                onClick={() => setCurrentPage('inventory')}
                className={`px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all ${currentPage === 'inventory' ? 'text-[#4a9c64] border-b-2 border-[#4a9c64]' : 'text-gray-500 hover:text-[#4a9c64]'}`}
              >
                Inventory
              </button>

              <div className="h-4 w-px bg-gray-300 mx-2"></div>

              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setCurrentPage('home'); setTimeout(() => document.getElementById('sports-issue-system')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                    className="bg-[#4a9c64] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-[#3a7d50] transition-all rounded-sm shadow-sm"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 text-xs font-bold uppercase tracking-widest p-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setShowLogin(true)}
                  className="border-2 border-[#4a9c64] text-[#4a9c64] px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-[#4a9c64] hover:text-white transition-all rounded-sm"
                >
                  Admin Login
                </button>
              )}
            </div>

            <button 
              className="lg:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-300 py-4 px-4 space-y-1 shadow-xl">
            <button 
              className="block w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => { setCurrentPage('home'); setIsMenuOpen(false); }}
            >
              HOME
            </button>
            <button 
              className="block w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => navigateToSection('about-citk')}
            >
              ABOUT CITK
            </button>
            <button 
              className="block w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => navigateToSection('sports-facilities')}
            >
              FACILITIES
            </button>
            <button 
              className="block w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => navigateToSection('student-status')}
            >
              CHECK STATUS
            </button>
            {!isAdmin && (
              <button 
                className="block w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-md"
                onClick={() => navigateToSection('student-request')}
              >
                REQUEST ITEM
              </button>
            )}
            <button 
              className="block w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => { setCurrentPage('inventory'); setIsMenuOpen(false); }}
            >
              INVENTORY
            </button>
            <div className="h-px bg-gray-200 my-2"></div>
            {isAdmin ? (
              <>
                <button 
                  className="block w-full text-left px-4 py-3 text-sm font-bold text-[#4a9c64] hover:bg-gray-50 rounded-md"
                  onClick={() => { setCurrentPage('home'); setIsMenuOpen(false); setTimeout(() => document.getElementById('sports-issue-system')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                >
                  ADMIN DASHBOARD
                </button>
                <button 
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="block w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-gray-50 rounded-md"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <button 
                onClick={() => { setShowLogin(true); setIsMenuOpen(false); }}
                className="block w-full text-left px-4 py-3 text-sm font-bold text-[#4a9c64] hover:bg-gray-50 rounded-md"
              >
                ADMIN LOGIN
              </button>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {currentPage === 'home' ? (
          <>
            {/* 3) HERO SECTION */}
        <section id="home" className="relative h-[450px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
              alt="CITK Campus Building" 
              className="w-full h-full object-cover opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <h2 className="text-3xl md:text-5xl text-white drop-shadow-lg mb-4 uppercase tracking-tight">
              CITK Sports Item Issue & Return Management System
            </h2>
            <p className="text-xl text-white/90 mb-8 font-normal italic">
              Digitizing Campus Sports Equipment Management for Enhanced Efficiency
            </p>

          </div>
        </section>

        {/* 4) ABOUT SECTION */}
        <section id="about-citk" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2">
                <div className="inline-block px-3 py-1 bg-[#4a9c64]/10 text-[#4a9c64] text-[10px] font-bold uppercase tracking-widest mb-4 rounded-full">Institutional Profile</div>
                <h3 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tighter leading-none">About <span className="text-[#4a9c64]">CITK</span></h3>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    Central Institute of Technology Kokrajhar (CITK) is a Deemed to be University under the Ministry of Education, Government of India. Established in 2006, it is situated in the Bodoland Territorial Region (BTR) of Assam.
                  </p>
                  <p>
                    CITK is mandated to provide technical and vocational education such as B.Tech, M.Tech, PhD, and Diploma programs in various disciplines. The institute focuses on the overall development of students, blending academic excellence with physical well-being.
                  </p>
                  <p>
                    The campus boasts state-of-the-art facilities, including modern laboratories, a central library, and extensive sports infrastructure that fosters a vibrant sports culture among the student community.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 -z-10"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#4a9c64] -z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
                  className="rounded-sm shadow-2xl w-full h-[400px] object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  alt="CITK Main Building" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5) SPORTS FACILITIES SECTION */}
        <section id="sports-facilities" className="py-20 px-4 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-[#4a9c64]/10 text-[#4a9c64] text-[10px] font-bold uppercase tracking-widest mb-4 rounded-full">Campus Infrastructure</div>
              <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Sports <span className="text-[#4a9c64]">Facilities</span></h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'Football Ground', desc: 'Standard size natural grass field for football matches and practice.' },
                { name: 'Cricket Ground', desc: 'Well-maintained pitch with practice nets for cricket enthusiasts.' },
                { name: 'Volleyball Court', desc: 'Outdoor courts with professional lighting for evening games.' },
                { name: 'Badminton Court', desc: 'Indoor synthetic courts located in the sports complex.' },
                { name: 'Indoor Games Hall', desc: 'Facilities for Table Tennis, Chess, and Carrom.' },
                { name: 'Gymnasium', desc: 'Modern fitness center equipped with strength and cardio machines.' }
              ].map((facility) => (
                <div key={facility.name} className="bg-white border border-gray-200 p-8 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center mb-6 text-[#4a9c64] group-hover:bg-[#4a9c64] group-hover:text-white transition-colors">
                    <Clock size={28} />
                  </div>
                  <h4 className="text-xl font-black mb-3 text-gray-900 uppercase tracking-tight">{facility.name}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{facility.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STUDENT REQUEST SYSTEM SECTION */}
        {!isAdmin && (
          <section id="student-request" className="py-16 px-4 bg-white border-b border-gray-200">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h3 className="text-2xl text-[#4a9c64] mb-4 uppercase tracking-widest">Request Sports Equipment</h3>
                <p className="text-gray-600 italic">Submit a request for an item. Admin will review and approve your request.</p>
              </div>
              
              <form onSubmit={handleRequestSubmit} className="bg-gray-50 border border-gray-200 p-8 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-600">Full Name</label>
                    <input 
                      type="text" required
                      value={requestFormData.studentName}
                      onChange={(e) => setRequestFormData(prev => ({ ...prev, studentName: e.target.value }))}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-600">Roll Number</label>
                    <input 
                      type="text" required
                      value={requestFormData.rollNumber}
                      onChange={(e) => setRequestFormData(prev => ({ ...prev, rollNumber: e.target.value }))}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                      placeholder="12-digit Roll No"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-600">Branch</label>
                    <select 
                      value={requestFormData.branch}
                      onChange={(e) => setRequestFormData(prev => ({ ...prev, branch: e.target.value }))}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                    >
                      {['CSE', 'ECE', 'IE', 'CE', 'ME', 'FET', 'MCD', 'HSS', 'Basic Science'].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-600">Program</label>
                    <select 
                      value={requestFormData.program}
                      onChange={(e) => setRequestFormData(prev => ({ ...prev, program: e.target.value }))}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                    >
                      {['B.Tech', 'M.Tech', 'PhD', 'Diploma', 'B.Des', 'M.Des'].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-600">Year</label>
                    <select 
                      value={requestFormData.year}
                      onChange={(e) => setRequestFormData(prev => ({ ...prev, year: e.target.value }))}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                    >
                      {['1st Year', '2nd Year', '3rd Year', '4th Year'].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 uppercase text-gray-600">Select Item</label>
                  <select 
                    required
                    value={requestFormData.itemName}
                    onChange={(e) => setRequestFormData(prev => ({ ...prev, itemName: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                  >
                    <option value="">-- Choose an item --</option>
                    {inventory.filter(i => i.availableQuantity > 0).map(item => (
                      <option key={item.id} value={item.name}>{item.name} ({item.availableQuantity} available)</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#4a9c64] text-white py-3 font-bold uppercase tracking-widest hover:bg-[#3a7d50] transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <PlusCircle size={20} /> Submit Request
                </button>
              </form>
            </div>
          </section>
        )}

        {/* STUDENT STATUS CHECK SECTION */}
        <section id="student-status" className="py-20 px-4 bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-3 py-1 bg-[#4a9c64]/10 text-[#4a9c64] text-[10px] font-bold uppercase tracking-widest mb-4 rounded-full">Self Service</div>
            <h3 className="text-4xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Check Your <span className="text-[#4a9c64]">Status</span></h3>
            <p className="text-gray-500 mb-10">Enter your 12-digit Roll Number to see your currently issued items and pending requests.</p>
            
            <div className="flex flex-col md:flex-row gap-0 max-w-lg mx-auto shadow-2xl">
              <input 
                type="text" 
                placeholder="e.g. 202401021002"
                className="flex-grow border-2 border-gray-200 px-6 py-4 text-sm focus:outline-none focus:border-[#4a9c64] uppercase font-bold tracking-widest transition-all"
                value={studentStatusRoll}
                onChange={(e) => setStudentStatusRoll(e.target.value)}
              />
              <button 
                onClick={() => setShowStatusResult(true)}
                className="bg-[#4a9c64] text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-[#3a7d50] transition-all shadow-md flex items-center justify-center gap-2"
              >
                Search <Search size={18} />
              </button>
            </div>

            {showStatusResult && (
              <div className="mt-12 text-left bg-gray-50 border border-gray-200 p-6 rounded-sm shadow-inner">
                <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-2">
                  <h4 className="font-bold text-[#4a9c64] uppercase tracking-wider">Status for: {studentStatusRoll}</h4>
                  <button onClick={() => setShowStatusResult(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                
                {studentRecords.length > 0 ? (
                  <div className="space-y-4">
                    {studentRecords.map((item) => (
                      <div key={item.id} className={`bg-white p-4 border-l-4 ${item.type === 'record' ? 'border-[#4a9c64]' : 'border-yellow-500'} shadow-sm flex justify-between items-center`}>
                        <div>
                          <p className="font-bold text-gray-800">{item.itemName} {item.type === 'request' && <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1 rounded ml-1 uppercase">Request</span>}</p>
                          <p className="text-xs text-gray-500 uppercase">
                            {item.type === 'record' 
                              ? `Issued: ${item.issueDate} | Return by: ${item.expectedReturnDate}`
                              : `Requested on: ${item.requestDate}`
                            }
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          item.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                          item.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                          item.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          item.status === 'Rejected' ? 'bg-gray-100 text-gray-500' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500 italic">No records found for this roll number.</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ISSUE & TRACKING SYSTEM SECTION */}
        <section id="sports-issue-system" className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {isAdmin ? (
              <div className="space-y-12 mb-12">
                {/* ADMIN SUB-NAV */}
                <div className="sticky top-14 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 -mx-4 px-4 py-2 flex items-center gap-4 overflow-x-auto no-scrollbar shadow-sm">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Admin Dashboard</span>
                  <button onClick={() => navigateToSection('admin-analytics')} className="text-xs font-bold text-gray-600 hover:text-[#4a9c64] whitespace-nowrap">Analytics</button>
                  <button onClick={() => navigateToSection('pending-requests')} className="text-xs font-bold text-gray-600 hover:text-[#4a9c64] whitespace-nowrap">Requests</button>
                  <button onClick={() => navigateToSection('issue-form')} className="text-xs font-bold text-gray-600 hover:text-[#4a9c64] whitespace-nowrap">Issue Item</button>
                  <button onClick={() => navigateToSection('issue-records')} className="text-xs font-bold text-gray-600 hover:text-[#4a9c64] whitespace-nowrap">Records</button>
                </div>

                {/* ADMIN ANALYTICS DASHBOARD */}
                <div id="admin-analytics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Loans</p>
                    <p className="text-4xl font-black text-blue-600 tracking-tighter">{analytics.activeLoans}</p>
                  </div>
                  <div className="bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Overdue Items</p>
                    <p className="text-4xl font-black text-red-600 tracking-tighter">{analytics.overdueCount}</p>
                  </div>
                  <div className="bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Low Stock</p>
                    <p className="text-4xl font-black text-orange-500 tracking-tighter">{analytics.lowStockCount}</p>
                  </div>
                  <div className="bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Most Popular</p>
                    <p className="text-xl font-black text-[#4a9c64] truncate tracking-tight">{analytics.mostPopular}</p>
                  </div>
                </div>

                {/* RECENT ACTIVITY SECTION */}
                <div className="bg-white border border-gray-200 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-800 uppercase tracking-tight mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-[#4a9c64]" /> Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {records.slice(0, 5).map((rec) => (
                      <div key={rec.id} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-bold text-gray-700">{rec.studentName} ({rec.rollNumber})</p>
                          <p className="text-xs text-gray-500">Issued: {rec.itemName}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                            rec.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                            rec.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {rec.status}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-1">{rec.issueDate}</p>
                        </div>
                      </div>
                    ))}
                    {records.length === 0 && (
                      <p className="text-sm text-gray-500 italic text-center">No recent activity found.</p>
                    )}
                  </div>
                </div>

                {/* PENDING REQUESTS SECTION */}
                <div id="pending-requests" className="bg-white border border-gray-200 shadow-xl overflow-hidden">
                  <div className="p-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                      <AlertCircle size={24} className="text-orange-500" /> Pending <span className="text-[#4a9c64]">Requests</span>
                    </h3>
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">{requests.filter(r => r.status === 'Pending').length} NEW</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full citk-table">
                      <thead>
                        <tr>
                          <th>Roll No</th>
                          <th>Student Name</th>
                          <th>Item Requested</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.filter(r => r.status === 'Pending').length > 0 ? (
                          requests.filter(r => r.status === 'Pending').map((req) => (
                            <tr key={req.id}>
                              <td className="font-bold">{req.rollNumber}</td>
                              <td>{req.studentName}</td>
                              <td>{req.itemName}</td>
                              <td>{req.requestDate}</td>
                              <td>
                                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                                  {req.status}
                                </span>
                              </td>
                              <td>
                                <div className="flex gap-4">
                                  <button 
                                    onClick={() => approveRequest(req.id)}
                                    className="text-green-600 hover:text-green-800 font-bold text-xs uppercase underline flex items-center gap-1"
                                  >
                                    <CheckCircle size={14} /> Approve
                                  </button>
                                  <button 
                                    onClick={() => rejectRequest(req.id)}
                                    className="text-red-600 hover:text-red-800 font-bold text-xs uppercase underline flex items-center gap-1"
                                  >
                                    <X size={14} /> Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500 italic">No pending requests.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div id="issue-form" className="bg-gray-50 border border-gray-200 p-8 shadow-sm">
                  <h3 className="text-2xl text-[#4a9c64] mb-8 uppercase border-b border-gray-300 pb-2 flex items-center gap-2">
                    <PlusCircle size={24} /> Issue Sports Item
                  </h3>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Student Info */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Student Information</h4>
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase">Student Name</label>
                      <input 
                        type="text" name="studentName" required 
                        value={formData.studentName} onChange={handleInputChange}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]" 
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase">Roll Number</label>
                      <input 
                        type="text" name="rollNumber" required 
                        value={formData.rollNumber} onChange={handleInputChange}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]" 
                        placeholder="e.g. 202401021002"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Academic Details</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold mb-1 uppercase">Branch</label>
                        <select 
                          name="branch" value={formData.branch} onChange={handleInputChange}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                        >
                          <option>CSE</option>
                          <option>ECE</option>
                          <option>Civil</option>
                          <option>Mechanical</option>
                          <option>IT</option>
                          <option>FET</option>
                          <option>IE</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1 uppercase">Program</label>
                        <select 
                          name="program" value={formData.program} onChange={handleInputChange}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                        >
                          <option>B.Tech</option>
                          <option>Diploma</option>
                          <option>M.Tech</option>
                          <option>PhD</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase">Year</label>
                      <select 
                        name="year" value={formData.year} onChange={handleInputChange}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                      >
                        <option>1st Year</option>
                        <option>2nd Year</option>
                        <option>3rd Year</option>
                        <option>4th Year</option>
                      </select>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Sports Item Details</h4>
                    <div>
                      <label className="block text-xs font-bold mb-1 uppercase">Item Name</label>
                      <input 
                        type="text" name="itemName" required 
                        value={formData.itemName} onChange={handleInputChange}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]" 
                        placeholder="e.g. Football, Bat"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold mb-1 uppercase">Issue Date</label>
                        <input 
                          type="date" name="issueDate" required 
                          value={formData.issueDate} onChange={handleInputChange}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1 uppercase">Return Date</label>
                        <input 
                          type="date" name="expectedReturnDate" required 
                          value={formData.expectedReturnDate} onChange={handleInputChange}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                        />
                      </div>
                    </div>
                    <div className="pt-2">
                      <button 
                        type="submit"
                        className="w-full bg-[#4a9c64] text-white py-2 font-bold uppercase tracking-widest hover:bg-[#3a7d50] transition-colors shadow-md"
                      >
                        Issue Item
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-12">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-yellow-600" size={24} />
                  <div>
                    <p className="text-sm font-bold text-yellow-800 uppercase">Admin Access Only</p>
                    <p className="text-xs text-yellow-700">The item issue form is restricted to the Sports Incharge. Please login to issue new items.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tracking Table */}
            <div id="issue-records" className="bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg text-[#4a9c64] uppercase font-bold flex items-center gap-2">
                    <Clock size={20} /> Issue & Tracking Records
                  </h3>
                  {isAdmin && (
                    <button 
                      onClick={exportRecordsCSV}
                      className="flex items-center gap-1 text-[10px] font-bold text-[#4a9c64] border border-[#4a9c64] px-2 py-1 uppercase hover:bg-[#4a9c64] hover:text-white transition-all"
                    >
                      <Download size={12} /> Export CSV
                    </button>
                  )}
                </div>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search Roll No / Name..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 text-sm focus:outline-none focus:border-[#4a9c64]"
                  />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full citk-table">
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Student Name</th>
                      <th>Branch/Prog</th>
                      <th>Item Name</th>
                      <th>Issue Date</th>
                      <th>Expected Return</th>
                      <th>Status</th>
                      {isAdmin && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((rec) => (
                        <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                          <td className="font-bold text-gray-700">{rec.rollNumber}</td>
                          <td>{rec.studentName}</td>
                          <td>{rec.branch} / {rec.program}</td>
                          <td>{rec.itemName}</td>
                          <td>{rec.issueDate}</td>
                          <td>{rec.expectedReturnDate}</td>
                          <td>
                            <span className={
                              rec.status === 'Active' ? 'status-active' : 
                              rec.status === 'Overdue' ? 'status-overdue' : 
                              'status-returned'
                            }>
                              {rec.status}
                            </span>
                          </td>
                          {isAdmin && (
                            <td>
                              {rec.status !== 'Returned' && (
                                <button 
                                  onClick={() => {
                                    setReturnTargetId(rec.id);
                                    setShowReturnConfirm(true);
                                  }}
                                  className="text-[#4a9c64] hover:text-[#3a7d50] font-bold text-xs uppercase underline flex items-center gap-1"
                                >
                                  <CheckCircle size={14} /> Return
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-gray-500 italic">
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
                <span>Total Records: {filteredRecords.length}</span>
                <span className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Active</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Overdue</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-400 rounded-full"></div> Returned</span>
                </span>
              </div>
            </div>
          </div>
        </section>

          </>
        ) : (
          /* 7) INVENTORY MANAGEMENT SECTION */
          <section id="inventory-management" className="py-16 px-4 bg-gray-50 min-h-[60vh]">
            <div className="max-w-7xl mx-auto">
              <h3 className="text-2xl text-[#4a9c64] mb-10 uppercase border-b border-[#4a9c64] inline-block pb-1">
                {isAdmin ? 'Inventory Management' : 'Available Sports Equipment'}
              </h3>
              
              <div className={`grid grid-cols-1 ${isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
                {/* Add Item Form (Admin Only) */}
                {isAdmin && (
                  <div className="bg-white border border-gray-200 p-6 shadow-sm">
                    <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-6">Add New Equipment</h4>
                    <form onSubmit={handleInventorySubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold mb-1 uppercase">Item Name</label>
                        <input 
                          type="text" required
                          value={inventoryFormData.name}
                          onChange={(e) => setInventoryFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                          placeholder="e.g. Basketball"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1 uppercase">Total Quantity</label>
                        <input 
                          type="number" required min="1"
                          value={inventoryFormData.totalQuantity}
                          onChange={(e) => setInventoryFormData(prev => ({ ...prev, totalQuantity: parseInt(e.target.value) || 0 }))}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1 uppercase">Condition</label>
                        <select 
                          value={inventoryFormData.condition}
                          onChange={(e) => setInventoryFormData(prev => ({ ...prev, condition: e.target.value }))}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                        >
                          <option value="Good">Good</option>
                          <option value="Damaged">Damaged</option>
                          <option value="Needs Replacement">Needs Replacement</option>
                        </select>
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-[#4a9c64] text-white py-2 font-bold uppercase tracking-widest hover:bg-[#3a7d50] transition-colors shadow-md"
                      >
                        Add to Inventory
                      </button>
                    </form>
                  </div>
                )}

                {/* Inventory List */}
                <div className={`${isAdmin ? 'lg:col-span-2' : ''} bg-white border border-gray-200 shadow-sm overflow-hidden`}>
                  <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Current Stock</h4>
                    {isAdmin && (
                      <button 
                        onClick={exportInventoryCSV}
                        className="flex items-center gap-1 text-[10px] font-bold text-[#4a9c64] border border-[#4a9c64] px-2 py-1 uppercase hover:bg-[#4a9c64] hover:text-white transition-all"
                      >
                        <Download size={12} /> Export CSV
                      </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full citk-table">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Total</th>
                          <th>Available</th>
                          <th>Condition</th>
                          {isAdmin && <th>Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.length > 0 ? (
                          inventory.map((item) => (
                            <tr key={item.id}>
                              <td className="font-bold">{item.name}</td>
                              <td>{item.totalQuantity}</td>
                              <td>{item.availableQuantity}</td>
                              <td>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  item.condition === 'Good' ? 'bg-green-100 text-green-700' :
                                  item.condition === 'Damaged' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {item.condition}
                                </span>
                              </td>
                              {isAdmin && (
                                <td>
                                  <button 
                                    onClick={() => deleteInventoryItem(item.id)}
                                    className="text-red-600 hover:text-red-800 font-bold text-xs uppercase underline"
                                  >
                                    Remove
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={isAdmin ? 5 : 4} className="text-center py-8 text-gray-400 italic">No items in inventory.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#4a9c64] text-white py-12 px-4 border-t-4 border-yellow-500">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase border-b border-white/20 pb-2">Contact Us</h4>
            <ul className="space-y-4 text-sm opacity-90">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-1" />
                <span>Balagaon, Kokrajhar, Bodoland Territorial Region (BTR), Assam – 783370, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} />
                <span>+91-3661-277101 / 277279</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} />
                <span>sports@cit.ac.in</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase border-b border-white/20 pb-2">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-90">
              <li><a href="#" className="hover:underline">Official Website</a></li>
              <li><a href="#" className="hover:underline">Student Portal</a></li>
              <li><a href="#" className="hover:underline">Academic Calendar</a></li>
              <li><a href="#" className="hover:underline">Campus Map</a></li>
              <li><a href="#" className="hover:underline">Grievance Redressal</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase border-b border-white/20 pb-2">Institutional Status</h4>
            <p className="text-sm opacity-90 leading-relaxed mb-4">
              CIT Kokrajhar is a centrally funded technical institute under the Ministry of Education, Government of India. It is committed to excellence in technical education and research.
            </p>
            <div className="flex gap-4">
              <Globe size={20} className="opacity-70 hover:opacity-100 cursor-pointer" />
              <AlertCircle size={20} className="opacity-70 hover:opacity-100 cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-xs opacity-60">
          <p>© {new Date().getFullYear()} Central Institute of Technology Kokrajhar. All Rights Reserved.</p>
          <p className="mt-1">Designed & Maintained by CITK IT Services Cell.</p>
          {!isAdmin && (
            <button 
              onClick={() => setShowLogin(true)}
              className="mt-4 text-white/40 hover:text-white/100 transition-colors uppercase tracking-widest"
            >
              Admin Portal
            </button>
          )}
        </div>
      </footer>

      {/* ADMIN LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md shadow-2xl border-t-4 border-[#4a9c64]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Admin Login</h3>
                <button onClick={() => setShowLogin(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 text-xs text-red-700 font-bold">
                    {loginError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase text-gray-600">Username</label>
                  <input 
                    type="text" 
                    required
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                    placeholder="Enter admin username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1 uppercase text-gray-600">Password</label>
                  <input 
                    type="password" 
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                    placeholder="Enter admin password"
                  />
                </div>
                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full bg-[#4a9c64] text-white py-3 font-bold uppercase tracking-widest hover:bg-[#3a7d50] transition-colors shadow-md"
                  >
                    Login to Dashboard
                  </button>
                </div>
                <div className="text-center">
                  <button 
                    type="button"
                    onClick={() => { setShowLogin(false); setShowForgot(true); }}
                    className="text-[10px] text-[#4a9c64] font-bold uppercase hover:underline tracking-widest"
                  >
                    Forgot Password?
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest mt-4">
                  Authorized Access Only • CIT Kokrajhar
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* FORGOT PASSWORD MODAL */}
      {showForgot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md shadow-2xl border-t-4 border-[#4a9c64]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Reset Password</h3>
                <button onClick={() => { setShowForgot(false); setForgotSuccess(false); setForgotEmail(''); }} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              {!forgotSuccess ? (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setForgotSuccess(true);
                  }} 
                  className="space-y-4"
                >
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Enter your registered admin email address. We will send you a link to reset your password.
                  </p>
                  <div>
                    <label className="block text-xs font-bold mb-1 uppercase text-gray-600">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#4a9c64]"
                      placeholder="admin@cit.ac.in"
                    />
                  </div>
                  <div className="pt-2">
                    <button 
                      type="submit"
                      className="w-full bg-[#4a9c64] text-white py-3 font-bold uppercase tracking-widest hover:bg-[#3a7d50] transition-colors shadow-md"
                    >
                      Send Reset Link
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 text-[#4a9c64] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <p className="text-sm font-bold text-gray-800 mb-2">Success!</p>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    Password reset email sent successfully. Please check your inbox.
                  </p>
                  <button 
                    onClick={() => { setShowForgot(false); setForgotSuccess(false); setForgotEmail(''); setShowLogin(true); }}
                    className="text-xs font-bold text-[#4a9c64] uppercase hover:underline tracking-widest"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RETURN CONFIRMATION MODAL */}
      {showReturnConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm shadow-2xl border-t-4 border-[#4a9c64]">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4 text-yellow-600">
                <AlertCircle size={24} />
                <h3 className="text-lg font-bold uppercase tracking-tight">Confirm Return</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to mark this item as returned? This action will update the stock and record status.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setShowReturnConfirm(false);
                    setReturnTargetId(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-bold uppercase text-xs tracking-widest hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => returnTargetId && markAsReturned(returnTargetId)}
                  className="flex-1 px-4 py-2 bg-[#4a9c64] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#3a7d50] transition-colors shadow-md"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BACK TO TOP BUTTON */}
      {showBackToTop && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-[#4a9c64] text-white p-3 rounded-full shadow-2xl z-[60] hover:bg-[#3a7d50] transition-all transform hover:scale-110 flex items-center justify-center border-2 border-white/20"
          aria-label="Back to top"
        >
          <ChevronRight size={24} className="-rotate-90" />
        </button>
      )}
    </div>
  );
}
