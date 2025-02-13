
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
        case 'RENDER_TODOLIST':
          return { ...state, render_list:action.payload }
        case 'PAGE':
          return { ...state, page:action.payload }
        case 'USER_TASK_DATA':
          return { ...state, task_list:action.payload }
        case 'CATEGORY':
          return { ...state, category:action.payload }
        default:
            return state
    }
}

export function  UserProvider ({children}) {
    const { data: session, status } = useSession()
    const [state, dispatch] = useReducer(userReducer, {
        loading: true,
        userData: null,
        render_list:false,
        page:1,
        task_list:null,
        category: ''
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