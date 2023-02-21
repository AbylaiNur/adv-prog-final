import React from 'react';
import {ProgressBar} from "react-bootstrap";


function ImageResult({imageUrl, classMap, result}) {


    return (
            <div style={{paddingLeft: '120px', marginBottom: '20px', display: 'flex'}}>
                <img style={{ marginRight: '20px'}} height={300} src={imageUrl}/>
                <div style={{ marginRight: '20px'}}>
                    {Object.keys(classMap).map((key) => {
                        return <div style={{ marginBottom : '3px' }} >{ classMap[key] } </div>
                    })}
                </div>
                <div style={{width: '150px', paddingTop: '7px'}}>
                    {Object.keys(classMap).map((key) => {
                        return <ProgressBar style={{ marginBottom : '11px' }} now={Math.round(result[key] * 100)} label={`${Math.round(result[key] * 100)}%`} />
                    })}
                </div>
            </div>
    );
}

export default ImageResult;