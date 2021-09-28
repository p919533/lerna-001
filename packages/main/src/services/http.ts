import axios, { CancelToken, Method, ResponseType } from 'axios';
import { getItem, clearItem } from 'utils/index';
import cookie from 'react-cookies';
import { message } from 'antd';
const querystring = require('querystring');

function getHeader() {
    let headers: any = {
        'content-type': 'application/json'
    };
    //登录的token只放在了cookie，暂时从cookie拿
    let accessToken = cookie.load('accessToken');
    if (accessToken) {
        headers.Authorization = accessToken;
    }
    return headers;
}

export interface Data {
    // 请求参数 拼接到url后面
    params?: any;
    // body
    data?: any;
}

export interface Opts {
    // 默认地址
    baseUrl?: string;
    // 请求方式
    method?: Method;
    // 服务器响应的数据类型
    responseType?: ResponseType;
    // 发送的自定义请求头
    headers?: any;
    // 取消axios的请求
    cancelToken?: CancelToken;
    // 是否返回code
    noErrorHandle?: boolean;
    // 允许为上传处理进度事件;
    onUploadProgress?: any;
}

/**
 * 封装实体的 API 接口调用相关操作
 */

export class Http {
    request(url: string, data: Data = {}, opts: Opts = {}) {
        return new Promise<any>((resolve, reject) => {
            const {
                method = 'get',
                responseType = 'json',
                headers = {},
                cancelToken,
                onUploadProgress
            } = opts;
            let newUrl = interpolate(url, {
                appKey: getItem('appKey')
            });
            axios({
                url: newUrl,
                baseURL: window.bosapp.baseUrl,
                method,
                timeout: 100000000,
                responseType,
                cancelToken,
                onUploadProgress,
                headers: {
                    ...getHeader(),
                    ...headers
                },
                ...data
            })
                .then((res: any) => {
                    const { status, data, headers } = res;
                    if (status < 300 && status >= 200) {
                        if (
                            headers['content-type'] ===
                            'application/octet-stream'
                        ) {
                            const parse = querystring.parse(
                                headers['content-disposition'],
                                ';',
                                '='
                            );
                            const filename: string = parse.filename
                                ? parse.filename
                                : parse.fileName;
                            return resolve({ filename, data } as any);
                        }
                        // 返回数组
                        // if (Array.isArray(data)) {
                        //     return resolve(data);
                        // }
                        // 是否需要返回提示
                        if (opts.noErrorHandle) {
                            return resolve(data);
                        }
                        if (data.code === 'SUCCESS') {
                            return resolve(data.data);
                        } else {
                            return reject(data);
                        }
                    }
                    return reject(data);
                })
                .catch((err: any) => {
                    const response = err.response;
                    if (response) {
                        if (response.status === 401) {
                            //token失效
                            message.error('您的登陆已过期，请重新登陆');
                            cookie.remove('accessToken');
                            cookie.remove('bos_access_token');
                            clearItem();
                            // redirect('/login');
                        }
                        return reject(response.data);
                    }
                    // 中止请求
                    else if (err && err.message !== 'abort') {
                    }
                    // return reject(response.data);
                });
        });
    }

    get(url: string, data?: Data, opts?: Opts) {
        return this.request(url, data, {
            method: 'get',
            ...opts
        });
    }
    delete(url: string, data?: Data, opts?: Opts) {
        return this.request(url, data, {
            ...opts,
            method: 'delete'
        });
    }
    put(url: string, data?: Data, opts?: Opts) {
        return this.request(url, data, {
            ...opts,
            method: 'put'
        });
    }
    post(url: string, data: Data = {}, opts?: Opts) {
        return this.request(url, data, {
            ...opts,
            method: 'post'
        });
    }
    postForm(url: string, data: Data, opts?: Opts) {
        let formData = new FormData();
        Object.keys(data.data).forEach((key) => {
            formData.append(key, data.data[key]);
        });
        data.data = formData;
        return this.request(url, data, {
            method: 'post',
            headers: {
                'content-type': 'multipart/form-data'
            },
            ...opts
        });
    }
}

export function interpolate(
    text: string,
    context: any,
    reg: RegExp = /{{([^}]+)}}/
) {
    let result = text;

    while (reg.test(result)) {
        let expr = RegExp.$1;
        let keys = expr.trim().split('.');
        let value = context;
        for (let key of keys) {
            value = value[key];
            if (!value) {
                value = '';
                break;
            }
        }
        result = result.replace(reg, value.toString().replace(/\//, '') || '');
    }

    return result;
}
