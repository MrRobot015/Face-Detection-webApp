import { useRef, useEffect } from "react";
import { drawMesh } from "../utils/utils";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import styledComponents from "styled-components";

const Container = styledComponents.div`

background-color: #c7ccd6;
min-height: 100vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
font-size: calc(10px + 2vmin);
color: white;

`;
const WebCam = () => {
    //ref
    const webcamRef = useRef();
    const canvasRef = useRef();

    // load facemesh
    const runFacemesh = async () => {
        const net = await facemesh.load(facemesh.SupportedPackages.mediapipeFacemesh);
        setInterval(() => {
            detect(net);
        }, 100);
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
            webcamRef.current.video.wideh = videoWidth;
            webcamRef.current.video.height = videoHeight;

            //Set convas width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            //Make detections
            const face = await net.estimateFaces({ input: video });
            // console.log(face);

            //Get canvas context for drawing
            const ctx = canvasRef.current.getContext("2d");
            requestAnimationFrame(() => {
                drawMesh(face, ctx);
            });
        }
    };

    useEffect(() => {
        runFacemesh();
    }, []);

    return (
        <Container>
            <Webcam
                ref={webcamRef}
                style={{
                    position: "absolute",
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
                    position: "absolute",
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
        </Container>
    );
};

export default WebCam;
