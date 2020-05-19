
import request from '@/utils/request'

export default {
    getRest(data) {
        return request.$get('service/rest', data)
    }
}