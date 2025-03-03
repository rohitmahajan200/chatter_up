import axios from "axios";

export const axiosInsatance=axios.create({
    baseURL:import.meta.env.MODE==="development"?"http://localhost:3000/api":"/api",
    withCredentials:true,

})