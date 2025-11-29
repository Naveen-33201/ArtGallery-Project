import React from 'react'

export default function ArtworkDetailModal({ art, onClose, onBuy }){
  if(!art) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6">
        <div className="flex gap-6">
          <div className="w-1/2">
            <img src={art.image} alt={art.title} className="object-cover w-full h-80 rounded" />
          </div>
          <div className="w-1/2">
            <h2 className="font-serif text-2xl">{art.title}</h2>
            <p className="text-sm text-gray-500">By {art.artist} • {art.year}</p>
            <p className="mt-4 text-gray-700">{art.description}</p>
            <div className="mt-4 text-xs text-gray-500">History: {art.history}</div>
            <div className="mt-6 flex items-center gap-4">
              <div className="text-2xl font-semibold">{new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(art.price)}</div>
              <button onClick={() => onBuy(art)} className="px-4 py-2 rounded-md border">Buy</button>
              <button onClick={onClose} className="px-3 py-1 text-sm text-gray-500">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
