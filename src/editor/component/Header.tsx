import { Button , Space } from "antd";
import { useComponentsStore } from "../stores/components";
import ModalProd, { type ModalRef } from "../Material/Modal/prod";
import { useCallback, useRef } from "react";
import { Explain } from "./Explain";

//可以切换编辑模式或者是预览编辑结果
export function Header() {

    const { mode , setMode , setCurComponentId } = useComponentsStore();
    const modalApiRef = useRef<ModalRef>(null);

    const handleShowUseClick = useCallback(() => {
        modalApiRef.current?.open();
    } , [])

    return (
        <div className="w-[100%] h-[100%]">
            <div className="h-[50px] flex justify-center items-center px-[30px]">
                <div className="flex items-center gap-[20px]">
                    <span>低代码编辑器</span>
                    <Button danger onClick={handleShowUseClick}>使用引导</Button>
                </div>
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
            <ModalProd
                ref={modalApiRef}
                title='使用引导'
                onOk={() => modalApiRef.current?.close()}
                onCancel={() => modalApiRef.current?.close()}
            >
                <Explain></Explain>
            </ModalProd>
        </div>
    )

    return <div>Header</div>
}