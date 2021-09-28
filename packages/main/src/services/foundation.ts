import { Http, Data } from './http';
import cookie from 'react-cookies';
const api = new Http();

const service = 'bosfoundationservice';

interface ParamsType {
    appKey: string | null;
    className?: string;
    type?: 'doc' | 'edge';
    params?: any;
    data?: any;
    attrName?: string;
}

/**
 * 获取对象类
 */
export const getModelDoc = ({ appKey }: ParamsType) =>
    api.get(
        `${service}/${appKey}/datamodel/base/doc`,
        {},
        { noErrorHandle: true }
    );

/**
 * 获取关系类
 */
export const getModelEdge = ({ appKey }: ParamsType) =>
    api.get(
        `${service}/${appKey}/datamodel/base/edge`,
        {},
        { noErrorHandle: true }
    );

/**
 * 获取类信息
 */
export const getClassInfo = ({ appKey, className }: ParamsType) =>
    api.get(
        `${service}/${appKey}/datamodel/${className}`,
        {},
        { noErrorHandle: true }
    );

/**
 * 获取搜索类名联想提示
 */
export const getSearchTips = ({ appKey, params }: ParamsType) =>
    api.get(
        `${service}/${appKey}/datamodel/getClassByClassName`,
        { params },
        { noErrorHandle: true }
    );

/**
 * 检查类是否存在
 */
export const existCheck = ({ appKey, className }: ParamsType) =>
    api.get(`${service}/${appKey}/datamodel/exist/${className}`, {});

/**
 * 检查对象属性是否存在
 */
export const existAttrCheck = ({ appKey, params }: ParamsType) =>
    api.get(`${service}/${appKey}/datamodel/existAttr`, { params });

/**
 * 编辑对象名或描述 classDefinition
 * 新增属性 attribute
 * 新增属性组 attributeGroup
 */
export const editClassDefinition = ({ appKey, className, data }: ParamsType) =>
    api.post(
        `${service}/${appKey}/datamodel/update/${className}`,
        { data },
        { noErrorHandle: true }
    );

/**
 * 获取对象类类级权限
 */
export const getClassGacl = ({ appKey, className }: ParamsType) =>
    api.get(
        `${service}/${appKey}/datamodel/class-gacl/${className}`,
        {},
        { noErrorHandle: true }
    );

/**
 * 开启、关闭类级权限
 */
export const gaclOption = ({
    appKey,
    className,
    gaclType
}: ParamsType & { gaclType: 'open' | 'close' }) =>
    api.put(
        `${service}/${appKey}/datamodel/class-gacl/${className}/${gaclType}`,
        {},
        { noErrorHandle: true }
    );

/**
 * 编辑权限（给人员授权）
 */
export const editClassGacl = ({ appKey, className, data }: ParamsType) =>
    api.post(
        `${service}/${appKey}/datamodel/class-gacl/${className}`,
        { data },
        { noErrorHandle: true }
    );

/**
 * 获取可选人员
 */
export const getUsers = ({ appKey, data }: ParamsType) =>
    api.post(
        `${service}/${appKey}/users/getUsers`,
        { data },
        { noErrorHandle: true }
    );

/**
 * 获取子类
 */
export const getChildNodes = ({ appKey, className }: ParamsType) =>
    api.get(
        `${service}/${appKey}/datamodel/childof/${className}`,
        {},
        { noErrorHandle: true }
    );

/**
 * 删除类
 */
export const removeClass = ({ appKey, className }: ParamsType) =>
    api.get(
        `${service}/${appKey}/datamodel/del/${className}`,
        {},
        { noErrorHandle: true }
    );

/**
 * 创建类(对象类、关联关系)
 */
export const addClass = ({ appKey, type, data }: ParamsType) =>
    api.post(
        `${service}/${appKey}/datamodel/insert/${type}`,
        { data },
        { noErrorHandle: true }
    );

/**
 * 检查属性是否可添加
 */
export const checkAttr = ({ appKey, className, attrName }: ParamsType) =>
    api.get(
        `${service}/${appKey}/datamodel/setAttributeOk/${className}/${attrName}`,
        {}
    );

/**
 * 检查属性组是否可添加
 */
export const checkAttrGroup = ({ appKey, className, attrName }: ParamsType) =>
    api.get(
        `${service}/${appKey}/datamodel/setGroupAttributeOk/${className}/${attrName}`,
        {}
    );

/**
 * 编辑|删除类属性 提交整个classInfo
 */
export const editClassAttr = ({ appKey, className, data }: ParamsType) =>
    api.post(
        `${service}/${appKey}/datamodel/replace/${className}`,
        {
            params: {
                oper_attr: 'replace'
            },
            data
        },
        { noErrorHandle: true }
    );

/**
 * 导出数据模型
 */
export const exportDataModel = ({ appKey }: ParamsType) => {
    const access_token = cookie.load('accessToken');
    const exportUrl = `${window.bosapp.baseUrl}${service}/${appKey}/datamodel/exportDataModel?access_token=${access_token}`;
    var aElement = document.createElement('a');
    aElement.href = exportUrl;
    var evt = document.createEvent('MouseEvents');
    evt.initEvent('click', true, true);
    aElement.dispatchEvent(evt);
};

/**
 * 导入数据模型
 */
export const importDataModelParams = ({ appKey }: ParamsType) => {
    const action = `${window.bosapp.baseUrl}${service}/${appKey}/datamodel/importDataModel`;
    let headers: any = {};
    const accessToken = cookie.load('accessToken');
    if (accessToken) headers.Authorization = accessToken;
    return {
        action,
        headers
    };
};

/**
 * 获取关系类左右关系
 */
export const getIrObject = ({ appKey, className }: ParamsType) =>
    api.get(
        `${service}/${appKey}/datamodel/getIrObject/${className}`,
        {},
        { noErrorHandle: true }
    );

/**
 * 获取可选父关系类
 */
export const getUsableParent = ({ appKey, className }: ParamsType) =>
    api.get(
        `${service}/${appKey}/datamodel/getUsableParent/${className}`,
        {},
        { noErrorHandle: true }
    );
