import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/main.css'; // Import CSS

const Main = () => {
    const navigate = useNavigate();

    return (
        <div className="main-container">
            <h1 className="title">Patient Management System</h1>
            <div className="button-container">
                <button className="nav-button" onClick={() => navigate('/upload')}>
                    Upload Patient Data
                </button>
                <button className="nav-button" onClick={() => navigate('/patients')}>
                    View Patient List
                </button>
            </div>
        </div>
    );
};

export default Main;