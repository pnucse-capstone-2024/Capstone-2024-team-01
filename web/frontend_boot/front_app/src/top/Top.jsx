import "../css/top.css";
import React, { useState, useEffect, useRef } from 'react';
import F_Age from "./f_Age";
import F_Sex from "./f_Sex";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Top = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSexDropdownOpen, setIsSexDropdownOpen] = useState(false); 
    const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
  
    const toggleDropdown = (event) => {
      setIsOpen(!isOpen);
      if (isSexDropdownOpen) setIsSexDropdownOpen(false);
      if (isAgeDropdownOpen) setIsAgeDropdownOpen(false);
    };
  
    const toggleAgeDropdown = () => {
        setIsAgeDropdownOpen(!isAgeDropdownOpen)
        if (isSexDropdownOpen) setIsSexDropdownOpen(false);
    }

    const toggleSexDropdown = () => {
        setIsSexDropdownOpen(!isSexDropdownOpen)
        if (isAgeDropdownOpen) setIsAgeDropdownOpen(false);
    }


    const handleClickOutside = () => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && isOpen) {
        toggleDropdown()
      }
    };

    
  
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/upload'); // '/upload' 페이지로 이동
    };



    return (
        <>
            <div className="sb-nav-fixed">
                <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                    <Link to="/" className="navbar-brand ps-3">Brain Tumour</Link>
                    
                    <div className="dropdown dropdown-position" ref={dropdownRef}>
                        {/*
                        <button onClick={toggleDropdown} className="custom-dropdown-btn dropdown-toggle">
                            Classification
                        </button>
                        {isOpen && (
                            <ul className="dropdown-menu dropend" style={{ display: 'block' }}>
                                <li className="dropdown-item dropdown-toggle" onClick={toggleSexDropdown}>
                                    <a className="width-100 text-black">Sex </a>
                                </li>
                                    {isSexDropdownOpen &&
                                        (<ul className="dropdown-menu sright" style={{ display: 'block' }}>
                                            <F_Sex />
                                        </ul>
                                        )
                                    }
                                <li className="dropdown-item dropdown-toggle" onClick={toggleAgeDropdown}>
                                    <a className="width-100 text-black"> Age </a>
                                </li> 
                                    {isAgeDropdownOpen &&
                                        (<ul className="dropdown-menu ageright" style={{ display: 'block' }}>
                                            <F_Age />
                                        </ul>
                                        )
                                    }
                                
                                <li><a className="dropdown-item" href="#!">Something else here</a></li>
                            </ul>
                            
                        )}*/}
                        <div className="upload">
                        <button className="custom-dropdown-btn" onClick={handleClick}>Upload</button>
                        </div>
                    </div >
                    
                </nav>
            </div>

        </>
    )
}

export default Top 