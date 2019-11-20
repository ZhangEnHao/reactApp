import ajax from './ajax'

const BASE = "";
// 查询变更申请
export const reqDataOne = () => ajax(`${BASE}/api/DataOne`);

