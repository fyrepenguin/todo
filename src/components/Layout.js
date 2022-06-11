import React from 'react'
import { Outlet } from 'react-router-dom'
import AuthStatus from './AuthStatus';

const Layout = () => {
  return (
    <div>
      <AuthStatus />
      <header className="app-title">
        <h2>Todo </h2>
      </header>

      <Outlet />
    </div>
  )
}

export default Layout