"""5-pillar post-generation validation gate.

The heart of the Foxtrot Fitness system. After the LLM generates a program,
this module structurally validates that all 5 pillars of the Bryan Johnson
blueprint are present. If any pillar is missing, the pipeline regenerates.
"""
from typing import Tuple

COMPOUND_PATTERNS = ["squat", "deadlift", "bench", "row", "press", "pull", "hinge"]
MOBILITY_KEYWORDS = ["warm", "mobility", "foam", "stretch", "cool", "dynamic", "prime", "reset"]


def validate_program(program: dict) -> Tuple[bool, list[str]]:
    """Returns (is_valid, missing_pillars)."""
    missing = []
    days = program.get("design_view", {}).get("days", [])

    # 1. Strength — compound movements present
    has_strength = any(
        any(p in m.get("name", "").lower() for p in COMPOUND_PATTERNS)
        for day in days
        for m in day.get("movements", [])
    )
    if not has_strength:
        missing.append("strength")

    # 2. Zone 2 — cardio block >= 20 min labeled zone-2
    has_zone2 = any(
        (day.get("cardio") or {}).get("type") == "zone-2"
        and (day.get("cardio") or {}).get("duration_minutes", 0) >= 20
        for day in days
    )
    if not has_zone2:
        missing.append("zone2")

    # 3. VO2 Max — Norwegian 4x4 OR HIIT finisher OR dedicated cardio day
    has_vo2 = (
        any("norwegian" in str(day).lower() for day in days)
        or any(day.get("finisher") for day in days)
        or any((day.get("cardio") or {}).get("type") == "vo2-max" for day in days)
    )
    if not has_vo2:
        missing.append("vo2max")

    # 4. Mobility — warm-up/cool-down/flexibility notes
    has_mobility = any(
        any(kw in str(day).lower() for kw in MOBILITY_KEYWORDS)
        for day in days
    )
    if not has_mobility:
        missing.append("mobility")

    # 5. Recovery — rest day or active recovery (< 7 training days)
    has_recovery = (
        len(days) < 7
        or any(
            "recovery" in day.get("name", "").lower()
            or "rest" in day.get("name", "").lower()
            for day in days
        )
    )
    if not has_recovery:
        missing.append("recovery")

    return (len(missing) == 0, missing)


def regenerate_flag(missing_pillars: list[str]) -> str:
    """Return the regeneration flag for the LLM."""
    return f"Regenerate — missing pillars: {', '.join(missing_pillars)}"