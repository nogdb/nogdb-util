import axios from "axios";



export function get(url, configs = {}) {
  return axios({
    method: "get",
    url: url,
    ...configs
  });
}



export function post(url, body, configs = {}) {
  return axios({
    method: "post",
    url: url,
    data: body,
    ...configs
  });
}
