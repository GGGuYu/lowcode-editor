// Allotment引入一下，可以拖动的pane
import { Allotment } from "allotment";
import 'allotment/dist/style.css';
//组件
import { Header } from "./component/Header";
import { EditArea } from "./component/EditArea";
import { Setting } from "./component/Setting";
import { MaterialWrapper } from "./component/MaterialWrapper";
import { Preview } from "./component/Preview";
import { useComponentsStore } from "./stores/components";

export default function LowcodeEditor() {

    const { mode } = useComponentsStore();

    return <div className='h-[100vh] flex flex-col'>
        <div className='h-[60px] flex items-center border-b-[1px] border-[#000]'>
           <Header></Header>
        </div>
        {
            mode === 'edit' ? (
                <Allotment>
                    <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
                        <MaterialWrapper />
                    </Allotment.Pane>
                    <Allotment.Pane>
                        <EditArea></EditArea>
                    </Allotment.Pane>
                    <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
                        <Setting></Setting>
                    </Allotment.Pane>
                </Allotment>
            ) : <Preview />
            
        }
    </div>
}