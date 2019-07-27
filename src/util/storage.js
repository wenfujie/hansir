/**
 *  本地缓存
 * Created by en.chen on 2018-05-22.
 */
var STORAGE_EXPIRE_MAP = 'STORAGE_EXPIRE_MAP'
// const storage = (process.env.NODE_ENV == "development" ? localStorage : localStorage)
 const storage = window.localStorage;

var Storage = {
    /**
     * 获取缓存
     * @param key 键名
     * @returns {Object}
     */
    get: function (key) {
        let value = storage.getItem(key)
        try {
            return JSON.parse(value)
        } catch (e) {
            return null
        }
    },
    /**
     * 设置缓存
     * @param key 键名
     * @param object 键值
     * @param expire 有效时长（秒）
     */
    set: function (key, object, expire) {
        if (object !== null && object !== undefined) {
            let value = object
            if (typeof value !== 'string') {
                try {
                    value = JSON.stringify(object)
                } catch (e) {
                    value = null
                }
            }
            if (value !== null) {
                storage.setItem(key, value)
                if (expire && expire > 0) {
                    let expireAt = new Date().getTime() + expire * 1000
                    addExpire(key, expireAt)
                }
            }
        }
    },
    /**
     * 移除
     * @param key
     */
    remove: function (key) {
        try {
            storage.removeItem(key)
        } catch (e) {
            throw new Error(e.message)
        }
    },
    /**
     * 清理
     */
    clear: function () {
        storage.clear()
    }
}

/**
 * 设置过期
 * @param key
 * @param expireAt
 */
function addExpire (key, expireAt) {
    var map = Storage.get(STORAGE_EXPIRE_MAP) || {}
    map[key] = expireAt
    Storage.set(STORAGE_EXPIRE_MAP, map)
}

/**
 * 清理过期
 */
function clearExpire () {
    var map = Storage.get(STORAGE_EXPIRE_MAP) || {}
    var now = new Date().getTime()
    for (let key in map) {
        if (map[key] * 1 < now) {
            Storage.remove(key)
            delete map[key]
        }
    }
    Storage.set(STORAGE_EXPIRE_MAP, map)
}

/**
 * 过期轮询
 */
setInterval(function () {
    clearExpire()
}, 60000)

export default Storage
