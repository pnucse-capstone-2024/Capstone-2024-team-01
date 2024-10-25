import Layout from './layout/Layout';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Side from "./side/Side"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Upload from './side/upload';
import Main from './main/Main';

function App() {

  return (
    <>
    <Router>
      <Routes>
        {/* path : url */}
        <Route path="/" element={<Main/>}/>
        <Route path="/patients" element={<Layout/>}>
          {/* Layout 하위에 선언한 것임으로.. Home 은 Layout 의 Outlet 에 출력 
          index 는 상위 조건 , /, 와 동일하면.. */}
          {/* <Route index element={<Side />}/> */}
        </Route>
        <Route path="/upload" Component={Upload}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
