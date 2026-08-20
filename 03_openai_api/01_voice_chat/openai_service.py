# STT (음성 -> 텍스트) + GPT 응답 + TTS(텍스트 -> 음성) 파이프라인
import base64
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()
client = OpenAI()

# 오디오 객체를 Whisper로 STT(Speech-To-Text)하는 함수
def stt(audio):
    output_filepath = 'input.mp3'   # 임시 저장할 파일명
    audio.export(output_filepath, format = 'mp3') # 오디오 객체를 mp3 파일로 저장

    with open(output_filepath , 'rb') as f: # 오디오 파일을 바이너리 읽기 모드로 열기
        # STT API 호출
        transcription = client.audio.transcriptions.create(
            model = 'whisper-1',
            file = f
        )
    os.remove(output_filepath) # 임시 mp3 파일 삭제

    return transcription.text

# 메세지 히스토리를 받아서 GPT API로 응답을 생성해서 반환하는 함수
def ask_gpt(messages, model = 'gpt-5.6-luna'):
    return client.chat.completions.create(
            model = model, 
            messages = messages,
            temperature = 1,
            top_p =  1,
            max_completion_tokens = 4096 # 최대 출력 토큰 수 (응답길이 제한)
        ).choices[0].message.content

# 텍스트를 받아 TTS(Text-T-Speech)로 mp3 생성 후 base64 문자열로 반환하는 함수
# -json의 값으로써 멀티미디어 파일을 전송하고 싶은 경우 base64 인코딩 -> 확인하는 측에서는 base64 디코딩
def tts(response: str):
    filename = "output.mp3"

    with client.audio.speech.with_streaming_response.create(
        model="tts-1",
        voice="nova",
        input=response,
    ) as resp:
        resp.stream_to_file(filename)

    with open(filename, "rb") as file:
        data = file.read()
        b64_encoded = base64.b64encode(data).decode("utf-8")

    os.remove(filename)

    return b64_encoded

#
def stt_file(uploaded_file) -> str:
    transcription = client.audio.transcriptions.create(
        model="whisper-1",
        file=(
            uploaded_file.name,
            uploaded_file.getvalue(),
        ),
    )

    return transcription.text
