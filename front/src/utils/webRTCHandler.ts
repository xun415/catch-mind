import Peer from 'simple-peer'

// 각 peer 들에 대한 정보 보관
let peers = {}

let streams = []

const DEFAULT_CONSTRAINS = {
    audio: true,
    video: false
}

let localStream;
let localAudioStream;
let localCanvasStream;

export const setLocalAudioStream = (onSuccess, onFail) => {
    navigator.mediaDevices.getUserMedia(DEFAULT_CONSTRAINS).then(stream => {
        // const newStream = new MediaStream([stream.getAudioTracks()[0], localCanvasStream.getVideoTracks()[0]])

        localAudioStream = stream
        localStream = stream
        onSuccess()
    }).catch(e => {
        onFail(e)
    })
}


export const setCanvasStream = (canvasStream: MediaStream, onSuccess?: () => void, onFail?: () => void) => {
    localCanvasStream = canvasStream
    // const newStream = new MediaStream([localAudioStream.getAudioTracks()[0], canvasStream.getVideoTracks()[0]])
    // localStream = newStream
}

export const prepareNewPeerConnection = (connUserSocketId: string, isRequester: boolean, onSignalData, onStream) => {

    peers[connUserSocketId] = new Peer({
        initiator: isRequester,
        config: {
            iceServers: [
                {
                    urls: 'stun:stun.l.google.com:19302'
                }
            ]
        },
        stream: localStream,
    });

    peers[connUserSocketId].on("signal", (data) => {
        // webRTC offer, webRTC Answer (SDP informations), ice candidates

        const signalData = {
            signal: data,
            connUserSocketId: connUserSocketId,
        };

        onSignalData(signalData)
    });

    peers[connUserSocketId].on("stream", (stream) => {
        onStream(stream, connUserSocketId)
        streams = [...streams, stream];
    });
};

export const handleSignalingData = (data) => {
    //add signaling data to peer connection
    peers[data.connUserSocketId].signal(data.signal)
}

export const removePeerConnection = (data) => {
    const { socketId } = data

    // peer connection 종료
    if (peers[socketId]) {
        peers[socketId].destroy()
    }
    delete peers[socketId]
}
