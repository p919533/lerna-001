import cookie from 'react-cookies';
import { Http, Opts, Data } from './http';
const api = new Http();

const service = 'boscenterservice';

/**
 * 登录
 */
export const login = (data: Data) => {
    return api.postForm(`${service}/account/login`, data);
};

/**
 * 登出
 * @param data
 * @returns
 */
export const logout = (data?: Data, opts?: Opts) => {
    return api.get(`${service}/account/logout`, data, {
        noErrorHandle: true
    });
};

// 注册
export function register(data: Data) {
    return api.post(`/${service}/account/regist`, data, {
        noErrorHandle: true
    });
}

/**
 * 通过接口获取 wx url 字段
 */
export const getWxLoginType = (data: Data, opts?: Opts) => {
    return api.get(`${service}/account/getWxLoginType`, data, {
        noErrorHandle: true
    });
};

/**
 * 生成微信二维码 url
 */
export const getUrl = (data: Data, opts = {}) => {
    return api.post(`${service}/account/getThirdURL`, data, {
        noErrorHandle: true
    });
};

/**
 * 3.1.17根据uuid或openID获取用户信息
 */
export const getUserInfo = (data: Data) => {
    return api.get(`${service}/account/getUserInfo`, data, {
        noErrorHandle: true
    });
};

/**
 * 3.1.23 上传用户头像
 * @param data
 * @param opts
 * @returns fileKey
 */
export const updateUserAvatar = (data: Data, opts?: Opts) => {
    return api.postForm(`${service}/account/avatar`, data, {
        noErrorHandle: true
    });
};

/**
 * 3.3.5 获取用户创建的所有APP
 * @param data
 * @returns
 */
export const getUserApps = (data: Data, opts?: Opts) => {
    return api.post(`${service}/account/app/getUserApps`, data, {
        noErrorHandle: true
    });
};

// 发送手机/邮箱验证码
export function accountValidateCode(data: Data) {
    return api.postForm(`/${service}/account/validateCode`, data, {
        noErrorHandle: true
    });
}

/**
 * 模糊查询, 用于检查手机号码是否之前注册过账号
 * @method fuzzyQuery
 * @param; telephone
 * @return Promise
 */
export function getUsersCheck(data: Data) {
    return api.get(`${service}/users/check`, data);
}

/**
 * 检查手机号之前是否绑定过第三方账号
 * @method checkPhoneBindThird
 * @param; telephone, type
 * @return Promise
 */
export function checkPhoneBindThird(data: Data) {
    return api.get(`${service}/account/isThirdBound`, data);
}

/**
 * 通过第三方登录
 * @method thirdUpdateUser
 * @param telephone, openId, type, phoneCode, appKey
 * @return {Promise}
 */
export const thirdUpdateUser = (data: Data) => {
    return api.post(`${service}/account/thirdUpdateUser`, data);
};

// 校验用户名/手机号/邮箱存在性
export function accountCheck(data: Data) {
    return api.get(`/${service}/account/check`, data, {
        noErrorHandle: true
    });
}

// 校验验证码
export function accountCheckValidateCode(data: Data) {
    return api.postForm(`/${service}/account/check/validateCode`, data, {
        noErrorHandle: true
    });
}

// 修改密码
export function accountSetPassword(data: Data) {
    return api.postForm(`/${service}/account/resetPassword`, data, {
        noErrorHandle: true
    });
}

/**
 * 修改用户：公司，姓名等
 * @param data
 * @returns
 */
export function accountUpdateUser(data: Data) {
    return api.post(`/${service}/account/updateUser`, data, {
        noErrorHandle: true
    });
}

/**
 * 3.1.8旧密码校验（发布）
 * @param {*} param
 */
export const checkPassword = (data: Data) => {
    return api.postForm(`${service}/account/check/password`, data, {
        noErrorHandle: true
    });
};

/**
 * 3.1.9修改密码（发布）
 * @param {*} param
 */
export const updatePassword = (data: Data) => {
    return api.postForm(`${service}/account/update/password`, data);
};

// 3.1.10修改用户（发布）
export function updateUser(data: Data) {
    return api.post(`/${service}/account/updateUser`, data);
}

/**
 * 根据token获取用户信息
 * @param {*} param
 */
export const getUserByToken = () => {
    return api.get(`${service}/account/getUser/${cookie.load('accessToken')}`);
};

/**
 * 是否撤销申请
 * */
export const cancellation = ({ data }: Data) => {
    return api.delete(`${service}/account/app/publish?key=${data}`, { data });
};

/**
 * 获取管理员所有APP
 * @param data
 */
export const adminGetApps = (data: Data, opts?: Opts) => {
    return api.post(`${service}/admin/app`, data, {
        noErrorHandle: true
    });
};

/**
 * 管理员审核应用同意
 * @param data
 */
export const adminAppAgree = (data: Data, opts?: Opts) => {
    return api.postForm(`${service}/admin/app/agree`, data, {
        noErrorHandle: true
    });
};

/**
 * 管理员审核应用拒绝
 * @param data
 */
export const adminAppReject = (data: Data, opts?: Opts) => {
    return api.postForm(`${service}/admin/app/reject`, data, {
        noErrorHandle: true
    });
};

/**
 * 管理员审核应用下架
 * @param data
 */
export const adminAppUnpublish = (data: Data, opts?: Opts) => {
    return api.postForm(`${service}/admin/app/unpublished`, data, {
        noErrorHandle: true
    });
};

/**
 * 获取账号列表
 * @param data
 */
export const adminGetUsers = (data: Data, opts?: Opts) => {
    return api.post(`${service}/admin/account/getUserList`, data, {
        noErrorHandle: true
    });
};

/**
 * 管理员创建账号
 * @param data
 */
export const adminCreateUser = (data: Data, opts?: Opts) => {
    return api.post(`${service}/admin/account/create`, data, {
        noErrorHandle: true
    });
};

/**
 * 冻结账号
 * @param data
 */
export const adminFreezeUser = (data: Data, opts?: Opts) => {
    return api.delete(`${service}/admin/account/${data.data.name}`, data, {
        noErrorHandle: true
    });
};

/**
 * 解冻账号
 * @param data
 */
export const adminUnFreezeUser = (data: Data, opts?: Opts) => {
    return api.put(`${service}/admin/account/${data.data.name}`, data, {
        noErrorHandle: true
    });
};

/**
 * 编辑账号
 * @param data
 */
export const adminEditUser = (data: Data, opts?: Opts) => {
    return api.post(`${service}/admin/account`, data, {
        noErrorHandle: true
    });
};

/**
 * 账号重设密码
 * @param data
 */
export const adminResetUserPwd = (data: Data, opts?: Opts) => {
    return api.postForm(`${service}/admin/account/reset/password`, data, {
        noErrorHandle: true
    });
};

/**
 * 导出用户
 * @param data
 */
export const adminExportUsers = (data: Data, opts?: Opts) => {
    return api.post(`${service}/admin/account/exportUserList`, data, {
        ...opts,
        noErrorHandle: true
    });
};
