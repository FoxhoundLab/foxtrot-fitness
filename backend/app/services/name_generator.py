"""Generate Adjective + Noun code-names with collision detection."""

import random

ADJECTIVES = [
    "Crimson", "Cobalt", "Sanguine", "Obsidian", "Titanium", "Iron",
    "Voltage", "Apex", "Vortex", "Phantom", "Rogue", "Ironclad",
    "Brutal", "Savage", "Feral", "Onyx", "Steel", "Thunder",
    "Solar", "Lunar", "Arctic", "Inferno", "Tempest", "Cyclone",
    "Glacial", "Magma", "Shadow", "Diamond", "Neon", "Pulse",
]

NOUNS = [
    "Typhoon", "Fury", "Thunder", "Protocol", "Sentinel", "Bastion",
    "Reckoning", "Tempest", "Vanguard", "Falcon", "Hammer", "Breaker",
    "Storm", "Raptor", "Colossus", "Inferno", "Bulwark", "Catalyst",
    "Engine", "Crucible", "Phoenix", "Titan", "Wolverine", "Mammoth",
    "Grizzly", "Jackal", "Cobra", "Panther", "Wolfhound", "Badger",
]

RESERVED = {"Genesis Protocol", "Cobalt Fury", "Sanguine Thunder"}


def generate_name() -> str:
    """Generate a random code-name."""
    return f"{random.choice(ADJECTIVES)} {random.choice(NOUNS)}"


def is_collision(name: str, existing_names: set) -> bool:
    """Check if name collides with existing or reserved names."""
    return name in existing_names or name in RESERVED


def generate_unique_name(existing_names: set, max_retries: int = 3) -> str:
    """Generate a unique name with collision retries."""
    for _ in range(max_retries):
        name = generate_name()
        if not is_collision(name, existing_names):
            return name
    # Fallback: append a number
    base = generate_name()
    counter = 1
    while f"{base} {counter}" in existing_names:
        counter += 1
    return f"{base} {counter}"