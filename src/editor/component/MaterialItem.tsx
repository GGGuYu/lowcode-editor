import { useEffect, useRef } from "react";
import { useDrag } from "react-dnd";

interface MaterialItemProps {
    name:string,
    desc:string,
}

export function MaterialItem({ name , desc } : MaterialItemProps) {

    const divRef = useRef<HTMLDivElement>(null);

    const [_ , drag] = useDrag({
        type:name,
        item:{
            type:name,
            dragType:'add',
            id:-1
        }
    });

    useEffect(() => {
        drag(divRef);
    } , [])

    return <div
            ref={divRef} 
            className='
            border-dashed
            border-[1px]
             border-[#000]
            py-[8px] px-[10px]
            m-[10px]
            cursor-move
            inline-block
             bg-white
             hover:bg-[#ccc]
        '
    >
     {desc}   
    </div>
}