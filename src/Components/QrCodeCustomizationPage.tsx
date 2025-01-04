
import React, { useState, useRef, useEffect } from 'react';
import QRCodeStyling from 'qr-code-styling';
import './QrCodeCustomizationPage.css';

interface QrCodeOptions {
    data: string;
    width: number;
    height: number;
    margin: number;
    dotsOptions: {
        type: 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded';
        color: string;
        gradient?: {
            type: 'linear' | 'radial';
            rotation?: number;
            colorStops: { offset: number; color: string }[];
        };
    };
    cornersSquareOptions: {
        type: 'square' | 'dots' | 'extra-rounded';
        color: string;
        gradient?: {
            type: 'linear' | 'radial';
            rotation?: number;
            colorStops: { offset: number; color: string }[];
        };
    };
    cornersDotOptions: {
        type: 'square' | 'dots' | 'none';
        color: string;
        gradient?: {
            type: 'linear' | 'radial';
            rotation?: number;
            colorStops: { offset: number; color: string }[];
        };
    };
    backgroundOptions: {
        color?: string;
        gradient?: {
            type: 'linear' | 'radial';
            rotation?: number;
            colorStops: { offset: number; color: string }[];
        };
    };
    imageOptions: {
        src?: string;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        excavate?: boolean;
        margin?: number;
        size?: number;
    };
    qrOptions: {
        typeNumber: number;
        mode: 'Byte' | 'Numeric' | 'Kanji' | 'Alphanumeric';
        errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
    };
}

const defaultOptions: QrCodeOptions = {
    data: 'https://qr-code-styling.com',
    width: 300,
    height: 300,
    margin: 0,
    dotsOptions: { type: 'classy', color: '#800080' },
    cornersSquareOptions: { type: 'extra-rounded', color: '#000000' },
    cornersDotOptions: { type: 'none', color: '#000000' },
    backgroundOptions: { color: '#ffffff' },
    imageOptions: { excavate: true, size: 0.4, margin: 0 },
    qrOptions: { typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'Q' },
};

const QrCodeCustomizationPage: React.FC = () => {
    const [options, setOptions] = useState<QrCodeOptions>(defaultOptions);
    const qrCodeRef = useRef<QRCodeStyling | null>(null);
    const qrCodeContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentQrCodeRef = qrCodeRef.current;
        const qrCodeContainer = qrCodeContainerRef.current;

        const newQrCodeOptions = {
            ...options,
            dotsOptions: { ...options.dotsOptions },
            cornersSquareOptions: { ...options.cornersSquareOptions },
            cornersDotOptions: { ...options.cornersDotOptions },
            backgroundOptions: { ...options.backgroundOptions },
            imageOptions: { ...options.imageOptions },
            qrOptions: { ...options.qrOptions },
            margin: options.margin,
            width: options.width,
            height: options.height,
        };

        if (!currentQrCodeRef && qrCodeContainer) {
            qrCodeRef.current = new QRCodeStyling(newQrCodeOptions);
            qrCodeRef.current.append(qrCodeContainer);
        } else if (currentQrCodeRef) {
            currentQrCodeRef.update(newQrCodeOptions);
        }

        return () => {
            if (currentQrCodeRef && qrCodeContainer) {
                qrCodeContainer.innerHTML = '';
            }
        };
    }, [options]);

    const handleInputChange = (section: keyof QrCodeOptions, field: string, value: any) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            [section]: { ...prevOptions[section], [field]: value },
        }));
    };

    const handleWidthChange = (value: string) => {
        const parsedWidth = parseInt(value, 10);
        setOptions(prevOptions => ({
            ...prevOptions,
            width: isNaN(parsedWidth) ? 0 : parsedWidth,
        }));
    };

    const handleHeightChange = (value: string) => {
        const parsedHeight = parseInt(value, 10);
        setOptions(prevOptions => ({
            ...prevOptions,
            height: isNaN(parsedHeight) ? 0 : parsedHeight,
        }));
    };

    const handleDotsOptionsChange = (field: keyof QrCodeOptions['dotsOptions'], value: any) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            dotsOptions: { ...prevOptions.dotsOptions, [field]: value },
        }));
    };

    const handleCornersSquareOptionsChange = (field: keyof QrCodeOptions['cornersSquareOptions'], value: any) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            cornersSquareOptions: { ...prevOptions.cornersSquareOptions, [field]: value },
        }));
    };

    const handleCornersDotOptionsChange = (field: keyof QrCodeOptions['cornersDotOptions'], value: any) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            cornersDotOptions: { ...prevOptions.cornersDotOptions, [field]: value },
        }));
    };

    const handleBackgroundOptionsChange = (field: keyof QrCodeOptions['backgroundOptions'], value: any) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            backgroundOptions: { ...prevOptions.backgroundOptions, [field]: value },
        }));
    };

    const handleImageOptionsChange = (field: keyof QrCodeOptions['imageOptions'], value: any) => {
         setOptions(prevOptions => ({
             ...prevOptions,
            imageOptions: { ...prevOptions.imageOptions, [field]: value },
         }));
    };
    const handleQrOptionsChange = (field: keyof QrCodeOptions['qrOptions'], value: any) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            qrOptions: { ...prevOptions.qrOptions, [field]: value },
        }));
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setOptions(prevOptions => ({
                    ...prevOptions,
                    imageOptions: {
                        ...prevOptions.imageOptions,
                        src: reader.result as string,
                    },
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = (extension: 'png' | 'jpeg' | 'svg') => {
        qrCodeRef.current?.download({ extension });
    };

    const handleExportJson = () => {
        const jsonString = JSON.stringify(options, null, 2);
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "qr_code_options.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="qr-code-page">
            <div className="options-container">
                <h2>Main Options</h2>
                <div>
                    <label htmlFor="data">Data:</label>
                    <input
                        type="text"
                        id="data"
                        value={options.data}
                        onChange={(e) => handleInputChange('data', 'data', e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="imageFile">Image File:</label>
                    <input type="file" id="imageFile" onChange={handleImageUpload} />
                </div>
                <div>
                    <label htmlFor="width">Width:</label>
                    <input
                        type="number"
                        id="width"
                        value={options.width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="height">Height:</label>
                    <input
                        type="number"
                        id="height"
                        value={options.height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="margin">Margin:</label>
                    <input
                        type="number"
                        id="margin"
                        value={options.margin}
                    />
                </div>

                <h3>Dots Options</h3>
                <div>
                    <label htmlFor="dotsStyle">Dots Style:</label>
                    <select
                        id="dotsStyle"
                        value={options.dotsOptions.type}
                        onChange={(e) => handleDotsOptionsChange('type', e.target.value as any)}
                    >
                        <option value="square">Square</option>
                        <option value="dots">Dots</option>
                        <option value="rounded">Rounded</option>
                        <option value="classy">Classy</option>
                        <option value="classy-rounded">Classy Rounded</option>
                    </select>
                </div>
                <div>
                    <label>Color Type:</label>
                    <input type="radio" name="dotsColorType" value="single" defaultChecked /> Single color
                    <input type="radio" name="dotsColorType" value="gradient" disabled /> Color gradient
                </div>
                <div>
                    <label htmlFor="dotsColor">Dots Color:</label>
                    <input
                        type="color"
                        id="dotsColor"
                        value={options.dotsOptions.color}
                        onChange={(e) => handleDotsOptionsChange('color', e.target.value)}
                    />
                </div>

                <h3>Corners Square Options</h3>
                <div>
                    <label htmlFor="cornersSquareStyle">Corners Square Style:</label>
                    <select
                        id="cornersSquareStyle"
                        value={options.cornersSquareOptions.type}
                        onChange={(e) => handleCornersSquareOptionsChange('type', e.target.value as any)}
                    >
                        <option value="square">Square</option>
                        <option value="dots">Dots</option>
                        <option value="extra-rounded">Extra rounded</option>
                    </select>
                </div>
                <div>
                    <label>Color Type:</label>
                    <input type="radio" name="cornersSquareColorType" value="single" defaultChecked /> Single color
                    <input type="radio" name="cornersSquareColorType" value="gradient" disabled /> Color gradient
                </div>
                <div>
                    <label htmlFor="cornersSquareColor">Corners Square Color:</label>
                    <input
                        type="color"
                        id="cornersSquareColor"
                        value={options.cornersSquareOptions.color}
                        onChange={(e) => handleCornersSquareOptionsChange('color', e.target.value)}
                    />
                     <button disabled>Clear</button>
                 </div>

                <h3>Corners Dot Options</h3>
                 <div>
                    <label htmlFor="cornersDotStyle">Corners Dot Style:</label>
                    <select
                         id="cornersDotStyle"
                         value={options.cornersDotOptions.type}
                        onChange={(e) => handleCornersDotOptionsChange('type', e.target.value as any)}
                     >
                         <option value="none">None</option>
                        <option value="square">Square</option>
                        <option value="dots">Dots</option>
                     </select>
                  </div>
                  <div>
                    <label>Color Type:</label>
                    <input type="radio" name="cornersDotColorType" value="single" defaultChecked /> Single color
                    <input type="radio" name="cornersDotColorType" value="gradient" disabled /> Color gradient
                 </div>
                   <div>
                     <label htmlFor="cornersDotColor">Corners Dot Color:</label>
                     <input
                         type="color"
                         id="cornersDotColor"
                        value={options.cornersDotOptions.color}
                        onChange={(e) => handleCornersDotOptionsChange('color', e.target.value)}
                       />
                    <button disabled>Clear</button>
                   </div>

                     <h3>Background Options</h3>
                    <div>
                        <label>Color Type:</label>
                        <input type="radio" name="backgroundColorType" value="single" defaultChecked /> Single color
                        <input type="radio" name="backgroundColorType" value="gradient" disabled /> Color gradient
                    </div>
                    <div>
                        <label htmlFor="backgroundColor">Background Color:</label>
                        <input
                            type="color"
                            id="backgroundColor"
                           value={options.backgroundOptions.color || '#ffffff'}
                          onChange={(e) => handleBackgroundOptionsChange('color', e.target.value)}
                       />
                    </div>

                    <h3>Image Options</h3>
                    <div>
                        <label>Hide Background Dots:</label>
                       <input
                            type="checkbox"
                            checked={options.imageOptions.excavate}
                            onChange={(e) => handleImageOptionsChange('excavate', e.target.checked)}
                         />
                     </div>
                     <div>
                         <label htmlFor="imageSize">Image Size:</label>
                         <input
                            type="number"
                            id="imageSize"
                            value={options.imageOptions.size}
                            onChange={(e) => handleImageOptionsChange('size', parseFloat(e.target.value))}
                        />
                    </div>
                    <div>
                        <label htmlFor="imageMargin">Margin:</label>
                        <input
                            type="number"
                            id="imageMargin"
                            value={options.imageOptions.margin}
                            onChange={(e) => handleImageOptionsChange('margin', parseInt(e.target.value, 10))}
                          />
                    </div>

                    <h3>QR Options</h3>
                    <div>
                         <label htmlFor="typeNumber">Type Number:</label>
                        <input
                            type="number"
                            id="typeNumber"
                             value={options.qrOptions.typeNumber}
                             onChange={(e) => handleQrOptionsChange('typeNumber', parseInt(e.target.value, 10))}
                        />
                    </div>
                    <div>
                        <label htmlFor="mode">Mode:</label>
                        <select
                            id="mode"
                            value={options.qrOptions.mode}
                            onChange={(e) => handleQrOptionsChange('mode', e.target.value as any)}
                        >
                            <option value="Byte">Byte</option>
                            <option value="Numeric">Numeric</option>
                            <option value="Kanji">Kanji</option>
                            <option value="Alphanumeric">Alphanumeric</option>
                         </select>
                    </div>
                     <div>
                         <label htmlFor="errorCorrectionLevel">Error Correction Level:</label>
                         <select
                            id="errorCorrectionLevel"
                             value={options.qrOptions.errorCorrectionLevel}
                             onChange={(e) => handleQrOptionsChange('errorCorrectionLevel', e.target.value as any)}
                         >
                            <option value="L">L</option>
                            <option value="M">M</option>
                            <option value="Q">Q</option>
                           <option value="H">H</option>
                         </select>
                    </div>

                    <button onClick={handleExportJson}>Export Options as JSON</button>

            </div>

             <div className="qr-preview-container">
                <div ref={qrCodeContainerRef} id="qr-code" />
                <div>
                    <button onClick={() => handleDownload('png')}>Download</button>
                    <select defaultValue="png" onChange={(e) => handleDownload(e.target.value as any)}>
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="svg">SVG</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default QrCodeCustomizationPage;