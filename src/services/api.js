import {
    httpClient
} from '@/plugins/axios'

const API = {
    city: '/api/stat/queryExamCityProvinceByCreateTime',
    count: '/api/exam/operation/queryLastExamId',
    champion: '/api/stat/queryExamCityProvince'
}

export const getTotalCount = () => httpClient({
    url: API.count
})

export const fetchCities = (time) => httpClient({
    url: `${API.city}?createTime=${time}` // ,
    // params: {
    //     createTime: time
    // }
})

export const getChampion = (examId) => httpClient({
    url: API.champion,
    params: {
        examId: examId
    }
})
