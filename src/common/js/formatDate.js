function addZero(v) {
    return ('00' + v).slice(v.length)
}

export function formatDate(date, formatStr) {
    if (/(y+)/.test(formatStr)) {
        // RegExp.$1 是于正则匹配的第一个子字符串 (以括号区分)
        formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + '').slice(4 - RegExp.$1.length))
    }

    let oFmt = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }

    for (let key in oFmt) {
        if (new RegExp(`(${key})`).test(formatStr)) {
            let str = oFmt[key] + ''
            // 如果传进来的模板是 1位 则不需要补零 否则 补零
            formatStr = formatStr.replace(RegExp.$1, RegExp.$1.length === 1 ? str : addZero(str))
        }
    }
    return formatStr
}
