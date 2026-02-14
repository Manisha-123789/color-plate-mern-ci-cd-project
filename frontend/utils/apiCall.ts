import axios from 'axios'

export const apiCall = async (method, url, body = {} ) => {
    try {
        const response = await axios({ method: method, url: url, data: body });
        return {data : response.data.data, loading : false};
    } catch (error) {
        if(error){
            return error?.message;
        }
    }

}