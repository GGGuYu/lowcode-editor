import { useMemo } from "react";
import { useComponentsStore } from "../stores/components"

export function Source() {
    const {components} = useComponentsStore();

    const source = useMemo(() => {
        return JSON.stringify(components, null, 2);
    }, [components])

    return (
        <div style={{
            maxHeight: '90vh',  // 设置最大高度
            overflow: 'auto',     // 启用滚动条
            border: '1px solid #ddd', // 添加边框
            borderRadius: '4px',  // 圆角
            padding: '8px',       // 内边距
            backgroundColor: '#f5f5f5', // 背景色
            marginTop:5,
        }}>
            <pre style={{
                margin: 0,        // 移除默认边距
                whiteSpace: 'pre-wrap', // 允许换行
                wordBreak: 'break-all'  // 防止长内容溢出
            }}>
                {source}
            </pre>
        </div>
    )
}