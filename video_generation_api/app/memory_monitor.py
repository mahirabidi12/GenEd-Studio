import torch

def get_free_vram_gb():
    torch.cuda.empty_cache()
    stats = torch.cuda.memory_stats()
    allocated = stats["allocated_bytes.all.current"]
    total = torch.cuda.get_device_properties(0).total_memory
    free = total - allocated
    return free / (1024 ** 3)