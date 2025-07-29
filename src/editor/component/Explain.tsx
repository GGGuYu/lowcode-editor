export function Explain() {
    return (
        <div style={{ 
            fontFamily: 'Arial, sans-serif', 
            lineHeight: '1.6', 
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>拖拽物料</div>
                <div style={{ paddingLeft: '15px' }}>
                    <div>1. 左侧物料区，拖拽到画布区</div>
                    <div>2. 画布区拖拽组件，换位置</div>
                </div>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
            
            <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>组件编辑</div>
                <div style={{ paddingLeft: '15px' }}>
                    <div>1. 点击组件，右上角删除</div>
                    <div>2. 右侧栏，编辑属性、样式、自定义样式、事件</div>
                </div>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
            
            <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>事件绑定和组件联动</div>
                <div style={{ paddingLeft: '15px' }}>
                    <div>- 拖拽一个容器，在容器内放一个按钮1：打开弹窗</div>
                    <div>- 拖拽一个弹窗1</div>
                    <div>- 拖拽一个容器 放一个新按钮2：消息提示</div>
                    <div>- 给按钮1 绑定打开弹窗1 的事件</div>
                    <div>- 给弹窗1 绑定关闭弹窗1 的事件</div>
                    <div>- 给按钮2 绑定消息提示 事件</div>
                    <div>- 点击预览，测试功能</div>
                </div>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
            
            <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>自定义JS事件</div>
                <div style={{ paddingLeft: '15px' }}>
                    <div>1. 用一个按钮，输入 
                        <code style={{
                            background: '#f5f5f5',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontFamily: 'monospace',
                            fontSize: '0.9em',
                            border: '1px solid #ddd'
                        }}>alert(context.name)</code> 试试
                    </div>
                    <div>2. 可以自定义JS执行，context为内置参数，如下您可以访问</div>
                    <pre style={{ 
                        background: '#f5f5f5', 
                        padding: '10px', 
                        borderRadius: '4px', 
                        overflowX: 'auto',
                        marginTop: '10px'
                    }}>
                        {`{
    name: component.name,
    props: component.props,
    showMessage(content: string) {
        message.success(content);
    }
}`}
                    </pre>
                </div>
            </div>
            
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
            
            <div>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>表格</div>
                <div style={{ paddingLeft: '15px' }}>
                    <div>1. 拖拽添加表格列</div>
                    <div>2. 字段填写name,age,job,在表格没有填写url的时候，会有测试数据</div>
                </div>
            </div>
        </div>
    );
}