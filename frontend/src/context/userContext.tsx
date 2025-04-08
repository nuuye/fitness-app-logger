import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { User } from "../types/user";
import { getUserRequest } from "../services/user";

type UserContextType = { user: User | undefined; userInitials: string };

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
        const fetchUser = async () => {
            const storageUserId = localStorage.getItem("userId");
            if (storageUserId) {
                try {
                    const fetchedUser = await getUserRequest(storageUserId);
                    setUser(fetchedUser || null);
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    setUser(null);
                }
            }
        };

        fetchUser();
    }, []);

    const getUserNameInitials = (name: string): string => {
        const splittedName = name.trim().split(" ");
        return splittedName.length > 1
            ? splittedName[0].charAt(0) + splittedName[1].charAt(0)
            : splittedName[0].charAt(0);
    };

    const userInitials = useMemo(() => {
        return user?.name ? getUserNameInitials(user.name).toUpperCase() : "...";
    }, [user]);

    return <UserContext.Provider value={{ user, userInitials }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};
