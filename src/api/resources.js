import request from '@/utils/request'

export default {
    getData(data) {
        var parameter = [];
        if (data.hasOwnProperty("parameter")) {
            parameter = data.parameter;
        }
        return request.post(data.api, parameter)
    },
    EnableData(data) {
        var parameter = [];
        if (data.hasOwnProperty("parameter")) {
            parameter = data.parameter;
        }
        return request.post(data.api, parameter)
    },
    DisableData(data) {
        if (data.hasOwnProperty("parameter")) {
            parameter = data.parameter;
        }
        return request.post(data.api, parameter)
    },
    onSubmitData(data) {
        if (data.hasOwnProperty("parameter")) {
            parameter = data.parameter;
        }
        return request.post(data.api, parameter)
    }

}