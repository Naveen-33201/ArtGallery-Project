import React from 'react'

export default function ArtworkCard({ art, onOpen }){
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-50">
      <div className="h-48 w-full relative">
        <img src={art.image} alt={art.title} className="object-cover w-full h-full" />
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg">{art.title}</h3>
        <p className="text-xs text-gray-500">{art.artist} • {art.year}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm font-semibold">{new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(art.price)}</div>
          <button onClick={() => onOpen(art)} className="text-sm px-3 py-1 rounded-md border">View</button>
        </div>
      </div>
    </div>
  )
}
