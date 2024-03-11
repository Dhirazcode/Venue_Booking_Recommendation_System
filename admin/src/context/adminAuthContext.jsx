import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AdminContext = createContext({})

export function AdminContextProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  useEffect(() => {
    if (!admin) {
      axios.get("/profile_admin").then(({ data }) => {
        setAdmin(data)
      })
    }
  }, [])
  return (
    <AdminContext.Provider value={{admin, setAdmin}}>
      {children}
    </AdminContext.Provider>
  )
}