'use client'

import React, { createContext, useState, ReactNode , useContext } from 'react'


interface BookingContextType {
    store_id: string
    setStore_id: React.Dispatch<React.SetStateAction<string>>
}


export const BookingContext = createContext<BookingContextType | null>(null)


interface BookingContextProviderProps {
    children: ReactNode
}

export const BookingContextProvider: React.FC<BookingContextProviderProps> = ({ children }) => {
    const [store_id, setStore_id] = useState<string>('')
    
    const value: BookingContextType = {
        store_id:store_id,
        setStore_id:setStore_id
    }

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    )
}

// เพิ่ม custom hook
export const useBooking = () => {
    const context = useContext(BookingContext)
    if (!context) {
        throw new Error('useBooking must be used within BookingContextProvider')
    }
    return context
}