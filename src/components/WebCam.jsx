import { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemash from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";

const WebCam = () => {
    //ref
    const webcamRef = useRef();
    const canvasRef = useRef();

    // load facemesh
    const runFacemesh = async () => {
        const net = await facemash.load({
            inputResolution: { width: 640, height: 400 },
            scale: 0.8,
        });
        setInterval(()=>{
            detect(net)
        }, 100)
    };

    // Detect function
    const detect = async (net) => {
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            //Get video properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;
            
            //Set video width
            webcamRef.current.video.wideh =videoWidth
            webcamRef.current.video.height =videoHeight
            
            //Set convas width
            canvasRef.current.width = videoWidth
            canvasRef.current.height = videoHeight

            //Make detections
            const face = await net.estimateFaces(video)

            //Get canvas context for drawing
        }
    };

    runFacemesh()

    return (
        <>
            <Webcam
                ref={webcamRef}
                style={{
                    position: "absoulute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 9,
                    width: 640,
                    height: 480,
                }}
            />
            <canvas
                ref={canvasRef}
                style={{
                    position: "absoulute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 9,
                    width: 640,
                    height: 480,
                }}
            />
        </>
    );
};

export default WebCam;
