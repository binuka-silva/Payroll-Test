import React, {useRef, useState} from 'react'

import ReactCrop, {centerCrop, makeAspectCrop,} from 'react-image-crop'
import {canvasPreview} from '../common/imageUpload/canvasPreview'
import {useDebounceEffect} from '../hooks/useDebounceEffect'

import 'react-image-crop/dist/ReactCrop.css'
import {Button} from "react-bootstrap";

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.
function centerAspectCrop(
    mediaWidth,
    mediaHeight,
    aspect,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export default function ImageCropUpload({
                                            imgSrc,
                                            setImgSrc,
                                            aspect = 1,
                                            scale = 1,
                                            rotate = 0
                                        }) {
    const previewCanvasRef = useRef();
    const imgRef = useRef();
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();

    //References
    //https://codesandbox.io/s/react-image-crop-demo-with-react-hooks-y831o?file=/src/App.tsx:0-4243;
    //https://www.npmjs.com/package/react-image-crop

    function onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined) // Makes crop preview update between images.
            const reader = new FileReader()
            reader.addEventListener('load', () =>
                setImgSrc(reader.result?.toString() || ''),
            )
            reader.readAsDataURL(e.target.files[0])
        }
    }

    function onImageLoad(e) {
        if (aspect) {
            const {width, height} = e.currentTarget
            setCrop(centerAspectCrop(width, height, aspect))
        }
    }

    useDebounceEffect(
        async () => {
            if (
                completedCrop?.width &&
                completedCrop?.height &&
                imgRef.current &&
                previewCanvasRef.current
            ) {
                // We use canvasPreview as it's much faster than imgPreview.
                await canvasPreview(
                    imgRef.current,
                    previewCanvasRef.current,
                    completedCrop,
                    scale,
                    rotate,
                )
            }
        },
        100,
        [completedCrop, scale, rotate],
    )

    return (
        <div className="ImageCropUpload d-flex gap-2">
            <div className="Crop-Controls">
                <div className="col d-flex justify-content-end align-items-end">
                    <div className="row row-xs mb-3">
                        <div className="col-md-1">
                            <label htmlFor="upload-single-file">
                                <Button className="btn-secondary btn-sm" as="span">
                                    <div className="flex flex-middle">
                                        <i className="i-Share-on-Cloud"> </i>
                                        <span>Browse</span>
                                    </div>
                                </Button>
                            </label>
                            <input
                                className="d-none"
                                onChange={onSelectFile}
                                id="upload-single-file"
                                accept="image/x-png,image/jpeg"
                                type="file"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {!!imgSrc && (
                <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    style={{display: "flex", width: "50%"}}
                    aspect={aspect}
                >
                    <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        style={{transform: `scale(${scale}) rotate(${rotate}deg)`}}
                        onLoad={onImageLoad}
                    />
                </ReactCrop>
            )}
            <div>
                {!!completedCrop && (
                    <canvas
                        ref={previewCanvasRef}
                        style={{
                            border: '1px solid black',
                            objectFit: 'contain',
                            width: completedCrop.width,
                            height: completedCrop.height,
                        }}
                    />
                )}
            </div>
        </div>
    )
}
