import torch
from diffusers.utils import export_to_video
from diffusers import AutoencoderKLWan, WanPipeline
from diffusers.schedulers.scheduling_unipc_multistep import UniPCMultistepScheduler


# Available models: Wan-AI/Wan2.1-T2V-14B-Diffusers, Wan-AI/Wan2.1-T2V-1.3B-Diffusers
model_id = "Wan-AI/Wan2.1-T2V-1.3B-Diffusers"
vae = AutoencoderKLWan.from_pretrained(model_id, subfolder="vae", torch_dtype=torch.float32)
flow_shift = 5.0 # 5.0 for 720P, 3.0 for 480P
scheduler = UniPCMultistepScheduler(prediction_type='flow_prediction', use_flow_sigmas=True, num_train_timesteps=1000, flow_shift=flow_shift)
pipe = WanPipeline.from_pretrained(model_id, vae=vae, torch_dtype=torch.bfloat16)
pipe.scheduler = scheduler
pipe.to("cuda")

prompt = "A young man at his 20s is sitting on a piece of cloud in the sky, reading a book."
# Negative prompt to avoid unwanted artifacts
negative_prompt = "low resolution, blurry, distorted face, deformed hands, extra limbs, bad anatomy, text, watermark, logo, cartoonish, low quality, grainy, glitch, poorly rendered environment, unnatural lighting, bad shadows, out of frame, cropped, low detail"

output = pipe(
prompt=prompt,
negative_prompt=negative_prompt,
height=512, # reduce from 720
width=768, # reduce from 1280
num_frames=81,
guidance_scale=5.0,
).frames[0]
export_to_video(output, "output.mp4", fps=16)