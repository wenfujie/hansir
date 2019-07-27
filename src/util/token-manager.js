/*
* createTime：2018/9/6
* author：en.chen
* description: 获取token
*/
import Storage from './storage.js'
import axios from 'axios'

const TokenManager =  {

    //  获取客户端模式token
    getCilentToken: ()=> {
        let data = {
            client_id: "wissClient",
            client_secret: "wissClientSecret"
        }
        return axios.post('token/cilentToken',data).then((res)=>{
            Storage.set('CILENT_TOKEN',res.data)
            return res.data
        })
    },

    //  获取密码模式token
    getPwdToken: ()=> {
        let data = {
            client_id: "wissClient",
            client_secret: "wissClientSecret",
            usrId: Storage.get('USER_INFO').usrId,
            companyId: Storage.get('USER_INFO').companyId
        }
        return axios.post('token/pwdToken',data).then((res)=>{
            Storage.set('PWD_TOKEN',res.data)
            return res.data
        })
    }

}

export default TokenManager