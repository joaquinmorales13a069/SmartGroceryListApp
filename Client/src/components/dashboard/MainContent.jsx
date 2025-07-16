import React from 'react'
import Dashboard from './Dashboard'

function MainContent({ activeScreen }) {
  return (
    <div className='main-content'>
        {activeScreen === "Dashboard" && <Dashboard />}
    </div>
  )
}

export default MainContent