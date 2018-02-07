export function urlParse() {
    let urlData = window.location.search   // '?id=12345&sex=man'
    let obj = {}
    let reg = /[?&][^?&]+=[^?&]+/g
    let arr = urlData.match(reg)   // ['?id=12345', '&sex=man']

    if (arr) {
        arr.forEach((v) => {
            let tempArr = v.slice(1).split('=')   // ['id', '12345']
            let key = decodeURIComponent(tempArr[0])
            let val = decodeURIComponent(tempArr[1])
            obj[key] = val
        })
    }
    return obj   // {'id': '12345', 'sex': 'man'}
}
