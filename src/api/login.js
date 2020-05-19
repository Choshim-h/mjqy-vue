
import request from '@/utils/request'

export default {
    login(data) {
        return request.$get('service/login', data)
    }
}