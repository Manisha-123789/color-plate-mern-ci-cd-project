import axios from 'axios'

export const apiCall = async (method, url, body = {} ) => {
    try {
        const response = await axios({ method: method, url: url, data: body });
        return response.data;
    } catch (error) {
        if(error){
            return error?.message;
        }
    }

}