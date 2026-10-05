import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

export const calculateRainwater = async (data) => {
  const response = await API.post("/water/calculate", data);
  return response.data;
};

export const calculateCommunity = async (data) => {
  const response = await API.post("/water/community", data);
  return response.data;
};

export const analyzeHeat = async (data) => {
  const response = await API.post("/heat/analyze", data);
  return response.data;
};
export const getCurrentWeather = async () => {
  const response = await API.get("/weather/current");
  return response.data;
};
export const getClimateStatus = async (data) => {
  const response = await API.post("/climate/status", data);
  return response.data;
};