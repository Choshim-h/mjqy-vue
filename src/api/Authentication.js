import request from '@/utils/request'

export default {
    getData(data) {
        var parameter=[];
        if(data.hasOwnProperty("parameter")){
            parameter=data.parameter;
        }
        return request.get(data.api,parameter)
    },
    submitData(data) {
        var parameter=[];
        if(data.hasOwnProperty("parameter")){
            parameter=data.parameter;
        }
        return request.post(data.api,parameter)
    },
}