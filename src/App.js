import './App.css';
import {useEffect, useState, useRef} from "react";
import {Button, Container} from "react-bootstrap";
import ImageResult from "./components/ImageResult";
import {FloatingLabel, Form} from "react-bootstrap";

const tf = require("@tensorflow/tfjs");


function App() {

    const [model, setModel] = useState();
    const [results, setResults] = useState([])
    const [selectedImages, setSelectedImages] = useState([]);

    const [modelName, setModelName] = useState('SimpleCNN');

    const modelMap = {
        'SimpleCNN' : '/models/myModel/model.json',
        'Xception' : '/models/Xception/model.json',
        'MobileNetV2' : '/models/MobileNetV2/model.json',
        'InceptionV3' : '/models/InceptionV3/model.json',
        'DenseNet121' : '/models/DenseNet121/model.json'
    }
    const IMAGE_SIZE = 96
    const CLASSES = {
        0: 'dew',
        1: 'fogsmog',
        2: 'frost',
        3: 'glaze',
        4: 'hail',
        5: 'lightning',
        6: 'rain',
        7: 'rainbow',
        8: 'rime',
        9: 'sandstorm',
        10: 'snow'
    }


    const onSelectFile = (event) => {
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);

        const imagesArray = selectedFilesArray.map((file) => {
            return URL.createObjectURL(file);
        });

        setSelectedImages((previousImages) => previousImages.concat(imagesArray));

        event.target.value = "";
    };

    function deleteHandler(image) {
        setSelectedImages(selectedImages.filter((e) => e !== image));
        URL.revokeObjectURL(image);
    }


    async function loadModel() {
        try {
            const myModel = await tf.loadLayersModel(modelMap[modelName]);
            setModel(myModel);
            console.log("Load model success")
        } catch (err) {
            console.log(err);
        }
    }


    const identify = async (imgUrl) => {
        const image = new Image();
        image.src = imgUrl;
        const img = tf.browser.fromPixels(image).resizeBilinear([96, 96]).toFloat();
        const normalized = img.div(255.0);
        const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
        const result = await model.predict(batched).data()
        return result
    }

    const classify = async () => {
        const newResults = []
        for (let i = 0; i < selectedImages.length; i++) {
            const newResult = await identify(selectedImages[i])
            newResults.push(newResult)
        }
        console.log(newResults)
        setResults(newResults)
    }


    useEffect(() => {
        loadModel()
    }, [])

    useEffect(() => {
        loadModel()
        console.log(modelName)
    }, [modelName])

    return (
        <section>

            <FloatingLabel style={{ marginRight : '680px', marginLeft : '680px' }} className="my-5" controlId="floatingSelect" label="Model Type">
                <Form.Select aria-label="Model Type" value={modelName}
                             onChange={e => setModelName(e.target.value)}
                >
                    <option value="SimpleCNN">SimpleCNN</option>
                    <option value="Xception">Xception</option>
                    <option value="MobileNetV2">MobileNetV2</option>
                    <option value="InceptionV3">InceptionV3</option>
                    <option value="DenseNet121">DenseNet121</option>
                </Form.Select>
            </FloatingLabel>

            <label>
                + Add Images
                <br/>
                <span>up to 10 images</span>
                <input
                    type="file"
                    name="images"
                    onChange={onSelectFile}
                    multiple
                    accept="image/png , image/jpeg, image/webp"
                />
            </label>
            <br/>

            <input type="file" multiple/>

            {selectedImages.length > 0 &&
                <button
                    className="upload-btn"
                    onClick={classify}
                >
                    CLASSIFY {selectedImages.length} IMAGE
                    {selectedImages.length === 1 ? "" : "S"}
                </button>
            }

            <div className="images" style={{marginBottom: '100px', paddingLeft: '120px', paddingRight: '120px'}}>
                {selectedImages &&
                    selectedImages.map((image, index) => {
                        return (
                            <div key={image} className="image">
                                <img src={image} height="200" alt="upload"/>
                                <button onClick={() => deleteHandler(image)}>
                                    delete image
                                </button>
                                <p>{index + 1}</p>
                            </div>
                        );
                    })}
            </div>


            {results.length !== 0 &&
                <Container>
                    {results.map((result, index) => {
                        return (
                            <ImageResult imageUrl={selectedImages[index]} classMap={CLASSES} result={result}/>
                        )
                    })}
                < /Container>
            }
        </section>

    );
}

export default App;
