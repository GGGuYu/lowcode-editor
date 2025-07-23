import { Button , Space } from "antd";
import { useComponentsStore } from "../stores/components";

//可以切换编辑模式或者是预览编辑结果
export function Header() {

    const { mode , setMode , setCurComponentId } = useComponentsStore();

    return (
        <div className="w-[100%] h-[100%]">
            <div className="h-[50px] flex justify-center items-center px-[30px]">
                <div>低代码编辑器</div>
                <div className="flex-1"></div>
                <Space>
                    {
                        mode === 'edit' && (
                            <Button onClick={() => {
                                setMode('preview');
                                setCurComponentId(null);//每次重新进入编辑模式
                            }}
                                type="primary"
                            >
                                预览
                            </Button>
                        )
                    }
                    {
                        mode === 'preview' && (
                            <Button
                                onClick={() => setMode('edit')}
                                type="primary"
                            >
                                退出预览
                            </Button>
                        )
                    }
                </Space>
            </div>
        </div>
    )

    return <div>Header</div>
}