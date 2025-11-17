import os
import time
import random
import sys

WIDTH = 80
HEIGHT = 30

# 불 강도 (0 = 없음, 35 = 가장 뜨거움)
FIRE_WIDTH = WIDTH
FIRE_HEIGHT = HEIGHT

fire_pixels = [0] * (FIRE_WIDTH * FIRE_HEIGHT)

# 간단한 팔레트 (강도 -> 문자)
PALETTE_CHARS = " .:-=+*#%@"

def clear():
    if os.name == "nt":
        os.system("cls")
    else:
        os.system("clear")

def init_fire():
    global fire_pixels
    # 맨 아래 줄을 최고 강도로 채움 (장작불)
    for x in range(FIRE_WIDTH):
        fire_pixels[(FIRE_HEIGHT - 1) * FIRE_WIDTH + x] = 35

def update_fire():
    global fire_pixels
    for y in range(FIRE_HEIGHT - 1):
        for x in range(FIRE_WIDTH):
            src = (y + 1) * FIRE_WIDTH + x
            decay = random.randint(0, 3)
            dst_x = x - decay
            if dst_x < 0:
                dst_x = 0
            dst = y * FIRE_WIDTH + dst_x

            new_intensity = fire_pixels[src] - decay
            if new_intensity < 0:
                new_intensity = 0
            fire_pixels[dst] = new_intensity

def intensity_to_char(intensity):
    # 0~35 → 팔레트 인덱스
    idx = int((intensity / 35) * (len(PALETTE_CHARS) - 1))
    ch = PALETTE_CHARS[idx]

    # 색상(ANSI)
    if intensity == 0:
        color = "\033[0m"        # 없음
    elif intensity < 10:
        color = "\033[33m"       # 노랑
    elif intensity < 20:
        color = "\033[31m"       # 빨강
    else:
        color = "\033[91m"       # 밝은 빨강
    return color + ch

def render_fire():
    lines = []
    for y in range(FIRE_HEIGHT):
        row = []
        for x in range(FIRE_WIDTH):
            intensity = fire_pixels[y * FIRE_WIDTH + x]
            row.append(intensity_to_char(intensity))
        lines.append("".join(row))
    # 마지막에 색 초기화
    return "\n".join(lines) + "\033[0m"

def main():
    clear()
    init_fire()
    try:
        while True:
            update_fire()
            clear()
            frame = render_fire()
            print(frame)
            time.sleep(0.05)
    except KeyboardInterrupt:
        clear()
        print("🔥 불멍 종료!")

if __name__ == "__main__":
    main()
