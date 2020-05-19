import request from '@/utils/request'

export default {
    getData(data) {
        return request.get('service/rest', data)
    }
}