import math
import struct
import wave
import os

# Create sounds directory if it doesn't exist
sounds_dir = r'client\public\sounds'
os.makedirs(sounds_dir, exist_ok=True)

# Create 4 different note frequencies (pentatonic scale - A minor: A, C, D, E)
frequencies = [440, 523.25, 587.33, 659.25]  # A4, C5, D5, E5
note_names = ['note-1.wav', 'note-2.wav', 'note-3.wav', 'note-4.wav']

# Audio parameters
sample_rate = 44100  # CD quality
duration = 0.3  # 300ms duration
amplitude = 32767 * 0.3  # 30% volume to avoid clipping

for freq, note_name in zip(frequencies, note_names):
    # Generate sine wave
    frames = []
    for i in range(int(sample_rate * duration)):
        t = i / sample_rate
        # Sine wave with fade in/out
        sample = math.sin(2 * math.pi * freq * t)
        
        # Add fade out at the end (last 50ms)
        if i > sample_rate * (duration - 0.05):
            fade_progress = (i - sample_rate * (duration - 0.05)) / (sample_rate * 0.05)
            sample *= (1 - fade_progress)
        
        # Convert to 16-bit PCM
        sample_int = int(sample * amplitude)
        frames.append(struct.pack('<h', sample_int))
    
    # Write WAV file
    filepath = os.path.join(sounds_dir, note_name)
    with wave.open(filepath, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(b''.join(frames))
    
    print(f'Created {filepath}')

# Create miss sound (lower frequency, shorter)
miss_freq = 220  # A3 - lower note for error
miss_duration = 0.2
miss_frames = []
for i in range(int(sample_rate * miss_duration)):
    t = i / sample_rate
    # Two-tone error sound (descending)
    progress = i / (sample_rate * miss_duration)
    freq = miss_freq + (100 * progress)  # Descend
    sample = math.sin(2 * math.pi * freq * t)
    sample_int = int(sample * amplitude)
    miss_frames.append(struct.pack('<h', sample_int))

miss_path = os.path.join(sounds_dir, 'miss.wav')
with wave.open(miss_path, 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    wav_file.writeframes(b''.join(miss_frames))

print(f'Created {miss_path}')
print('All audio files generated successfully!')
