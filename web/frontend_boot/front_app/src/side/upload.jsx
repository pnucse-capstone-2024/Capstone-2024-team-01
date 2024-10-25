import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
    const navigate = useNavigate();
    const [files, setFiles] = useState([]); // Manage file list state
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        const selectedFile = e.target.files[0]; // Select a single file
        if (selectedFile) {
            // Prevent adding more than 4 files
            if (files.length < 2) {
                setFiles(prevFiles => [...prevFiles, selectedFile]); // Add new file
            } else {
                alert("You can only upload a maximum of 2 files.");
            }
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        const newFiles = droppedFiles.filter(file => 
            file.name.endsWith('.nii') && files.length < 2
        );
        if (newFiles.length + files.length > 2) {
            alert("You can only upload a maximum of 2 files.");
        } else {
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const onDragOver = (e) => {
        e.preventDefault(); // Prevent default behavior to allow drop
    };

    // Handle file removal
    const removeFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index)); // Remove file at the specified index
    };

    // Reset the form
    const onReset = () => {
        setFiles([]); // Clear file list
        navigate('/patients'); // Navigate back to home after reset
    };

    // Handle form submission
    const onSubmit = async (e) => {
        e.preventDefault();

        // Check if exactly 4 files are selected
        if (files.length !== 2) {
            alert("Please select 2 files.");  // Alert error message
            return;
        }

        // Validate each file name
        const fileNames = ["flair.nii", "t1ce.nii"];

        // Extract and sort uploaded file names
        const uploadedFileNames = files.map(file => file.name).sort();
        const sortedFileNames = fileNames.sort(); // Sort reference file names

        const isValid = uploadedFileNames.every((fileName, index) => fileName.endsWith(sortedFileNames[index]));

        if (isValid) {
            setLoading(true); // Set loading state to true
            await insertProduct(); // Call file upload function
        } else {
            alert("File names are incorrect. They must end with 'flair.nii', 't1ce.nii'.");
        }
    };

    // Upload files to the server
    const insertProduct = async () => {
        try {
            const data = new FormData();  // Create FormData object

            // Add selected 2 files to FormData
            files.forEach((file, index) => {
                data.append(`p_img${index + 1}`, file);  // Dynamically add files
            });

            const response = await axios.post("http://localhost:8080/api/addpatient", data, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Set multipart/form-data header
                }
            });

            console.log(response); // Log response
            setTimeout(() => {
                setLoading(false); // Set loading to false
                navigate('/patients'); // Navigate to the main screen
            }, 2000); // Redirect after 2 seconds
        } catch (error) {
            console.log('Upload Error:', error.message);
            setLoading(false); // Set loading to false in case of error
            if (error.response) {
                console.log('Error Response Data:', error.response.data);
                console.log('Error Response Status:', error.response.status);
                console.log('Error Response Headers:', error.response.headers);
            }
        }
    };

    return (
        <>
            {loading && (
                <div className="loading-screen">
                    <h2>"Loading, it takes 1 to 2 minutes."</h2>
                    <p>Your files are being uploaded.</p>
                </div>
            )}
            <div className={`upload_patient ${loading ? 'hidden' : ''}`}>
                <h2 style={{ color: 'white' }}>Patient Upload</h2>
                <form onSubmit={onSubmit}>
                <div 
                    style={{ 
                        border: '2px solid #444', 
                        borderRadius: '8px', 
                        backgroundColor: '#333', // Dark background
                        padding: '10px', 
                        width: '400px', 
                        maxHeight: '300px', // Maximum height
                        overflowY: 'auto', // Enable scrolling if necessary
                        position: 'relative',
                        textAlign: 'center',
                        cursor: 'pointer' // Show pointer on hover
                    }}
                    onDrop={onDrop} // Handle file drop
                    onDragOver={onDragOver} // Handle drag over
                >
                    <input 
                        id="file-input" // Link the label to the input
                        type="file" 
                        accept=".nii" 
                        onChange={onChange} // Handle file selection
                        style={{ display: 'none' }} // Hide the default file input
                        multiple // Allow multiple file selection
                    />
                    <ul style={{ listStyleType: 'none', padding: 0, margin: '10px 0', color: 'white' }}>
                        {files.map((file, index) => (
                            <li key={index} style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ flexGrow: 1, textAlign: 'left' }}>{file.name}</span> {/* File name aligned left */}
                                <button 
                                    type="button" 
                                    onClick={() => removeFile(index)} 
                                    style={{ 
                                        color: 'red', 
                                        fontSize: '20px', 
                                        background: 'none', 
                                        border: 'none', 
                                        cursor: 'pointer', 
                                        marginLeft: '10px' 
                                    }}
                                >
                                    x {/* File remove indicator */}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {files.length < 2 && (
                        <div 
                            style={{ 
                                border: '1px dashed rgba(255, 255, 255, 0.5)', 
                                padding: '10px', 
                                margin: '10px 0', 
                                color: 'rgba(255, 255, 255, 0.5)' 
                            }}
                            onClick={() => document.getElementById('file-input').click()} // Trigger file input click
                        >
                            Click or drag files here
                        </div>
                    )}
                </div>
                    <div style={{ marginTop: '20px', marginLeft: '200px' }}>
                        <button 
                            type='submit' 
                            style={{ 
                                marginRight: '10px', 
                                backgroundColor: '#444', // Dark button background
                                color: '#f1f1f1', // Light text color
                                border: 'none',
                                borderRadius: '5px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#555'} // Darker on hover
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#444'} // Revert on mouse out
                        >
                            Submit
                        </button>
                        <button 
                            type='reset' 
                            onClick={onReset} 
                            style={{ 
                                backgroundColor: '#444', // Dark button background
                                color: '#f1f1f1', // Light text color
                                border: 'none',
                                borderRadius: '5px',
                                padding: '10px 20px',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#555'} // Darker on hover
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#444'} // Revert on mouse out
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Upload;