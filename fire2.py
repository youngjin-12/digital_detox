import time
import random
import gradio as gr

# ====== 불멍 파라미터 ======
WIDTH = 80
HEIGHT = 30

FIRE_WIDTH = WIDTH
FIRE_HEIGHT = HEIGHT

# 불 강도 배열 (0 = 없음, 35 = 가장 뜨거움)
fire_pixels = [0] * (FIRE_WIDTH * FIRE_HEIGHT)

# 강도 -> 문자 매핑 (콘솔 버전과 동일)
PALETTE_CHARS = " .:-=+*#%@"

def init_fire():
    """맨 아래 줄을 최고 강도로 채움 (장작불)"""
    global fire_pixels
    fire_pixels = [0] * (FIRE_WIDTH * FIRE_HEIGHT)
    for x in range(FIRE_WIDTH):
        fire_pixels[(FIRE_HEIGHT - 1) * FIRE_WIDTH + x] = 35

def update_fire():
    """불 픽셀 위로 전달"""
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

def intensity_to_char(intensity: int) -> str:
    """강도(0~35)를 팔레트 문자로 변환 (색은 HTML에서)"""
    idx = int((intensity / 35) * (len(PALETTE_CHARS) - 1))
    return PALETTE_CHARS[idx]

def intensity_to_color(intensity: int) -> str:
    """강도에 따른 색상 (HTML color)"""
    if intensity == 0:
        return "#000000"
    elif intensity < 10:
        return "#ffeb3b"  # 노랑
    elif intensity < 20:
        return "#ff5722"  # 빨강
    else:
        return "#ff9800"  # 밝은 주황

def render_fire_html() -> str:
    """현재 fire_pixels 상태를 <pre> + span 으로 HTML 렌더링"""
    lines = []
    for y in range(FIRE_HEIGHT):
        row_html = []
        for x in range(FIRE_WIDTH):
            intensity = fire_pixels[y * FIRE_WIDTH + x]
            ch = intensity_to_char(intensity)
            color = intensity_to_color(intensity)
            # 각 문자를 span으로 감싸서 색 입히기
            row_html.append(f'<span style="color:{color}">{ch}</span>')
        lines.append("".join(row_html))
    pre_style = (
        "font-family: SFMono-Regular,ui-monospace,Menlo,Monaco,Consolas,"
        "'Liberation Mono','Courier New',monospace;"
        "font-size:9px; line-height:9px; margin:0;"
    )
    return f'<pre style="{pre_style}">' + "\n".join(lines) + "</pre>"

# ====== Gradio용 함수 ======
def fire_stream(duration_sec: int = 10):
    """
    Gradio에서 쓸 제너레이터 함수.
    duration_sec 동안 불멍 프레임을 계속 yield.
    """
    init_fire()
    start = time.time()
    while time.time() - start < duration_sec:
        update_fire()
        html = render_fire_html()
        # Gradio의 HTML 컴포넌트에 넘겨줄 값
        yield html
        time.sleep(0.05)  # 콘솔 버전과 비슷한 속도


with gr.Blocks() as demo:
    gr.Markdown("## 🔥 콘솔 불멍 (Gradio 버전)\n버튼을 누르면 잠깐 동안 디지털 불멍을 즐길 수 있어요.")

    with gr.Row():
        duration = gr.Slider(
            minimum=5,
            maximum=30,
            value=10,
            step=1,
            label="불멍 시간 (초)"
        )
        btn = gr.Button("불멍 시작")

    output = gr.HTML()

    # 버튼 클릭 → fire_stream 제너레이터 실행 (스트리밍)
    btn.click(fire_stream, inputs=duration, outputs=output)

if __name__ == "__main__":
    demo.launch()
