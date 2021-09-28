import { createFromIconfontCN } from '@ant-design/icons';

export const IconFont = createFromIconfontCN({
    scriptUrl: '/font_2103210_1pqutj2s0eb.js'
});

interface Props {
    // 样式
    style?: React.CSSProperties;
    // 类别
    type: string;
    // 颜色
    color?: string;
    // 其他
    [key: string]: any;
}

export function Icon(props: Props) {
    const { style, type, color, ...rets } = props;
    const propsStyle = {
        color: color ? color : '#0b80fd',
        fontSize: '0.18rem',
        ...style
    };
    return <IconFont type={type} style={propsStyle} {...rets} />;
}
