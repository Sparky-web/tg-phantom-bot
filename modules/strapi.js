import _axios from "axios"
import qs from "qs"

const axios = _axios.create({
    baseURL: `http://0.0.0.0:${process.env.STRAPI_PORT}/api`
})

export async function get(type, filters, options = {}) {
    const { data: { data } } = await axios.get(`/${type}?${qs.stringify(filters)}`, { pagination: {limit: 100}, ...options })
    return Array.isArray(data) ? data.map(e => ({ id: e.id, ...e.attributes })) : { id: data.id, ...data.attributes }
}

export async function create(type, data, options = {}) {
    const { data: { data: res } } = await axios.post(`/${type}`, { data }, options)
    return {id: res.id, ...res.attributes}
}

export async function update(type, data, options = {}) {
    const { data : {data: res} } = await axios.put(`/${type}/${data.id}`, { data }, options)
    return {id: res.id, ...res.attributes}
}

export default { create, get, update }