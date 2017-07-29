/**
 * 解析SQL中VALUES的值，考虑其中有转义单引号的情况
 * @param {VALUES in SQL} str 
 */
function parseValues(str) {
  str = str || ''
    // str = str.replace(/(^\s*|\s*$)/g, '') // 去掉首尾空格
  let ifBreakFor = false
  let err
  if (!str) return { err: new Error('未传入参数') }
  let mode = {
    WILLINGCOLLECT: 1, // 准备收集value，默认起点。遇到null或者
    COLLECTING: 2, // 正在收集数据，
    PREPARETOCHANGE: 3, // 收集数据中，遇到了单引号，准备发生变化
    WILLINGSPLIT: 4 // 准备遇到分割符
  }
  let status = mode.WILLINGCOLLECT
  let values = []
  let tmpValue = ''
    // 不用reduce
  let i, length = str.length
  for (i = 0; i < length; i++) {
    let tmpChar = str[i]
      // console.info(`当前读取到了:${str.slice(0,i+1)}`)
      // console.info(`当前idx:${i}`)
      // console.info(`当前status:${status}`)
    switch (status) {
      case mode.WILLINGCOLLECT:
        if (tmpChar === '\'') {
          // 遇到单引号时，进入collectionValue状态
          status = mode.COLLECTING
            // continue
        }
        if (tmpChar === 'n') {
          values.push(null)
          i = i + 3
            // continue
        }
        break;

      case mode.COLLECTING:
        // 当前是收集状态
        if (tmpChar === ' ') {
          // 如果遇到空格，要记录
          // continue
        }
        if (tmpChar === '\'') {
          // 如果在最后一个字符遇到了单引号
          // 就结束了，这是结束转义的地方
          if (i === length - 1) {
            values.push(tmpValue)
            tmpValue = undefined
            status = mode.WILLINGSPLIT
          }
          // 如果遇到单引号，这个单引号先不存，进入准备转义状态
          status = mode.PREPARETOCHANGE
        } else {
          // 收集Value状态，把每个字符在末尾添加
          tmpValue = tmpValue + tmpChar
        }
        break;

      case mode.PREPARETOCHANGE:
        // 当前状态是准备转义状态
        // 如果遇到单引号，就完成转义状态
        if (tmpChar === '\'') {
          // 上一个字符到达 准备转义，则这里的单引号是完成转义
          // 补上上一个单引号
          tmpValue = tmpValue + '\''
            // 确定完成转义状态
          status = mode.COLLECTING
        } else {
          // 否则，收集value，完成value收集状态
          // 补回上一状态为 等待分割状态
          // i = i - 1
          values.push(tmpValue)
          tmpValue = undefined
          status = mode.WILLINGSPLIT
            // 或者，立刻判断当前字符  
          if (tmpChar === ',') {
            tmpValue = ''
            status = mode.WILLINGCOLLECT
          } else if (tmpChar === ' ') {
            // 如果新的字符是空格，则补上当前空格
            // 什么也不做
          } else {
            ifBreakFor = true
            console.error(`-预期一个逗号,结果第${i}个字符遇到了个 ${tmpChar}`)
          }
        }
        break;

      case mode.WILLINGSPLIT:
        if (tmpChar === ' ') {
          // 如果遇到空格，跳到下一步
          continue
        }
        if (tmpChar === ',') {
          // 遇到分号，进入预期收集状态
          tmpValue = ''
          status = mode.WILLINGCOLLECT
        } else {
          ifBreakFor = true
          console.error(`预期一个逗号，结果第${i}个字符遇到了个 ${tmpChar}`)
        }
        break;

      default:

        break;
    }
    if (ifBreakFor) {
      break
    }
  }
  let errMsg = []
  if(tmpValue){
    errMsg.push('未正常结束')
  }
  if(ifBreakFor){
    errMsg.push('解析出错')
  }
  if(!values){
    errMsg.push('长度为空')
  }
  err = err || (errMsg.length ? (new Error(errMsg.join('\n'))) : null)
  return { err, values }
}


module.exports = parseValues