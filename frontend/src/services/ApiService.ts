import axios from "axios";
import { db } from "../assets/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const ApiService = {
  listenToRoomEvents: (
    roomHash: string,
    onEvent: (eventData: any) => void,
    onError?: (error: any) => void
  ) => {
    const roomDocRef = doc(db, "rooms", roomHash);

    const unsubscribe = onSnapshot(
      roomDocRef,
      (doc) => {
        if (doc.exists()) {
          const eventData = doc.data();
          onEvent(eventData);
        } else {
          console.error("No documents found for this room.");
        }
      },
      (error: any) => {
        console.error("Error listening to Firestore events:", error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  },

  closeEventSource: (eventSource: EventSource) => {
    eventSource.close();
  },

  startRound: async (
    roomHash: string,
    organizerName: string,
    subjectId: number,
    password: string
  ) => {
    const response = await axios.post(
      `${API_BASE_URL}/rooms/${roomHash}/rounds`,
      {
        organizerName,
        subjectId,
        password,
      }
    );
    return response.data;
  },

  closeRound: async (
    roomHash: string,
    roundId: number,
    organizerName: string,
    password: string
  ) => {
    const response = await axios.patch(
      `${API_BASE_URL}/rooms/${roomHash}/rounds/${roundId}`,
      {
        organizerName,
        password,
      }
    );
    return response.data;
  },

  sendMove: async (
    roomHash: string,
    subjectId: number,
    playerName: string,
    future: string,
    mood: string
  ) => {
    const response = await axios.post(
      `${API_BASE_URL}/rooms/${roomHash}/rounds/${subjectId}/moves`,
      {
        playerName,
        future,
        mood,
      }
    );
    return response.data;
  },

  createRoom: async (
    organizerName: string,
    profile: string,
    password: string
  ) => {
    console.log("API URL:", process.env.REACT_APP_API_BASE_URL);
    const response = await axios.post(`${API_BASE_URL}/rooms/`, {
      organizerName: organizerName,
      profile: profile,
      password,
    });
    return response.data;
  },

  joinRoom: async (
    roomHash: string,
    playerName: string,
    profile: string,
    password: string
  ) => {
    const response = await axios.post(
      `${API_BASE_URL}/rooms/${roomHash}/players`,
      {
        playerName,
        profile,
        password,
      }
    );
    return response.data;
  },

  generateReport: async (roomHash: string) => {
    const response = await axios.get(`${API_BASE_URL}/rooms/${roomHash}`);
    return response.data;
  },

  fetchSubjects: async () => {
    const response = await axios.get(`${API_BASE_URL}/subjects`);
    return response.data;
  },
};
