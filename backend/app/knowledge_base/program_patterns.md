# Program Design Patterns

Common program split patterns the AI can select from based on user goals,
experience level, and days per week.

---

## Pattern 1: Push / Pull / Legs (PPL)

**Best for:** Hypertrophy, intermediate-advanced, 3-6 days/week

**3-Day PPL (Mon/Wed/Fri):**
- Push (chest, shoulders, triceps)
- Pull (back, biceps, rear delts)
- Legs (quads, hamstrings, glutes, calves)

**4-Day PPL Upper/Lower Hybrid:**
- Upper Push (chest, shoulders, triceps)
- Upper Pull (back, biceps, rear delts)
- Lower Body (quads, hamstrings, glutes, calves)
- Upper Body Mix (light push + pull)

**6-Day PPL (Mon-Sat):**
- Push
- Pull
- Legs
- Push (volume)
- Pull (volume)
- Legs (volume)

**Notes:**
- Each muscle group hit 2x/week in 6-day version
- Excellent for hypertrophy
- Allows specialization (chest-focused vs shoulder-focused push days)

---

## Pattern 2: Upper / Lower Split

**Best for:** Strength + hypertrophy, intermediate, 4 days/week

**4-Day Upper/Lower (Mon/Tue/Thu/Fri):**
- Upper Body (bench, rows, overhead press, pull-ups, accessories)
- Lower Body (squat, RDL, leg press, leg curl, calf raises, accessories)
- Upper Body (variation day: incline, chest-supported rows, etc.)
- Lower Body (variation day: front squat, sumo DL, leg curl, etc.)

**Notes:**
- Each muscle group hit 2x/week
- Allows heavy compound + accessory work
- Good balance of strength and volume

---

## Pattern 3: Full Body

**Best for:** Beginners, time-constrained, strength foundations, 3 days/week

**3-Day Full Body (Mon/Wed/Fri or similar):**
- Compound lift 1 (squat variation)
- Compound lift 2 (hinge variation: deadlift, RDL)
- Compound lift 3 (push variation: bench, OHP)
- Compound lift 4 (pull variation: row, pull-up)
- Accessory 1 (isolation: leg curl, leg extension, etc.)
- Accessory 2 (isolation: bicep curl, tricep extension, etc.)
- Core work (plank, dead bug, etc.)

**Notes:**
- Each session trains all major muscle groups
- High frequency per muscle (2-3x/week)
- Excellent for beginners (skill acquisition, balanced development)

---

## Pattern 4: Bro Split (Body Part Per Day)

**Best for:** Bodybuilding, intermediates with high recovery, 5-6 days/week

**5-Day Bro Split:**
- Monday: Chest
- Tuesday: Back
- Wednesday: Shoulders
- Thursday: Legs
- Friday: Arms (biceps + triceps)
- Saturday: Weak point / cardio
- Sunday: Rest

**6-Day Bro Split:**
- Monday: Chest
- Tuesday: Back
- Wednesday: Shoulders
- Thursday: Legs
- Friday: Arms
- Saturday: Chest/Back mix
- Sunday: Rest

**Notes:**
- Each muscle hit 1x/week
- High volume per session
- Lower frequency (recovery issue for natural lifters)
- Less optimal than higher-frequency splits for most people

---

## Pattern 5: Arnold Split

**Best for:** Bodybuilding, advanced, 6 days/week

**6-Day Arnold Split:**
- Monday: Chest + Back
- Tuesday: Shoulders + Arms
- Wednesday: Legs + Lower Back
- Thursday: Chest + Back
- Friday: Shoulders + Arms
- Saturday: Legs + Lower Back
- Sunday: Rest

**Notes:**
- Antagonistic pairing (push + pull each day)
- High volume, high frequency
- Common in golden-era bodybuilding

---

## Pattern 6: Powerbuilding Hybrid

**Best for:** Strength + size, intermediates, 4-5 days/week

**4-Day Powerbuilding:**
- Day 1: Heavy Squat + Chest Accessories
- Day 2: Heavy Bench + Back Accessories
- Day 3: Heavy Deadlift + Shoulder Accessories
- Day 4: Volume Day (high-rep compounds + isolation)

**5-Day Powerbuilding:**
- Day 1: Heavy Squat + Push Accessories
- Day 2: Heavy Bench + Pull Accessories
- Day 3: Heavy Deadlift + Upper Accessories
- Day 4: Volume Upper (hypertrophy focus)
- Day 5: Volume Lower (hypertrophy focus)

**Notes:**
- Prioritizes main lifts (strength)
- Adds volume work for hypertrophy
- Requires good recovery

---

## Pattern 7: 5-Day with Dedicated VO2 Max (Cobalt Fury / Sanguine Thunder Model)

**Best for:** Hybrid training, intermediates-advanced, 5 days/week

**5-Day Hybrid:**
- Monday: Lower Body (compound focus) + Core + Zone 2 Cardio
- Tuesday: Upper Push + HIIT Finisher
- Wednesday: **VO2 Max Isolation (Norwegian 4x4)** — standalone session
- Thursday: Upper Pull + Metabolic Finisher
- Friday: Lower Body (volume) + Core + Finisher

**4-Day Hybrid (No Standalone VO2):**
- Monday: Lower Body (compound focus) + Core + Zone 2 Cardio
- Tuesday: Upper Push + HIIT Finisher
- Wednesday: Rest
- Thursday: Upper Pull + Metabolic Finisher
- Friday: Lower Body (volume) + Core + Finisher

**Critical rule:** Norwegian 4x4 is NEVER tacked onto a strength day. It's either a standalone session (5-day) or omitted (4-day). VO2 work in 4-day programs is satisfied by HIIT finishers, not dedicated protocols.

**Notes:**
- Combines strength, hypertrophy, and conditioning
- Wednesday VO2 Max session provides cardiovascular development without compromising strength
- 4-day version maintains conditioning via HIIT finishers

---

## Pattern 8: Longevity / Anti-Aging (Blueprint Model)

**Best for:** All ages, especially 40+, sustainable fitness

**Daily structure (6-8 hours/week total):**
- 30 min strength training
- 30 min cardio (Zone 2 + VO2 Max combined)
- Mobility/flexibility (5-10 min)
- Balance work (daily)

**Weekly structure (3-5 days strength):**
- 3 days full-body strength (compounds + accessories)
- 150 min Zone 2 cardio (walking, cycling, swimming)
- 75 min VO2 Max work (sprints, intervals, Norwegian 4x4)
- Daily mobility (hips, spine, ankles, hamstrings, shoulders)
- Daily balance work (single-leg stands, stability drills)

**Notes:**
- Inspired by Bryan Johnson's Blueprint protocol
- Emphasizes muscle mass for longevity
- Cardiovascular health prioritized
- Recovery and joint health paramount

---

## Selecting a Pattern (AI Decision Logic)

```
IF user_experience == "beginner":
    IF days_per_week <= 3:
        → Pattern 3 (Full Body)
    ELSE:
        → Pattern 2 (Upper/Lower) or Pattern 3
    
IF user_experience == "intermediate":
    IF days_per_week == 3:
        → Pattern 1 (PPL 3-day) or Pattern 3
    IF days_per_week == 4:
        → Pattern 2 (Upper/Lower) or Pattern 7 (4-day Hybrid)
    IF days_per_week == 5:
        → Pattern 7 (5-day Hybrid) or Pattern 4 (Bro)
    IF days_per_week == 6:
        → Pattern 1 (PPL 6-day) or Pattern 5 (Arnold)
    
IF user_experience == "advanced":
    IF days_per_week == 3:
        → Pattern 3 (Full Body, high intensity)
    IF days_per_week == 4:
        → Pattern 6 (Powerbuilding)
    IF days_per_week == 5:
        → Pattern 7 (5-day Hybrid)
    IF days_per_week == 6:
        → Pattern 5 (Arnold) or Pattern 1 (PPL)
    
IF user_goal == "longevity":
    → Pattern 8 (Blueprint)
IF user_goal == "hybrid":
    → Pattern 7 (5-day or 4-day)
```

---

## Volume Landmarks (Sets Per Week Per Muscle Group)

| Muscle Group | Maintenance | Minimum Effective | Optimal | Maximum Adaptive |
|---|---|---|---|---|
| Chest | 4-6 sets | 8-10 sets | 10-16 sets | 18-22 sets |
| Back | 4-6 sets | 8-10 sets | 10-16 sets | 18-22 sets |
| Shoulders | 4-6 sets | 8-10 sets | 10-16 sets | 18-22 sets |
| Biceps | 2-4 sets | 6-8 sets | 10-14 sets | 16-20 sets |
| Triceps | 2-4 sets | 6-8 sets | 10-14 sets | 16-20 sets |
| Quads | 4-6 sets | 8-10 sets | 12-18 sets | 20-25 sets |
| Hamstrings | 4-6 sets | 6-8 sets | 10-16 sets | 18-22 sets |
| Glutes | 2-4 sets | 6-8 sets | 10-16 sets | 18-22 sets |
| Calves | 2-4 sets | 6-8 sets | 10-14 sets | 16-20 sets |
| Core | 2-4 sets | 6-8 sets | 10-16 sets | 20+ sets |

**Notes:**
- Beginners: Stay in "Minimum Effective" range
- Intermediates: Target "Optimal" range
- Advanced: Can push to "Maximum Adaptive" for lagging muscles
- Deload weeks: Drop to 50% of working volume

---

## Recovery Rules (Muscle Group Spacing)

**Critical:** Never train the same primary muscle group on consecutive days.

| Pattern | Frequency | Minimum Days Between Sessions |
|---|---|---|
| 3-Day PPL | 2x/week per muscle | 2-3 days |
| 4-Day Upper/Lower | 2x/week per muscle | 2-3 days |
| 3-Day Full Body | 2-3x/week per muscle | 1-2 days |
| 5-Day Bro Split | 1x/week per muscle | 6-7 days |
| 5-Day Hybrid | 1-2x/week per muscle | 2-4 days |
| 6-Day PPL | 2-3x/week per muscle | 1-2 days |

**Example 4-Day Upper/Lower (Mon/Tue/Thu/Fri):**
- Mon: Upper → Tue: Lower → Thu: Upper → Fri: Lower
- Upper is trained Mon + Thu (3 days apart) ✓
- Lower is trained Tue + Fri (3 days apart) ✓

**Example 6-Day PPL (Mon-Sat):**
- Mon: Push → Tue: Pull → Wed: Legs → Thu: Push → Fri: Pull → Sat: Legs
- Push is trained Mon + Thu (3 days apart) ✓
- Pull is trained Tue + Fri (3 days apart) ✓
- Legs is trained Wed + Sat (2 days apart) ✓ (still sufficient recovery for most)

---

## Tempo Guidelines

| Goal | Tempo (Eccentric-Pause-Concentric) | Rep Range | Rest |
|---|---|---|---|
| Strength | 3-1-1 or 4-1-1 | 4-6 reps | 120-180s |
| Hypertrophy | 2-1-2 or 3-1-1 | 8-12 reps | 60-90s |
| Metabolic Hypertrophy | 1-0-1 or X-0-X | 12-15 reps | 45-60s |
| Endurance / Conditioning | X-0-X or 1-0-1 | 15-20+ reps | 30-45s |
| Power | X-0-X (explosive concentric) | 1-5 reps | 120-180s |

**Notes:**
- First number = eccentric (lowering) phase in seconds
- Middle number = pause at bottom (isometric hold)
- Last number = concentric (lifting) phase in seconds
- "X" = explosive (as fast as possible)
- "0" = no pause (smooth transition)

---

## Cardio Integration

**Three cardio modalities, each with a purpose:**

1. **Zone 2 (Low Intensity Steady State)**
   - Purpose: Mitochondrial health, fat oxidation, recovery
   - Heart rate: 60-70% of max HR
   - Test: Can hold a conversation
   - Volume: 150 min/week minimum
   - Examples: Walking, jogging, cycling, swimming, rowing (moderate)
   - Placement: After strength work or on rest days

2. **VO2 Max (High Intensity Intervals)**
   - Purpose: Cardiovascular peak, aerobic ceiling
   - Heart rate: 80-90% of max HR
   - Volume: 75 min/week
   - Examples: Sprints, Norwegian 4x4, rowing intervals, bike sprints
   - Placement: Standalone session OR high-intensity finisher (NOT both)
   - Critical: Never stack on the same day as heavy strength work

3. **HIIT / Metabolic Finishers**
   - Purpose: Conditioning, EPOC, work capacity
   - Heart rate: 75-90% of max HR (variable)
   - Volume: 10-20 min per session
   - Examples: Battle ropes, kettlebell swings, rower sprints, burpees
   - Placement: At the END of strength sessions
   - Format: EMOM, AMRAP, Tabata, Rounds for Time

**Rule:** Don't combine VO2 Max standalone session with HIIT finisher on the same day. Pick one or the other.

---

## Summary for AI

When generating a program, the AI should:

1. **Select a pattern** based on experience + days/week + goal
2. **Assign muscle group focus** to each day
3. **Check recovery spacing** (no consecutive same-muscle days)
4. **Hit volume landmarks** for each muscle group across the week
5. **Apply user's equipment** to select specific exercises
6. **Apply user's limitations** to exclude/substitute movements
7. **Set tempo + rep ranges** based on user's primary goal
8. **Add cardio** (Zone 2 + VO2 Max + HIIT) per the integration rules
9. **Assign code-name** using the Operation [Adjective] [Noun] format
