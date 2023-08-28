import {Button} from "react-bootstrap";
import React from "react";

const ImageUpload = ({imgSrc, setImgSrc, imageOnChange, defaultImagePath, alt = "image", className}) => {

    return (
        <div className={`${className} d-flex`}>
            <img
                className="col"
                alt={alt}
                width="10%"
                src={imgSrc}
            />
            <div className="col d-flex justify-content-end align-items-center">
                <div className="row row-xs mb-3">
                    <div className="col-md-1">
                        <label htmlFor={defaultImagePath}>
                            <Button className="btn-secondary btn-sm" as="span">
                                <div className="flex flex-middle">
                                    <i className="i-Share-on-Cloud"> </i>
                                    <span>Browse</span>
                                </div>
                            </Button>
                        </label>
                        <input
                            className="d-none"
                            onChange={imageOnChange}
                            id={defaultImagePath}
                            accept="image/x-png,image/jpeg"
                            type="file"
                        />
                    </div>
                </div>
                <Button className="btn-secondary btn-sm default-btn" onClick={() => setImgSrc(defaultImagePath)}>
                    Set Default
                </Button>
            </div>
        </div>
    )
}

export default ImageUpload;
