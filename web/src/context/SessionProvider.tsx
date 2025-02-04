"use client";

import Loader from "@/components/Loader";
import { userStore } from "@/data/userStore";
import React, { useEffect, useState } from "react";

interface SessionProviderProps {
  children: React.ReactNode;
}

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const { fetchUser, refreshToken } = userStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const doAction = async () => {
      refreshToken();
      setTimeout(() => fetchUser(), 300);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };

    doAction();
  }, [fetchUser, refreshToken]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default SessionProvider;
