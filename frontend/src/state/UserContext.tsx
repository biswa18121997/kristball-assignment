import React, { useState, createContext, useEffect } from "react";

export type Role = "ADMIN" | "BASE_COMMANDER" | "LOGISTICS_OFFICER";
export interface Base {
  id: string;
  name: string;
  location?: string;
}
export interface UserDetails {
  name: string;
  email?: string;
  role: Role;
  base: Base | null;
}
type UserContextType = {
  userDetails: UserDetails | null;
  token: string | null;
  setData: (data: { userDetails: UserDetails; token: string }) => void;
  refreshToken: () => Promise<boolean>;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(() => {
    try {
      const stored = localStorage.getItem("userAuth");
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed?.userDetails ?? null;
    } catch (err) {
      console.error("Error parsing userDetails:", err);
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem("userAuth");
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed?.token ?? null;
    } catch (err) {
      console.error("Error parsing token:", err);
      return null;
    }
  });

  const setData = ({
    userDetails,
    token,
  }: {
    userDetails: UserDetails;
    token: string;
  }) => {
    setUserDetails(userDetails);
    setToken(token);

    try {
      const raw = localStorage.getItem("userAuth");
      const existing = raw ? JSON.parse(raw) : {};

      const next = {
        ...existing,
        userDetails,
        token,
      };

      localStorage.setItem("userAuth", JSON.stringify(next));
    } catch (err) {
      console.error("Failed to update userAuth:", err);
      localStorage.setItem(
        "userAuth",
        JSON.stringify({ userDetails, token })
      );
    }
  };

  return (
    <UserContext.Provider
      value={{ userDetails, token, setData}}
    >
      {children}
    </UserContext.Provider>
  );
}
