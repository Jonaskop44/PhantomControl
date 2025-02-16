"use client";

import ApiClient from "@/api";
import Spline from "@/components/dashboard/Spline";
import { useEffect, useState } from "react";

const apiClient = new ApiClient();

const Dashboard = () => {
  const [registeredClients, setRegisteredClients] = useState(0);
  const [registrationsData, setRegistrationsData] = useState<
    { x: string; y: number }[]
  >([]);

  useEffect(() => {
    // Anzahl aller registrierten Clients abrufen
    apiClient.clients.helper.getAllClients().then((response) => {
      if (response.status && Array.isArray(response.data)) {
        setRegisteredClients(response.data.length); // Korrektur: Länge des Arrays speichern
      }
    });

    // Registrierungsdaten der letzten 30 Tage abrufen
    apiClient.clients.helper
      .getClientRegistrationsLast30Days()
      .then((response) => {
        if (response.status && Array.isArray(response.data)) {
          setRegistrationsData(response.data);
        }
      });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h1 className="text-xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">
        Gesamt registrierte Clients: {registeredClients}
      </p>{" "}
      {/* Kein Fehler mehr */}
      <Spline data={registrationsData} />
    </div>
  );
};

export default Dashboard;
