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

  if(isY(object.other) && object.otherValue !== "") {// 其他复选框   其他数值
    let otherValues = object.otherValue.split(",");
    otherValues.forEach(value => {
      regArr.push(value);
    })
  }

  if(flag){
    let start, end;
    let mustArr = regArr.map(item => {
      if(seat === "start") {
        start = item;
      }else if(seat === "end") {
        end = item;
      }
      return `${item}`
    });
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
        // 开头或结尾
        return new RegExp(`${mustArr.join("")}`);
      }
    }else {
      // 必须含字符[且]
      let mustReg = mustArr.map(must => {
        return new RegExp(`[${must}]{1,}`);
      });
      return mustReg
    }
  }else {
    // 全部为[或]
    return new RegExp(`[${regArr.join("")}]`);
  }
}

// 校验字符串
export const checkString = (ruleOption, value) => {
  let message;
  let mustIn, startWith, endWith;
  for(let key in ruleOption) {
    if(key === "mustIn" && JSON.stringify(ruleOption.mustIn) !== "{}") {//全部为[或]
      let reg = strFor(ruleOption.mustIn);
      mustIn = reg.test(value);
      if(!mustIn) {
        message = "不符合模板中 全部为[或] 定义的校验规则";
        console.log(reg, message);
        if(ruleOption.message && ruleOption.message !== "") {
          message = ruleOption.message;
        }
      }
    }
    if(key === "mustContain" && JSON.stringify(ruleOption.mustContain) !== "{}") {// 必须含字符[且]
      let regList = strFor(ruleOption.mustContain, true);
      let flag = true;
      regList.forEach(reg => {
        let isMust = reg.test(value);
        if(!isMust) {
          flag = false;
        }
      });

      if(!flag){
        message = "不符合模板中 必须含字符[且] 定义的校验规则";
        console.log(regList, message);
        if(ruleOption.message && ruleOption.message !== "") {
          message = ruleOption.message;
        }
      }
    }
    if(key === "startWith" && JSON.stringify(ruleOption.startWith) !== "{}") {// 字符开头
      let reg = strFor(ruleOption.startWith, true, "start");
      startWith = reg.test(value);
      if(!startWith) {
        message = "不符合模板中 字符开头 定义的校验规则";
        console.log(reg, message);
        if(ruleOption.message && ruleOption.message !== "") {
          message = ruleOption.message;
        }
      }
    }
    if(key === "endWith" && JSON.stringify(ruleOption.endWith) !== "{}") {// 字符结尾
      let reg = strFor(ruleOption.endWith, true, "end");
      endWith = reg.test(value);
      if(!endWith) {
        message = "不符合模板中 字符结尾 定义的校验规则";
        console.log(reg, message);
        if(ruleOption.message && ruleOption.message !== "") {
          message = ruleOption.message;
        }
      }
    }
    if(key === "notContain" && JSON.stringify(ruleOption.notContain) !== "{}") {// 不包含字符
      if(isY(ruleOption.notContain.active)) {
        let notContainList = ruleOption.notContain.value.split(",");
        let flag = false;
        notContainList.forEach(notContain => {
          let reg = new RegExp(notContain);
          if (reg.test(value)) {
            flag = true;
          }
        })
        if (flag) {
          message = `不可包含字符“${ruleOption.notContain.value}”`;
          console.log(notContainList, message);
          if(ruleOption.message && ruleOption.message !== "") {
            message = ruleOption.message;
          }
        }
      }
    }
    if(key === "stringLength" && JSON.stringify(ruleOption.stringLength) !== "{}") {// 长度
      if (value.length < ruleOption.stringLength.min || value.length > ruleOption.stringLength.max) {
        message = `字符串长度为${ruleOption.stringLength.min}-${ruleOption.stringLength.max}`;
        console.log(message);
        if(ruleOption.message && ruleOption.message !== "") {
          message = ruleOption.message;
        }
      }
    }
    if(key === "otherLimit" && JSON.stringify(ruleOption.otherLimit) !== "{}") {// 附加限制
      // 不包含空格
      if(isY(ruleOption.otherLimit.notContainSpace)) {
        let regSpace = /(^\s+)|(\s+$)|\s+/g;
        if(regSpace.test(value)) {
          message = "附加限制: 不包含空格";
          console.log(message);
          if(ruleOption.message && ruleOption.message !== "") {
            message = ruleOption.message;
          }
        }      
      }
      // 非数字  
      if(isY(ruleOption.otherLimit.notContainCN)) {
        let regCN = /[\u4e00-\u9fa5]/;
        if(regCN.test(value)) {
          message = "附加限制: 非汉字";
          console.log(message);
          if(ruleOption.message && ruleOption.message !== "") {
            message = ruleOption.message;
          }
        }       
      }

    }
  }
  
  return message
}

