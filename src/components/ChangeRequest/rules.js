// const NUMBER_SYMBOL = {
//   VALUE_CONTAINS_EQUAL,// 值包含等于
//   VALUE_CONTAINS, // 值包含
//   SUM_CONTAINS, // 和包含等于
//   SUM_CONTAINS_EQUAL, // 和包含
// }
import state from '../../Store';

export const checkForm = (rule, ruleOption, value, options, deviceName) => {
  let message;

  if (options.inputType === "TEXT" || options.inputType === "EDIT_SELECT") {
    if (rule.validateType === "VALIDAT_NUMBER" && isNaN(value)) {
      message = ` 输入项必须是数字！`
    }
  }

  // if(options.inputType === 'TEXT') {
  switch (rule.validateType) {
    case "VALIDAT_NUMBER":
      message = checkNumber(ruleOption, value, deviceName)
      break;
    case "VALIDAT_STRING":
      message = checkString(ruleOption, value)
      break;
    // 正则
    case "VALIDAT_REGULAR":

      break;
    case "NO_VALIDAT":
      message = false;
      break;
    default:

  }
  return message
}

// 获取对象数组特定 key 的 value 组成数组
export const getValues = (objArr, key, deviceName) => {
  let valArr = [];
  objArr.forEach(obj => {
    if (obj.deviceName === deviceName) {
      valArr.push(obj[key])
    }
  })
  return Array.from(new Set(valArr))
}

// 获取最大最小值
export const getPeak = (ruleOption, deviceName) => {
  let min,
    max;
  // 获取 min
  switch (ruleOption.minType) {
    case "FIXED":
      min = ruleOption.minValue - 0;
      break;
    case "DYNAMIC":
      let peakArr = state.getCollection(ruleOption, deviceName, getValues)
      min = peakArr[0];
      break;
    default:
  }
  // 获取 max
  switch (ruleOption.minType) {
    case "FIXED":
      max = ruleOption.maxValue - 0;
      break;
    case "DYNAMIC":
      let peakArr = state.getCollection(ruleOption, deviceName, getValues);
      max = peakArr[peakArr.length - 1];
      break;
    default:
  }
  if (ruleOption.minSymbol === "VALUE_CONTAINS_EQUAL") {

  } else if (ruleOption.minSymbol === "VALUE_CONTAINS") {
    min++
  }

  if (ruleOption.maxSymbol === "VALUE_CONTAINS_EQUAL") {

  } else if (ruleOption.maxSymbol === "VALUE_CONTAINS") {
    max--
  }

  return {
    min,
    max
  }
}

// 校验数字
export const checkNumber = (ruleOption, value, deviceName) => {
  let min,
    max;
  // 获取 min
  switch (ruleOption.minType) {
    case "FIXED":
      min = ruleOption.minValue && ruleOption.minValue - 0;
      break;
    case "DYNAMIC":
      let peakArr = state.getCollection(ruleOption, deviceName, getValues)
      min = peakArr[0];
      break;
    default:
  }
  // 获取 max
  switch (ruleOption.minType) {
    case "FIXED":
      max = ruleOption.maxValue && ruleOption.maxValue - 0;
      break;
    case "DYNAMIC":
      let peakArr = state.getCollection(ruleOption, deviceName, getValues);
      max = peakArr[peakArr.length - 1];
      break;
    default:
  }
  let message;
  if (min && ruleOption.minSymbol === "VALUE_CONTAINS_EQUAL" && value < min) {
    message = `最小值需要大于等于${min}`
  } else if (min && ruleOption.minSymbol === "VALUE_CONTAINS" && (value < min || value === min)) {
    message = `最小值需要大于${min}`
  }

  if (max && ruleOption.maxSymbol === "VALUE_CONTAINS_EQUAL" && value > max) {
    message = `最大值需要小于等于${max}`
  } else if (max && ruleOption.maxSymbol === "VALUE_CONTAINS" && (value > max || value === max)) {
    message = `最大值需要小于${max}`
  }

  return message
}


export const isY = value => {
  if(value && value === "Y") {
    return true
  }else{
    return false
  }
}

export const strFor = (object, flag, seat) => {
  let regArr = [];
  if(isY(object.english)) {//英文
    if((isY(object.lowercase) && isY(object.uppercase)) || (!isY(object.lowercase) &&!isY(object.uppercase))) {
      regArr.push("a-zA-Z"); //不区分大小写
    }else {
      if(isY(object.lowercase)) {// 小写
        regArr.push("a-z");
      }
      if(isY(object.uppercase)) {// 大写
        regArr.push("A-Z");
      }
    }
  }
  
  if(isY(object.number)) {// 数字
    if(isY(object.nonzero)) {// 非零
      regArr.push("1-9");
    }else {
      regArr.push("0-9");
    }
  }

  if(isY(object.other) && object.otherVlue) {// 其他复选框   其他数值
    if(flag) {
      for(let i = 0, len = object.otherVlue.length; i < len; i++) {
        regArr.push(object.otherVlue[i]);
      }
    }else {
      regArr.push(object.otherVlue);
    }
  }

  if(flag){
    let start, end;
    let mustArr = regArr.map(item => {
      if(seat === "start") {
        start = item;
      }else if(seat === "end") {
        end = item;
      }
      return `[${item}]`
    })

    if(start) {
      let index = mustArr.indexOf(start);
      mustArr.splice(index, 1);
      mustArr.unshift(`^[${start}]`);
    }

    if(end) {
      let index = mustArr.indexOf(end);
      mustArr.splice(index, 1);
      mustArr.push(`[${end}]$`);
    }

    if(seat) {
      if(seat) {
        if(mustArr.length > 1) {
          console.log("字符开头或结尾校验规则定义错误");
        }
        return new RegExp(`${mustArr.join("")}`);
      }
    }else {
      return new RegExp(`${mustArr.join("{1,}")}{1,}`);
    }
  }else {
    return new RegExp(`[${regArr.join("")}]+`);
  }
}

// 校验字符串
export const checkString = (ruleOption, value) => {
  let message;
  let mustIn, mustContain, startWith, endWith;
  for(let key in ruleOption) {
    if(key === "mustIn" && JSON.stringify(ruleOption.mustIn) !== "{}") {//全部为[或]
      let reg = strFor(ruleOption.mustIn);
      console.log("全部为[或]", reg);
      mustIn = reg.test(value);
      if(!mustIn) {
        message = "不符合模板中 全部为[或] 定义的校验规则";
      }
    }
    if(key === "mustContain" && JSON.stringify(ruleOption.mustContain) !== "{}") {// 必须含字符[且]
      let reg = strFor(ruleOption.mustContain, true);
      console.log("必须含字符[且]", reg);
      mustContain = reg.test(value);
      if(!mustContain){
        message = "不符合模板中 必须含字符[且] 定义的校验规则";
      }
    }
    if(key === "startWith" && JSON.stringify(ruleOption.startWith) !== "{}") {// 字符开头
      let reg = strFor(ruleOption.startWith, true, "start");
      console.log("字符开头", reg);
      startWith = reg.test(value);
      if(!startWith) {
        message = "不符合模板中 字符开头 定义的校验规则";
      }
    }
    if(key === "endWith" && JSON.stringify(ruleOption.endWith) !== "{}") {// 字符结尾
      let reg = strFor(ruleOption.startWith, true, "end");
      console.log("字符结尾", reg);
      endWith = reg.test(value);
      if(!endWith) {
        message = "不符合模板中 字符结尾 定义的校验规则";
      }
    }
    if(key === "notContain" && JSON.stringify(ruleOption.notContain) !== "{}") {// 不包含字符
      if(isY(ruleOption.notContain.active)) {
        let reg = new RegExp(ruleOption.notContain.value);
        console.log("不可包含字符", reg);
        if (reg.test(value)) {
          message = `不可包含字符“${ruleOption.notContain.value}”`
        }
      }
    }
    if(key === "stringLength" && JSON.stringify(ruleOption.stringLength) !== "{}") {// 长度
      if (value.length < ruleOption.stringLength.min || value.length > ruleOption.stringLength.max) {
        message = `字符串长度为${ruleOption.stringLength.min}-${ruleOption.stringLength.max}`
      }
    }
    if(key === "otherLimit" && JSON.stringify(ruleOption.otherLimit) !== "{}") {// 附加限制
      // 不包含空格
      if(isY(ruleOption.otherLimit.notContainSpace)) {
        let regSpace = /(^\s+)|(\s+$)|\s+/g;
        if(regSpace.test(value)) {
          message = "附加限制: 不包含空格";
        }      
      }
      // 非数字  
      if(isY(ruleOption.otherLimit.notContainCN)) {
        let regCN = /\d/;
        if(regCN.test(value)) {
          message = "附加限制: 非数字";
        }       
      }

    }
  }

  if(ruleOption.message && ruleOption.message !== "") {
    message = ruleOption.message;
  }
  
  return message
}

