import axiosClient from "../api/axiosClient";


// =======================
// GLOBAL SEARCH
// =======================
const searchAll = async (keyword) => {

  const response = await axiosClient.get(
    `/search?keyword=${keyword}`
  );

  return response.data;

};


const searchService = {
  searchAll,
};


export default searchService;