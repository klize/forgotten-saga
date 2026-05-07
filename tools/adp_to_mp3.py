"""Convert Forgotten Saga ADP (IMA ADPCM) to WAV, then to MP3 via ffmpeg."""
import struct
import sys
import subprocess
import os

STEP_TABLE = [
    7, 8, 9, 10, 11, 12, 13, 14, 16, 17,
    19, 21, 23, 25, 28, 31, 34, 37, 41, 45,
    50, 55, 60, 66, 73, 80, 88, 97, 107, 118,
    130, 143, 157, 173, 190, 209, 230, 253, 279, 307,
    337, 371, 408, 449, 494, 544, 598, 658, 724, 796,
    876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066,
    2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358,
    5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
    15290, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767,
]

INDEX_TABLE = [-1, -1, -1, -1, 2, 4, 6, 8, -1, -1, -1, -1, 2, 4, 6, 8]


def decode_nibble(nibble, state):
    step = STEP_TABLE[state['index']]
    diffstep = step >> 3
    if nibble & 4:
        diffstep += step
    if nibble & 2:
        diffstep += step >> 1
    if nibble & 1:
        diffstep += step >> 2
    if nibble & 8:
        state['valprev'] -= diffstep
    else:
        state['valprev'] += diffstep
    state['valprev'] = max(-32768, min(32767, state['valprev']))
    state['index'] += INDEX_TABLE[nibble]
    state['index'] = max(0, min(88, state['index']))
    return state['valprev']


def adp_to_wav(adp_path, wav_path):
    with open(adp_path, 'rb') as f:
        header = f.read(16)
        sample_rate = struct.unpack_from('<I', header, 4)[0]
        channels = struct.unpack_from('<I', header, 8)[0]
        adp_data = f.read()

    left = {'valprev': 0, 'index': 0}
    right = {'valprev': 0, 'index': 0}
    samples = []

    for b in adp_data:
        low = b & 0x0F
        high = (b >> 4) & 0x0F
        l_samp = decode_nibble(low, left)
        r_samp = decode_nibble(high, right)
        samples.append(struct.pack('<hh', l_samp, r_samp))

    pcm_data = b''.join(samples)
    pcm_size = len(pcm_data)

    with open(wav_path, 'wb') as f:
        f.write(b'RIFF')
        f.write(struct.pack('<I', 36 + pcm_size))
        f.write(b'WAVE')
        f.write(b'fmt ')
        f.write(struct.pack('<I', 16))
        f.write(struct.pack('<HH', 1, channels))
        f.write(struct.pack('<II', sample_rate, sample_rate * channels * 2))
        f.write(struct.pack('<HH', channels * 2, 16))
        f.write(b'data')
        f.write(struct.pack('<I', pcm_size))
        f.write(pcm_data)

    print(f"WAV: {wav_path} ({pcm_size} bytes PCM, {sample_rate}Hz, {channels}ch)")


def main():
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <input.adp> <output.mp3>")
        sys.exit(1)

    adp_path = sys.argv[1]
    mp3_path = sys.argv[2]
    wav_path = mp3_path.rsplit('.', 1)[0] + '.wav'

    adp_to_wav(adp_path, wav_path)

    # Try ffmpeg for MP3
    try:
        subprocess.run([
            'ffmpeg', '-y', '-i', wav_path,
            '-codec:a', 'libmp3lame', '-b:a', '128k',
            mp3_path
        ], check=True, capture_output=True)
        os.remove(wav_path)
        print(f"MP3: {mp3_path}")
    except FileNotFoundError:
        print("ffmpeg not found. WAV file kept as output.")
        print(f"Install ffmpeg or manually convert: {wav_path}")


if __name__ == '__main__':
    main()
