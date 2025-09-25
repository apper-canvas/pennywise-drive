import React, { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "@/components/organisms/Sidebar"
import FilterSidebar from "@/components/organisms/FilterSidebar"
import Header from "@/components/organisms/Header"

const Layout = () => {
const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false)

  return (
<div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Filter Sidebar */}
      <FilterSidebar 
        isOpen={filterSidebarOpen}
        onClose={() => setFilterSidebarOpen(false)}
      />
      {/* Main Content */}
<div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuToggle={() => setSidebarOpen(true)}
          onFilterToggle={() => setFilterSidebarOpen(prev => !prev)}
          filterSidebarOpen={filterSidebarOpen}
        />
        
<main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet context={{ 
              filterSidebarOpen, 
              setFilterSidebarOpen 
            }} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout