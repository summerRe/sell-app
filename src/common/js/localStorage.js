export function saveToLocal(id, key, val) {
    let seller = window.localStorage._seller_

    if (!seller) {
        seller = {}
        seller[id] = {}
    } else {
        seller = JSON.parse(seller)
    }

    if (!seller[id]) {
        seller[id] = {}
    }

    seller[id][key] = val

    // localStorage不允许直接存储一个对象
    window.localStorage._seller_ = JSON.stringify(seller)
}

export function loadFromLocal(id, key, def) {
    let seller = window.localStorage._seller_

    if (!seller) {
        return def
    }

    seller = JSON.parse(seller)[id]

    if (!seller) {
        return def
    }
    return seller[key] || def
}
