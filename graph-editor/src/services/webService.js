import axios from 'axios'

// Example
// get('http://gog.co.th', { timeout: 3000 });

export function get(url, configs = {}) {
    return axios({
        method: 'get',
        url: url,
        ...configs
    })
}

// Example
// post('http://gog.co.th/nodes, { nodeId: 1, label: 'test', group: 'a' }, { timeout: 3000 });

export function post(url, body, configs={}) {
    return axios({
        method: 'post',
        url: url,
        data: body,
        ...configs
    })
}