import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5001/challenge-4b2b2/us-central1/api", // the cloud function url
});
export default instance;
