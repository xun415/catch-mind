import Peer from 'simple-peer'

// 각 peer 들에 대한 정보 보관
let peers = {}

let streams = []

const DEFAULT_CONSTRAINS = {
    audio: true,
    video: false
}

let localStream;
let prevAudioStream;
let prevCanvasStream;

export const setLocalAudioStream = (onSuccess, onFail) => {
    navigator.mediaDevices.getUserMedia(DEFAULT_CONSTRAINS).then(stream => {
        // const newStream = new MediaStream([stream.getAudioTracks()[0], localCanvasStream.getVideoTracks()[0]])

        prevAudioStream = stream
        localStream = stream
        onSuccess()
    }).catch(e => {
        onFail(e)
    })
}


export const addCanvasStream = (canvasStream: MediaStream, onSuccess?: () => void, onFail?: () => void) => {
    for (let peerSocketId in peers) {
        const peer = peers[peerSocketId]

        // 기존 스트림
        const peerStream = peer.streams[0]

        const newCanvasVideoTrack = canvasStream.getVideoTracks()[0]

        if (!prevCanvasStream) {
            prevCanvasStream = canvasStream

            peer.addTrack(newCanvasVideoTrack, peerStream)
        } else {
            peer.replaceTrack(prevCanvasStream.getVideoTracks()[0], newCanvasVideoTrack, peerStream)
            prevCanvasStream = canvasStream
        }
    }
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
