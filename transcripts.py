import openai
import os
from dotenv import load_dotenv
load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')
audio_file = open("speakingMate.mp3", "rb")
transcript = openai.Audio.transcribe("whisper-1", audio_file)