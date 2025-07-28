import React from 'react'
import Dashboard from './Dashboard'
import CreateGroceryList from './CreateGroceryList'

function MainContent({ activeScreen }) {
  return (
    <div className='main-content'>
        {activeScreen === "Dashboard" && <Dashboard />}
        {activeScreen === "Create Grocery List" && <CreateGroceryList />}
    </div>
  )
}

export default MainContent