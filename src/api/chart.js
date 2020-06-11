import request from '@/utils/request'

export default {
    getData(data) {
        var parameter=[];
        if(data.hasOwnProperty("parameter")){
            parameter=data.parameter;
        }
        return request.post(data.api,parameter)
    },
    sendData(data){
        var parameter=[];
        if(data.hasOwnProperty("parameter")){
            parameter=data.parameter;
        }
        return request.post(data.api,parameter)
    }
}