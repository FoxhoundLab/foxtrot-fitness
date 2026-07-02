"""Generate Operation [Adjective] [Noun] code-names with collision detection.

Word lists are organized into thematic categories (cosmic, regal, mechanical, edible,
animals, weather, mythical, tech, fun, military) so you get a wide variety of vibes:
Operation Cobalt Fury (military), Operation Classy Cat (fun), Operation Quasar Wombat
(mixed), Operation Vortex Pretzel (silly), Operation Majestic Basilisk (regal+mythical).

Total combinations: 108 adjectives × 84 nouns = 9,072 unique names.
With collision retries and reserved-name protection, you can generate thousands of
programs before seeing a duplicate.
"""

import random

# =============================================================================
# ADJECTIVES — 108 words across 10 thematic categories
# =============================================================================

ADJECTIVES = [
    # ─── Cosmic / Space ───────────────────────────────────────────────────────
    "Lunar", "Solar", "Stellar", "Nebula", "Quasar", "Pulsar",
    "Eclipse", "Astral", "Galactic", "Cosmic", "Celestial", "Plasma",

    # ─── Regal / Noble ────────────────────────────────────────────────────────
    "Majestic", "Sovereign", "Imperial", "Crown", "Throne",
    "Regal", "Noble", "Royal", "Scepter", "Monarch", "Dynasty", "Crowned",

    # ─── Mechanical / Industrial ──────────────────────────────────────────────
    "Chrome", "Piston", "Gear", "Forge", "Anvil",
    "Steel", "Iron", "Brass", "Copper", "Titanium", "Alloy", "Bolt",

    # ─── Edible / Food (silly side) ───────────────────────────────────────────
    "Spicy", "Buttery", "Crispy", "Zesty", "Tangy",
    "Sweet", "Salty", "Sour", "Bitter", "Toasty", "Cinnamon", "Peppered",

    # ─── Animals (silly side) ──────────────────────────────────────────────────
    "Classy", "Sassy", "Dapper", "Snazzy", "Cheeky",
    "Spunky", "Goofy", "Silly", "Fluffy", "Sparkly", "Bouncy", "Peppy",

    # ─── Weather / Elements ───────────────────────────────────────────────────
    "Tempest", "Cyclone", "Monsoon", "Blizzard", "Haze",
    "Thunder", "Lightning", "Storm", "Gale", "Tornado", "Hurricane", "Misty",

    # ─── Mythical / Fantasy ───────────────────────────────────────────────────
    "Phoenix", "Griffin", "Kraken", "Hydra", "Basilisk",
    "Dragon", "Sphinx", "Chimera", "Pegasus", "Leviathan", "Cerberus", "Wyvern",

    # ─── Tech / Digital ───────────────────────────────────────────────────────
    "Cipher", "Quantum", "Binary", "Vector", "Echo",
    "Neon", "Voltage", "Pulse", "Pixel", "Circuit", "Glitch", "Vortex",

    # ─── Military / Intense ───────────────────────────────────────────────────
    "Crimson", "Cobalt", "Obsidian", "Phantom", "Rogue",
    "Ironclad", "Brutal", "Savage", "Feral", "Onyx", "Shadow", "Stealth",

    # ─── Premium / High-Impact ────────────────────────────────────────────────
    "Apex", "Brutal", "Savage", "Elite", "Prime",
    "Ultra", "Supreme", "Maximum", "Optimal", "Peak", "Zenith", "Apex",
]

# =============================================================================
# NOUNS — 84 words across 8 thematic categories
# =============================================================================

NOUNS = [
    # ─── Animals (silly side) ──────────────────────────────────────────────────
    "Cat", "Corgi", "Axolotl", "Llama", "Penguin", "Raccoon",
    "Quokka", "Capybara", "Badger", "Otter", "Narwhal", "Wombat",
    "Platypus", "Froggy", "Panda", "Falcon", "Cobra", "Jackal",

    # ─── Edible / Food (silly side) ───────────────────────────────────────────
    "Waffle", "Mango", "Bagel", "Pickle", "Pretzel",
    "Muffin", "Burrito", "Dumpling", "Noodle", "Biscuit", "Marshmallow",
    "Tater", "Sprout", "Mochi", "Taco", "Sushi", "Ramen",

    # ─── Military / Intense ───────────────────────────────────────────────────
    "Fury", "Protocol", "Sentinel", "Bastion", "Reckoning",
    "Vanguard", "Hammer", "Breaker", "Storm", "Raptor",
    "Colossus", "Bulwark", "Catalyst", "Engine", "Crucible",
    "Titan", "Wolverine", "Mammoth", "Grizzly", "Panther",

    # ─── Mythical / Fantasy ───────────────────────────────────────────────────
    "Phoenix", "Dragon", "Griffin", "Kraken", "Hydra",
    "Basilisk", "Sphinx", "Pegasus", "Leviathan", "Wyvern", "Chimera", "Cerberus",

    # ─── Tech / Digital ───────────────────────────────────────────────────────
    "Cipher", "Vector", "Echo", "Glitch", "Pulse",
    "Circuit", "Quantum", "Binary", "Pixel", "Node", "Matrix", "Code",

    # ─── Weather / Elements ───────────────────────────────────────────────────
    "Typhoon", "Cyclone", "Monsoon", "Blizzard", "Haze",
    "Lightning", "Tempest", "Tornado", "Hurricane", "Gale", "Thunder", "Maelstrom",

    # ─── Tools / Weapons ──────────────────────────────────────────────────────
    "Sword", "Shield", "Arrow", "Blade", "Hammer",
    "Axe", "Lance", "Spear", "Mace", "Saber", "Dagger", "Warhammer",

    # ─── Premium / High-Impact ────────────────────────────────────────────────
    "Apex", "Zenith", "Peak", "Prime", "Elite",
    "Supreme", "Maximum", "Optimal", "Ultima", "Vanguard", "Sovereign", "Crowned",
]

# Reserved names (used by example programs, never generate these)
RESERVED = {
    "Genesis Protocol",  # Foundational strength program
    "Cobalt Fury",       # High-volume hypertrophy
    "Sanguine Thunder",  # Hybrid strength + aerobic
}


def generate_name() -> str:
    """Generate a random Operation [Adjective] [Noun] name.

    Picks randomly from all adjectives and nouns, so you might get:
    - Operation Cobalt Fury (military + military)
    - Operation Classy Cat (fun + animal)
    - Operation Quasar Wombat (cosmic + animal)
    - Operation Majestic Basilisk (regal + mythical)
    - Operation Vortex Pretzel (tech + edible)
    """
    return f"Operation {random.choice(ADJECTIVES)} {random.choice(NOUNS)}"


def is_collision(name: str, existing_names: set) -> bool:
    """Check if name collides with existing or reserved names."""
    return name in existing_names or name in RESERVED


def generate_unique_name(existing_names: set, max_retries: int = 10) -> str:
    """Generate a unique name with collision retries.

    With 108 × 84 = 9,072 possible combinations and 3 reserved names,
    collision is rare. 10 retries is more than enough.
    """
    for _ in range(max_retries):
        name = generate_name()
        if not is_collision(name, existing_names):
            return name
    # Fallback: append a number
    base = generate_name()
    counter = 2
    while f"{base} {counter}" in existing_names or f"{base} {counter}" in RESERVED:
        counter += 1
    return f"{base} {counter}"


# Stats for the curious
if __name__ == "__main__":
    print(f"Adjectives: {len(ADJECTIVES)}")
    print(f"Nouns: {len(NOUNS)}")
    print(f"Possible combinations: {len(ADJECTIVES) * len(NOUNS):,}")
    print(f"Reserved names: {len(RESERVED)}")
    print()
    print("Sample names:")
    for _ in range(10):
        print(f"  {generate_name()}")
