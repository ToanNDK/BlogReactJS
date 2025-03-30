import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'
const Main = () => {
  return (
    <div>
        <Header/>
        <div id="layoutSidenav">
            <Sidebar/>
            <Outlet/>
        </div>
    </div>
  )
}

export default Main