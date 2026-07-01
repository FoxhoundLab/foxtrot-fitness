"""Generate Operation [Adjective] [Noun] code-names with collision detection."""

import random

# Mix of fun/silly and military/intense — the generator picks randomly,
# so you might get Operation Cobalt Fury or Operation Classy Cat or Operation Zesty Phantom.

ADJECTIVES = [
    # Fun / silly
    "Classy", "Zesty", "Sassy", "Fancy", "Groovy", "Bouncy",
    "Dapper", "Snazzy", "Cozy", "Peppy", "Cheeky", "Jazzy",
    "Spunky", "Wiggly", "Goofy", "Silly", "Fluffy", "Sparkly",
    "Squishy", "Toasty", "Breezy", "Chill", "Mighty", "Turbo",
    # Military / intense
    "Crimson", "Cobalt", "Sanguine", "Obsidian", "Titanium", "Iron",
    "Phantom", "Rogue", "Ironclad", "Brutal", "Savage", "Feral",
    "Onyx", "Steel", "Thunder", "Solar", "Lunar", "Arctic",
    "Inferno", "Tempest", "Cyclone", "Glacial", "Magma", "Shadow",
    "Diamond", "Neon", "Pulse", "Voltage", "Apex", "Vortex",
]

NOUNS = [
    # Fun / silly
    "Cat", "Corgi", "Axolotl", "Llama", "Penguin", "Raccoon",
    "Waffle", "Quokka", "Mango", "Capybara", "Badger", "Otter",
    "Narwhal", "Wombat", "Platypus", "Bagel", "Pickle", "Pretzel",
    "Muffin", "Burrito", "Dumpling", "Noodle", "Biscuit", "Marshmallow",
    "Tater", "Sprout", "Cinnamon", "Mochi", "Froggy", "Panda",
    # Military / intense
    "Fury", "Protocol", "Sentinel", "Bastion", "Reckoning",
    "Vanguard", "Falcon", "Hammer", "Breaker", "Storm", "Raptor",
    "Colossus", "Bulwark", "Catalyst", "Engine", "Crucible",
    "Phoenix", "Titan", "Wolverine", "Mammoth", "Grizzly",
    "Jackal", "Cobra", "Panther", "Wolfhound", "Typhoon",
]

RESERVED = {"Genesis Protocol", "Cobalt Fury", "Sanguine Thunder"}


def generate_name() -> str:
    """Generate a random Operation name."""
    return f"Operation {random.choice(ADJECTIVES)} {random.choice(NOUNS)}"


def is_collision(name: str, existing_names: set) -> bool:
    """Check if name collides with existing or reserved names."""
    return name in existing_names or name in RESERVED


def generate_unique_name(existing_names: set, max_retries: int = 5) -> str:
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