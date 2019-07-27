/*
* createTime：2018/11/1
* author：en.chen
* description: 登陆模块
*/

export default [{
    path: '/login',
    name: 'login',
    component: () =>
        import ('@/pages/login/login'),
}]