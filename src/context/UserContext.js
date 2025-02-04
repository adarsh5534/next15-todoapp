
'use client';
import { createContext, useContext, useReducer, useEffect } from 'react'
import { useSession } from 'next-auth/react'

const UserContext = createContext();
const userReducer = (state, action) =>
{
    switch (action.type)
    {
        case 'SET_USER_DATA':
            return { ...state, ...action.payload, loading: false }
        case 'SET_LOADING':
            return { ...state, loading: action.payload }
        case 'UPDATE_USER':
            return { ...state, ...action.payload }
        default:
            return state
    }
}

export function  UserProvider ({children}) {
    const { data: session, status } = useSession()
    const [state, dispatch] = useReducer(userReducer, {
        loading: true,
        userData: null
      })
    
      useEffect(() => {
        async function fetchUserData() {
          if (status === 'authenticated' && session?.user?.email) {
            try {
              const response = await fetch(`/api/user?email=${session.user.email}`)
              const userData = await response.json()
              dispatch({ type: 'SET_USER_DATA', payload: userData })
            } catch (error) {
              console.error('Error fetching user data:', error)
              dispatch({ type: 'SET_LOADING', payload: false })
            }
          } else if (status === 'unauthenticated') {
            dispatch({ type: 'SET_LOADING', payload: false })
          }
        }
    
        fetchUserData()
      }, [session, status])
      return (
        <UserContext.Provider value={{ state, dispatch }}>
          {children}
        </UserContext.Provider>
      )
    }

    export const useUser = () => useContext(UserContext)