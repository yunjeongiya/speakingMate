const timeArea = document.getElementById('time-area')
const prepareTimeInput = document.getElementById('prepare-time-input')
const speakTimeInput = document.getElementById('speak-time-input')
const prepareTimer = document.getElementById('prepare-timer')
const speakTimer = document.getElementById('speak-timer')

const feedbackArea = document.getElementById('feedback-area')
const audio = document.getElementById('audio')
const recognizedText = document.getElementById('recognized-text')

const start = document.getElementById('start')
const quit = document.getElementById('quit')
const download = document.getElementById('download')
const retry = document.getElementById('retry')

let chunks = []
let mediaRecorder = null

if (!navigator.mediaDevices) {
        console.log("getUserMedia() not supported.")
        alert("getUserMedia() is not supported by your browser." +
            " If you want to record audio, please use Chrome or Firefox.")
    }

else {
    // TODO 함수로 하고 싶었는데, promise를 return해서 recorder를 return 하는 방법을 찾지 못함 -> promise의 콜백 공부하기
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then( stream => {
                mediaRecorder = new MediaRecorder(stream)
                console.log("MediaRecorder is prepared.")
                mediaRecorder.ondataavailable = e => {
                    chunks.push(e.data)
                }
                mediaRecorder.onstop = () => { //recorder stop event handler
                    console.log("MediaRecorder.stop() called.")

                    audio.controls = true

                    const blob = new Blob(chunks, {
                        'type': 'audio/ogg codecs=opus'
                    })
                    chunks = []
                    const url = URL.createObjectURL(blob)
                    audio.src = url
                    download.href = url
                }
            }
        )
        .catch(function (err) {
            console.log('The following gUM error occurred: ' + err)
        })
}

start.addEventListener('click', () => {
    const prepareTime = prepareTimeInput.value
    const speakTime = speakTimeInput.value

    prepareTimeInput.style.display = 'none'
    speakTimeInput.style.display = 'none'
    prepareTimer.style.display = 'inline'
    speakTimer.style.display = 'inline'
    prepareTimer.innerText = prepareTime
    speakTimer.innerText = speakTime

    start.style.display = 'none'
    quit.style.display = 'inline'

    practicing(prepareTime, speakTime)
})

let prepareIntervalId
let speakIntervalId

quit.addEventListener('click', () => {
    clearInterval(prepareIntervalId)
    clearInterval(speakIntervalId)
    practiceFinished()
})

function practicing(prepareTime, speakTime) {
    prepareIntervalId = setInterval(() => {
        if(prepareTime == 0) { //TODO ===로 하면 0초로 했을 때 못 잡는 이유 찾기
            clearInterval(prepareIntervalId)
            if(mediaRecorder != null) {
                mediaRecorder.start()
                console.log(mediaRecorder.state)
                console.log("recorder started")
            }
            else {
                console.log("recorder is not prepared")
            }

            speakIntervalId = setInterval(() => {
                if(speakTime == 0) {
                    clearInterval(speakIntervalId)
                    practiceFinished()
                }
                else {
                    speakTime--
                    speakTimer.innerText = speakTime
                }
            }, 1000)

        }
        else {
            prepareTime--
            prepareTimer.innerText = prepareTime
        }
    }, 1000)
}

function practiceFinished() {
    if (mediaRecorder != null && mediaRecorder.state === 'recording') {
        mediaRecorder.stop()
        console.log(mediaRecorder.state)
        console.log("recorder stopped")
    }

    timeArea.style.display = 'none'
    feedbackArea.style.display = 'inline'

    quit.style.display = 'none'
    download.style.display = 'inline'
    retry.style.display = 'inline'
}

retry.addEventListener('click', () => {
    timeArea.style.display = 'inline'
    feedbackArea.style.display = 'none'

    prepareTimeInput.style.display = 'inline'
    speakTimeInput.style.display = 'inline'
    prepareTimer.style.display = 'none'
    speakTimer.style.display = 'none'

    start.style.display = 'inline'
    download.style.display = 'none'
    retry.style.display = 'none'
})