import React, { useEffect, useMemo, useRef } from "react";
import { useMaterailDrop } from "../../hooks/useMaterialDrop";
import type { CommonComponentProps } from "../types";
import { useDrag } from "react-dnd";
import { Table as AntdTable } from "antd";

function TableDev({ id , name , children , styles }:CommonComponentProps) {
    const divRef = useRef<HTMLDivElement>(null);

    //表格组件只能往里面放TableColum组件
    const {canDrop , drop} = useMaterailDrop(['TableColumn'] , id); 

    const [_ ,drag] = useDrag({
        type:name,
        item:{
            type:name,
            dragType:'move',
            id:id
        }
    });

    useEffect(() => {
        drop(divRef);
        drag(divRef);
    })

    //chrildren会被计算成colums来渲染，而不是直接渲染chrildren
    //通过遍历children,然后每个都变成一个obj存在columns里面，然后渲染columns
    //而他的孩子TableColum都是假的，只是我们拿他的参数，然后组成一个columns数组而已
    const columns = useMemo(() => {
        return React.Children.map(children , (item:any) => {
            return {
                title:<div className="m-[16px] p-[16px]" data-component-id={item.props?.id}>{item.props?.title}</div> ,
                dataIndex:item.props?.dataIndex,
                key:item
            }
        })
    } , [children])

    return(
        <div
            className={`w-[100%] ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] #000'}`} 
            ref={divRef}
            data-component-id={id}
            style={styles}
        >
            <AntdTable 
                columns={columns} //列名
                dataSource={[]} //每一行数据
                pagination={false} 
            />            
        </div>
    )

}

export default TableDev;