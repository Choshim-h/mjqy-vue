
const sidebar = [
    {
        path: '/authentication',
        name: 'Authentication',
        component: () => import('@/views/authentication'),
        meta: { title: '用户真人认证' }
    },
    {
        path: '/report',
        name: 'Report',
        component: () => import('@/views/report'),
        meta: { title: '用户举报' }
    },
    {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/index'),
        meta: { title: '运营聊天' }
    },
    {
        path: '/resources',
        name: 'Resources',
        component: () => import('@/views/resources'),
        meta: { title: '资源审核' }
    }
]

let sidebarList = null

export const getSidebarList = () => {
    if (!sidebarList) {
        sidebarList = sidebar.map(item => {
            return {
                path: item.path,
                name: item.name,
                meta: item.meta
            }
        })
    }
    return sidebarList
}


export default sidebar
