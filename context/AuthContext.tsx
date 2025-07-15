import React, { createContext, ReactNode, useContext, useState } from 'react';

type UserProfile = {
    id: string;
    email: string;
    nome: string;
    apelido?: string;
    nascimento?: string;
    genero?: string;
};

type AuthContextType = {
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
