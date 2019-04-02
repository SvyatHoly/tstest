import React from 'react';
import ColorBar from "./ColorBar";

export default function tableBody({data}) {
    return data.map((el, i) => {
        return (
            <tr key={i}>
                {el.map((item, index) => {
                    if (index === el.length - 1) {
                        return <td key={index}><ColorBar percantage={item}/></td>;
                    }
                    return <td key={index}>{item}</td>;
                })
                }
            </tr>
        );
    });
}
