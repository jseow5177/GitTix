import axios from 'axios'

const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    // On server
    return axios.create({
      // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      baseURL: 'http://www.gittix.xyz/',
      headers: req.headers
    })
  } else {
    // On browser
    // Note that req object is undefined when on browser
    return axios.create({
      baseURL: '/'
    })
  }
}

export default buildClient