import React, { useEffect, useMemo, useState } from "react";
import { type CommonComponentProps } from "../types"
import { Table as AntdTable } from "antd";
import dayjs from "dayjs";
import axios from "axios";

function TableProd({ url , children }:CommonComponentProps) {
    //从url接口获取数据以后，渲染就行了,这个数据是数组，每一行是一个obj
    //一个数组，每一个元素都是一个对象，这个对象里面都是string:any
    const [data , setData] = useState<Array<Record<string , any>>>([]);
    //loading，算是一种懒加载吧，就是在等待数据
    const [loading , setLoading] = useState(false);

    //异步初始化函数
    const getData = async () => {
        if(url){
            setLoading(true);
            const {data} = await axios.get(url);
            setData(data);

            setLoading(false);
        } else {
            console.log('进来了');
            setLoading(true);
            setData([
                {
                    id:1,
                    name:'张三',
                    age:18,
                    job:'法外狂徒'
                },
                {
                    id:2,
                    name:'李四',
                    age:23,
                    job:'学生'
                }
            ])
            setLoading(false);
        }
    }

    //异步初始化
    useEffect(() => {
        getData();
    } , [])

    const columns = useMemo(() => {
        return React.Children.map(children , (item:any) => {
            if(item?.props?.type === 'date') {
                return {
                    title:item.props?.title,
                    dataIndex:item.props?.dataIndex,
                    //日期值要做额外处理
                    render:(value:any) => value ? dayjs(value).format('YYYY-MM-DD') : null,
                }
            } else {
                return {
                    title:item.props?.title,
                    dataIndex:item.props?.dataIndex,
                }
            }
        })
    } , [children])

    return (
        <AntdTable 
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey='id'
            loading={loading}
        />
    )

}


export default TableProd;