import { type CommonComponentProps } from "../types";


//不用带 border，也不用处理 drop 事件。
const ContainerProd = ({ children, styles }: CommonComponentProps) => {

    return (
        <div 
            style={styles}
            className={`p-[20px]`}
        >{children}</div>
    )
}

export default ContainerProd;
