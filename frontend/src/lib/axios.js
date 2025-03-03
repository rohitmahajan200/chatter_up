import axios from "axios";

export const axiosInsatance=axios.create({
    baseURL:"http://localhost:3000/api",
    withCredentials:true,

})