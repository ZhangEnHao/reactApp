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

// 校验字符串
export const checkString = (ruleOption, value) => {
  let message;
  let length = ruleOption.stringLength.split('-');
  if (value.length < length[0] || value.length > length[1]) {
    message = `字符串长度为${ruleOption.stringLength}`
  }
  if (ruleOption.firstCharacterLetter === 'Y') {
    if (!/^[a-zA-z]/.test(value)) {
      message = `字符串必须以字母开头`
    }
  }
  if (ruleOption.notContainsCharacters) {
    let reg = new RegExp(ruleOption.notContainsCharacters);
    if (reg.test(value)) {
      message = `不可包含字符“${ruleOption.notContainsCharacters}”`
    }
  }
  if (ruleOption.containsCharacters) {

    const regJson = {
      LOWERCASE: 'a-z',
      CAPITAL: 'A-Z',
      NUMBER: '0-9',
      CHARACTER: "~'!@#￥$%^&*()-+_=:"
    };

    let regStr = [];
    ruleOption.containsCharacters.forEach(item => {
      regStr.push(regJson[item])
    })

    let containsReg = new RegExp(`^[${regStr.join("")}]+$`);
    if(!containsReg.test(value)) {
      message = `需包含字符串“${ruleOption.containsCharacters}”`
    }
    

  }
  return message
}

