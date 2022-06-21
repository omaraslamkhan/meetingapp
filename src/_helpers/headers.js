const headers = {
  userid: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : ''
};

export default headers
