import axios from 'axios'
import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios';


export const useApi = (method, url, body = {},) => {

    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();

    useEffect(() => {

        const apiCall = async () => {
            try {
                const response = await axios({ method: method, url: url, data: body });
                console.log(response)
                if (response.status === 200 && response.statusText === "OK") {
                    setData(response.data.data || response.data.message)
                }

            } catch (error : unknown) {
                const err = error as AxiosError;
                console.log(err)
                if (err?.status === 404) {
                    setError(err?.message)
                    setLoading(false);
                }
                return error;
            } finally {
                setLoading(false);
            }
        }
            //    async function apiCall () {
            //       await  axios({ method: method, url: url, data: body }).then((response) => {
            //         setData(response.data.palette)
            //     }).catch((error) => {
            //         setData(error.data.error)
            //     })
            //     }
            apiCall();
        }, [method, url])

    return {data, loading, error};
}