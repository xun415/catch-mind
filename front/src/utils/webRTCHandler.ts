import Peer from 'simple-peer'

// 각 peer 들에 대한 정보 보관
let peers = {}

let streams = []

const DEFAULT_CONSTRAINS = {
    audio: true,
    video: false
}

let localStream;

export const setLocalAudioStream = (onSuccess, onFail) => {
    navigator.mediaDevices.getUserMedia(DEFAULT_CONSTRAINS).then(stream => {
        localStream = stream;
        onSuccess()
    }).catch(e => {
        onFail(e)
    })
}

export const prepareNewPeerConnection = (connUserSocketId, isRequester, onSignalData, onStream) => {

    peers[connUserSocketId] = new Peer({
        initiator: isRequester,
        config: DEFAULT_CONSTRAINS,
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
