import axiosInstance from '../../../utils/axiosInstance'
import { COMMON_API_URL } from '../../../constants/apiURLS'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// export const login = createAsyncThunk("authSlice/login", async (data: any) => {
//   try{
//     const request = { ...data.body };
//     axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
//     const result = await axios.post(COMMON_API_URL.login,
//       //request,
//       {

//         userName:"PKwhqV5SrH7OWI4g/8kf7Q==",
//         userPassword:"H8ZuyDdiyWAD/chE95hxtA==",
//         actualPassword:"Admin@123",
//         Captcha:""

//     }
//     );

//     console.log(result)
//     return result;
//   }
//   catch(e){
//     console.log(e);
//   }

// });

export const login = createAsyncThunk('authSlice/login', async (data: any) => {
    try {
        //const request = { ...data.body };

        const result = await axiosInstance.post(
            COMMON_API_URL.login,

            { ...data.model }
        )
        console.log(result)
        const responseData = result.data.Data
        return responseData
    } catch (e) {
        console.log(e)
    }
})
