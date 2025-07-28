import { type CommonComponentProps } from "../types";

//pord不用带 h-[100%] 了，这个只是编辑的时候需要,也不需要处理dorp
function PageProd({ children, styles }: CommonComponentProps) {

    return (
        <div
            className='p-[20px]'
            style={{ ...styles }}
        >
            {children}
        </div>
    )
}

export default PageProd;
