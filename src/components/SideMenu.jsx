import React from 'react'

const Roles = {
  ADMIN: 'Admin',
  ARTIST: 'Artist',
  VISITOR: 'Visitor',
  CURATOR: 'Curator'
}

export default function SideMenu({ active, onNavigate, role }) {

  // Common menu for everyone
  const common = [
    { id: 'home', label: 'Home' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'tour', label: 'Virtual Tour' }
  ]

  // Admin-only items
  const adminLinks = [
    { id: 'admin', label: 'Admin Panel' },
    { id: 'manageUsers', label: 'Manage Users' },
    { id: 'settings', label: 'Settings' }
  ]

  // Artist items — ❌ Removed Artist Dashboard + Sales
  const artistLinks = [
    { id: 'upload', label: 'Upload Artwork' },
    { id: 'settings', label: 'Settings' }
  ]

  // Curator (unchanged)
  const curatorLinks = [
    { id: 'curator', label: 'Curator Panel' },
    { id: 'exhibitions', label: 'Exhibitions' },
    { id: 'history', label: 'Cultural History' }
  ]

  // Build final menu based on role
  let links = [...common]

  if (role === Roles.ADMIN) links = links.concat(adminLinks)
  if (role === Roles.ARTIST) links = links.concat(artistLinks)
  if (role === Roles.CURATOR) links = links.concat(curatorLinks)

  return (
    <aside className="w-72 bg-white border-r border-gray-100 min-h-[calc(100vh-64px)] p-4 hidden md:block">
      <div className="mb-6">
        <h2 className="text-lg font-serif">Dashboard</h2>
        <p className="text-xs text-gray-500">Role: {role}</p>
      </div>
      <nav className="flex flex-col gap-2">
        {links.map(l => (
          <button
            key={l.id}
            onClick={() => onNavigate(l.id)}
            className={`text-left p-3 rounded-md hover:bg-gray-50 ${active === l.id ? 'bg-gray-50' : ''}`}
          >
            {l.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
