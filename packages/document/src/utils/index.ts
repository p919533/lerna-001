export function calcSize(size: number): string {
    return size / 100 + 'rem';
}
/**
 * 获取本地
 */
export function getItem(name: string) {
    const value: string | null = localStorage.getItem(name);
    if (!!value) {
        return JSON.parse(value);
    }
    return '';
}

/**
 * 存储本地
 */
export function setItem<T>(name: string, value: T) {
    const values = (
        typeof value === 'object' ? JSON.stringify(value) : value
    ) as string;
    localStorage.setItem(name, values);
}

/**
 * 删除本地
 */
export function removeItem(name: string) {
    localStorage.removeItem(name);
}

/**
 * 清空所有本地数据
 * */
export function clearItem() {
    localStorage.clear();
}

/**
 * 生成随机数
 */
export function uuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
}

/**
 * 转换base64
 * */
export function getBase64(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}
