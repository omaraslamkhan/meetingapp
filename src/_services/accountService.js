import {http} from '../_helpers/http';


export default {

    find (query, url) {
      return http.get(`${url}`, {
        params: query
      })
    },
  
    create (params) {
      return http.post(`/test`, { test: params })
    },
  
    update (params) {
      return http.put(`/test`, { test: params })
    }
  
  }