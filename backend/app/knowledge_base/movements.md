# Movement Categories → Specific Exercises → Equipment Mapping

This file maps movement patterns to specific exercises and required equipment.
Used by the AI generation pipeline to select appropriate exercises based on user
equipment list and limitations.

---

## 1. Cardiovascular Equipment

### Treadmill (motorized, incline, curved, manual)
**Equipment IDs:** `treadmill`, `incline-trainer`, `decline-treadmill`, `curved-treadmill`, `manual-treadmill`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Walking / brisk walking | Quadriceps, hamstrings, glutes, calves | Zone 2 default |
| Jogging / running | Quads, hamstrings, glutes, calves + core stabilizers | Steady-state |
| Incline walking/running | Glutes, hamstrings, calves (emphasized), quads | High glute activation |
| Sprint intervals | Fast-twitch fibers in quads, hamstrings, glutes | HIIT/VO2 Max |
| Backward walking (some models) | Hamstrings, glutes, calves | Knee-friendly option |

### Elliptical & Arc Trainer
**Equipment IDs:** `elliptical`, `arc-trainer`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Forward striding | Quads, hamstrings, glutes, calves | Default |
| Backward striding | Hamstrings, glutes (more emphasis) | Knee-friendly |
| High resistance / incline | Glutes, hamstrings intensely | |
| Arms + legs together | Upper back, shoulders, biceps, triceps + lower body | Full body |

### Stationary Bikes (Upright, Recumbent, Spin)
**Equipment IDs:** `upright-bike`, `recumbent-bike`, `spin-bike`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Steady-state cycling | Quads, hamstrings, glutes, calves | Zone 2 |
| High-resistance intervals / sprints | Quads and glutes primarily | HIIT |
| Standing climbs (spin bikes) | Glutes, hamstrings, calves + core | High activation |

### Assault / Air / Echo Bikes
**Equipment IDs:** `assault-bike`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Steady pedaling + arm pumping | Full body: quads, hamstrings, glutes, calves, shoulders, back, arms, core | Conditioning |
| All-out sprints | High-intensity full-body conditioning | HIIT/VO2 Max |

### Rowing Machine
**Equipment IDs:** `rower`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Standard rowing stroke | Lats, rhomboids, traps, rear delts, biceps, forearms + quads, hamstrings, glutes, core | Full body pull |
| High-pull variations | Emphasizes legs and back | Power-focused |
| Arms-only or legs-only drills | Isolation of upper or lower body | Technique work |

### Stair Climbers / Stairmaster / StepMill
**Equipment IDs:** `stair-climber`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Steady climbing | Quads, glutes, hamstrings, calves | Zone 2 |
| High step rate / resistance | Glutes and quads emphasized | HIIT |
| Side-stepping (some models) | Adductors and abductors | Hip stability |

### VersaClimber
**Equipment IDs:** `versaclimber`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Standard climbing | Full body: shoulders, back, arms, core, quads, hamstrings, glutes, calves | Conditioning |
| High-intensity intervals | Excellent full-body conditioning | HIIT |

### SkiErg
**Equipment IDs:** `ski-erg`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Double-pole pulling | Lats, traps, rear delts, triceps, core + legs for drive | VO2 Max |
| Alternating arms | Similar but more unilateral | Unilateral balance |

### Jacob's Ladder
**Equipment IDs:** `jacobs-ladder`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Climbing motion | Full posterior chain (back, glutes, hamstrings) + shoulders, arms, core | Full body |

---

## 2. Selectorized (Pin-Loaded) Strength Machines

### Chest Press Machine
**Equipment IDs:** `chest-press-machine`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Seated chest press | Pectoralis major, anterior deltoids, triceps | |
| Neutral grip variation | Same muscles, less shoulder stress | Joint-friendly |
| Single-arm (if available) | Unilateral chest/shoulder | Correct imbalances |

### Incline Chest Press Machine
**Equipment IDs:** `incline-chest-press-machine`

| Movement | Muscle Groups |
|---|---|
| Incline press | Upper pectoralis major, anterior deltoids, triceps |

### Pec Deck / Butterfly / Chest Fly Machine
**Equipment IDs:** `pec-deck`

| Movement | Muscle Groups |
|---|---|
| Chest fly | Pectoralis major (sternal portion), anterior deltoids |

### Shoulder Press Machine
**Equipment IDs:** `shoulder-press-machine`

| Movement | Muscle Groups |
|---|---|
| Overhead press | Anterior and medial deltoids, triceps, upper trapezius |

### Lateral Raise Machine
**Equipment IDs:** `lateral-raise-machine`

| Movement | Muscle Groups |
|---|---|
| Lateral raises | Medial deltoids |

### Rear Delt Fly / Reverse Pec Deck
**Equipment IDs:** `rear-delt-machine`

| Movement | Muscle Groups |
|---|---|
| Reverse fly | Rear deltoids, rhomboids, middle trapezius |

### Lat Pulldown Machine
**Equipment IDs:** `lat-pulldown-machine`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Wide-grip pulldown | Lats, biceps, rear delts, lower traps | |
| Close-grip or neutral-grip | More biceps and lower lats emphasis | Joint-friendly |
| Behind-the-neck (less recommended) | Upper back and lats | Not recommended for most |

### Seated Row / Low Row Machine
**Equipment IDs:** `seated-row-machine`, `low-pulley`

| Movement | Muscle Groups |
|---|---|
| Seated row | Lats, rhomboids, middle traps, rear delts, biceps |

### Assisted Pull-Up / Chin-Up Machine
**Equipment IDs:** `assisted-pull-up-machine`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Assisted pull-ups | Lats, biceps, rear delts, core | Beginner-friendly |
| Assisted chin-ups | More biceps emphasis | |

### Assisted Dip Machine
**Equipment IDs:** `assisted-dip-machine`

| Movement | Muscle Groups |
|---|---|
| Dips | Chest (lower pecs), triceps, anterior deltoids |

### Bicep Curl Machine
**Equipment IDs:** `bicep-curl-machine`

| Movement | Muscle Groups |
|---|---|
| Seated or preacher curl | Biceps brachii, brachialis |

### Tricep Extension / Pushdown Machine
**Equipment IDs:** `tricep-extension-machine`

| Movement | Muscle Groups |
|---|---|
| Overhead or pushdown variations | Triceps brachii |

### Leg Press Machine
**Equipment IDs:** `leg-press`, `horizontal-leg-press`, `45-leg-press`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Leg press | Quads, glutes, hamstrings | |
| Feet high and wide | More glutes and hamstrings | Hip-dominant |
| Feet low and narrow | More quadriceps | Quad-dominant |
| Single-leg press | Unilateral strength + stabilizers | Correct imbalances |

### Leg Extension Machine
**Equipment IDs:** `leg-extension`

| Movement | Muscle Groups |
|---|---|
| Leg extensions | Quads (vastus lateralis, medialis, rectus femoris) |

### Seated / Lying Leg Curl Machine
**Equipment IDs:** `seated-leg-curl`, `lying-leg-curl`

| Movement | Muscle Groups |
|---|---|
| Leg curls | Hamstrings (biceps femoris, semitendinosus, semimembranosus) |

### Calf Raise Machine (Standing or Seated)
**Equipment IDs:** `calf-raise-machine`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Standing calf raises | Gastrocnemius | |
| Seated calf raises | Soleus | Deeper soleus activation |

### Hip Abductor / Adductor Machines
**Equipment IDs:** `hip-abductor-machine`, `hip-adductor-machine`

| Movement | Muscle Groups |
|---|---|
| Abduction | Gluteus medius and minimus |
| Adduction | Adductor longus, magnus, brevis |

### Glute Kickback / Hip Thrust Machine
**Equipment IDs:** `glute-kickback-machine`

| Movement | Muscle Groups |
|---|---|
| Kickbacks or thrusts | Glutes (gluteus maximus), hamstrings |

### Abdominal Crunch Machine
**Equipment IDs:** `abdominal-crunch-machine`

| Movement | Muscle Groups |
|---|---|
| Crunches | Rectus abdominis, obliques (secondary) |

### Rotary Torso Machine
**Equipment IDs:** `rotary-torso-machine`

| Movement | Muscle Groups |
|---|---|
| Twists | Internal and external obliques, rectus abdominis |

### Back Extension Machine
**Equipment IDs:** `back-extension-machine`

| Movement | Muscle Groups |
|---|---|
| Back extensions | Erector spinae, glutes, hamstrings |

---

## 3. Plate-Loaded Machines

### Plate-Loaded Chest Press / Incline Press
**Equipment IDs:** `plate-loaded-chest-press`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Plate-loaded press | Pectoralis major, anterior deltoids, triceps | More stabilizer involvement than selectorized |

### Iso-Lateral Chest Press / Row
**Equipment IDs:** `iso-lateral-chest-press`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Independent arm press | Same as above + better balance correction | Unilateral training |

### T-Bar Row Machine
**Equipment IDs:** `t-bar-row-machine`

| Movement | Muscle Groups |
|---|---|
| T-bar rows | Lats, rhomboids, middle traps, biceps, rear delts |

### Hack Squat Machine
**Equipment IDs:** `hack-squat`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Hack squats | Quads, glutes, hamstrings | Less lower back stress than barbell squats |

### Belt Squat Machine
**Equipment IDs:** `belt-squat-machine`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Belt squats | Quads, glutes, hamstrings | Minimal spinal loading (back-friendly) |

### Pendulum / V-Squat Machine
**Equipment IDs:** `pendulum-squat`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Squat variations | Quads, glutes, hamstrings | Unique arc of motion |

### Glute Drive / Hip Thrust Machine (Plate-Loaded)
**Equipment IDs:** `plate-loaded-glute-drive`

| Movement | Muscle Groups |
|---|---|
| Hip thrusts | Gluteus maximus (primary), hamstrings, adductors |

### Plate-Loaded Shoulder Press
**Equipment IDs:** `plate-loaded-shoulder-press`

| Movement | Muscle Groups |
|---|---|
| Press | Shoulders, triceps |

### Plate-Loaded Row / Seated Row
**Equipment IDs:** `plate-loaded-row`

| Movement | Muscle Groups |
|---|---|
| Row | Lats, rhomboids, middle traps, biceps, rear delts |

### Plate-Loaded Lat Pulldown
**Equipment IDs:** `plate-loaded-lat-pulldown`

| Movement | Muscle Groups |
|---|---|
| Pulldown | Lats, biceps, rear delts |

### Ground Base Jammer
**Equipment IDs:** `ground-base-jammer`

| Movement | Muscle Groups |
|---|---|
| Jammer press | Shoulders, triceps, legs, core |
| Shrug | Traps |

---

## 4. Free Weights & Related Equipment

### Olympic Barbells & Variations
**Equipment IDs:** `barbell-olympic`, `training-barbell`, `ez-curl-bar`, `trap-bar`, `safety-squat-bar`, `swiss-bar`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Back squat | Quads, glutes, hamstrings, core, erector spinae | King of leg movements |
| Front squat | Quads (emphasis) + upper back | Less spinal load |
| Deadlift (conventional) | Posterior chain: hamstrings, glutes, erector spinae, lats, traps | Full posterior chain |
| Sumo deadlift | Quads, glutes, adductors + back | More quad emphasis |
| Romanian deadlift (RDL) | Hamstrings, glutes, erector spinae | Hip hinge |
| Bench press (flat) | Pectoralis major, anterior deltoids, triceps | |
| Incline bench press | Upper pecs, anterior delts, triceps | |
| Decline bench press | Lower pecs, triceps | |
| Overhead press | Shoulders, triceps, upper chest, core | |
| Bent-over rows | Lats, rhomboids, traps, biceps, rear delts | |
| EZ-bar curls | Biceps, brachialis | Joint-friendly |
| Skull crushers / close-grip bench | Triceps | |

### Dumbbells (all types)
**Equipment IDs:** `dumbbells`, `pro-style-dumbbells`, `adjustable-dumbbells`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Dumbbell bench press | Chest, shoulders, triceps + more stabilizers than barbell | |
| Single-arm dumbbell rows | Lats, rhomboids, rear delts, biceps | Unilateral |
| Supported dumbbell rows | Same as above with less core demand | |
| Seated/standing DB shoulder press | Deltoids, triceps, core | |
| Lateral raises | Medial deltoids | |
| Front raises | Anterior deltoids | |
| Rear delt flies | Rear deltoids, rhomboids | |
| Bicep curls (various grips) | Biceps and brachialis | |
| Hammer curls | Brachialis, brachioradialis | |
| Concentration curls | Biceps (peak contraction) | |
| Tricep kickbacks | Triceps | |
| Overhead tricep extensions | Triceps (long head) | |
| Goblet squats | Quads, glutes, core | Beginner-friendly |
| Dumbbell lunges | Quads, glutes, hamstrings | |
| Dumbbell Romanian deadlifts | Hamstrings, glutes | |
| Farmer's carries | Grip, traps, core, conditioning | |

### Kettlebells
**Equipment IDs:** `kettlebells`, `competition-kettlebells`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Kettlebell swings (two-hand, one-hand) | Glutes, hamstrings, core, posterior chain + shoulders | Explosive hip hinge |
| Goblet squats | Quads, glutes, core | |
| Turkish get-ups | Full body + stability | Complex movement |
| Kettlebell clean & press | Explosive power + full body | Advanced |
| Kettlebell snatches | Full body power | Olympic-style |
| Single-arm rows | Back, shoulders, core | |
| Windmills | Back, shoulders, core, hamstrings | Mobility + strength |

### Medicine Balls & Wall Balls / Slam Balls
**Equipment IDs:** `medicine-ball`, `wall-ball`, `slam-ball`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Wall balls | Quads, glutes, shoulders, core | Conditioning |
| Slams (overhead or rotational) | Core, shoulders, back, explosive power | |
| Russian twists | Obliques and rotational core | |
| Rotational throws | Rotational core, shoulders | |
| Squat + press throws | Full body power | |

---

## 5. Racks, Benches, Platforms & Smith Machines

### Power Racks / Squat Racks / Half Racks
**Equipment IDs:** `squat-rack`, `half-rack`

Supports: barbell back/front squats, overhead squats, bench press (with safety pins), deadlifts, rack pulls, pull-ups, chin-ups, dips, landmine exercises (with attachment)

### Smith Machine
**Equipment IDs:** `smith-machine`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Smith squats, lunges | Legs with guided path (less stabilizer demand) | Beginner-friendly |
| Smith bench press, incline press | Chest, shoulders, triceps | |
| Smith rows, shrugs | Back, traps | |

### Benches (Flat, Incline, Decline, Adjustable, Preacher)
**Equipment IDs:** `bench`, `incline-bench`, `decline-bench`, `adjustable-bench`, `preacher-curl-bench`, `ab-bench`

Supports: all barbell and dumbbell pressing variations, dumbbell flyes, pullovers, preacher curls, decline sit-ups or leg raises

### GHD Machine
**Equipment IDs:** `ghd`

| Movement | Muscle Groups |
|---|---|
| Glute-ham raises | Glutes, hamstrings, erector spinae |
| Back extensions, hip extensions | Erector spinae, glutes, hamstrings |

### Reverse Hyper Machine
**Equipment IDs:** `reverse-hyper`

| Movement | Muscle Groups |
|---|---|
| Reverse hypers | Glutes, hamstrings, lower back |

### Olympic Lifting Platforms
**Equipment IDs:** `olympic-platform`

Supports: Olympic lifts — clean, jerk, snatch. Full body explosive power (quads, glutes, back, shoulders, traps).

---

## 6. Functional Training, Rig & CrossFit Equipment

### Rigs & Pull-Up Systems
**Equipment IDs:** `squat-rack`, `monkey-bars`, `pull-up-bar`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Pull-ups, chin-ups | Lats, biceps, core | |
| Muscle-ups | Lats, biceps, triceps, chest, core | Advanced |
| Toes-to-bar, hanging leg raises | Core (abs, hip flexors) | |
| Dips, ring dips | Chest, triceps, shoulders | |
| Ring rows, inverted rows | Back and biceps | |
| Skin-the-cat, lever progressions | Advanced core and shoulder strength | |

### Gymnastics Rings
**Equipment IDs:** `rings`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Ring dips, ring push-ups | Chest, triceps, shoulders + massive stabilizer demand | |
| Ring rows | Back, biceps, core | |
| Ring muscle-ups | Full upper body | Advanced |
| Ring support holds, L-sits | Shoulders and core | Stability work |

### Plyometric Boxes
**Equipment IDs:** `plyo-boxes`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Box jumps, step-ups | Quads, glutes, calves, explosive power | |
| Box step-downs | Unilateral leg strength, eccentric focus | |
| Bulgarian split squats (rear foot elevated) | Unilateral leg strength | |
| Decline push-ups (hands on box) | Upper chest emphasis | |

### Battle Ropes
**Equipment IDs:** `battle-ropes`

| Movement | Muscle Groups |
|---|---|
| Alternating waves, double waves, slams | Shoulders, back, arms, core + cardiovascular |
| Side-to-side slams, circles | Rotational core and shoulders |

### Sleds (Prowler, Push/Pull)
**Equipment IDs:** `prowler-sled`, `tank-sled`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Push sleds | Quads, glutes, core, cardiovascular | |
| Pull sleds (backward or forward) | Hamstrings, glutes, back | |
| Loaded carries with sled | Full body | Conditioning |

### Strongman Implements
**Equipment IDs:** `sandbag`, `yoke`, `farmers-walk-handles`, `strongman-log`, `atlas-stones`, `bulgarian-bag`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Sandbag cleans, carries, shouldering | Full body, grip, core | |
| Yoke walks | Traps, core, legs, posture | |
| Farmer's carries | Grip, traps, core, posture | |
| Log presses or cleans | Shoulders, triceps, core | |
| Atlas stone lifts | Posterior chain, grip, core | Advanced |
| Bulgarian bag swings/twists | Core, full body | |

### TRX / Suspension Trainers
**Equipment IDs:** `trx`

| Movement | Muscle Groups | Notes |
|---|---|---|
| TRX rows, chest press, squats, lunges, pike, atomic push-ups | Full body with core emphasis | Almost every movement works stabilizers heavily |

### Climbing Rope
**Equipment IDs:** `climbing-rope`

| Movement | Muscle Groups |
|---|---|
| Rope climb | Lats, biceps, grip, core, legs |

### Cargo Net / Climbing Wall
**Equipment IDs:** `cargo-net`

| Movement | Muscle Groups |
|---|---|
| Climb | Full body, grip |

### Pegboard
**Equipment IDs:** `pegboard`

| Movement | Muscle Groups |
|---|---|
| Pegboard climb | Lats, biceps, grip, core |

---

## 7. Accessories, Mobility & Smaller Equipment

### Resistance Bands / Loop Bands
**Equipment IDs:** `resistance-bands`, `mini-bands`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Band pull-aparts | Rear deltoids, rhomboids | Posture work |
| Band squats, deadlifts, presses | Legs, glutes, upper body with accommodating resistance | |
| Face pulls, lateral walks, monster walks | Shoulders, glutes, hips | Activation |
| Assisted pull-ups or dips | Same as unassisted + assistance | Beginner-friendly |

### Foam Rollers, Lacrosse Balls, Massage Guns
**Equipment IDs:** `foam-roller`, `lacrosse-ball`, `massage-gun`

| Movement | Notes |
|---|---|
| Self-myofascial release on quads, hamstrings, glutes, back, calves, shoulders | Improves mobility and recovery (not strength-building) |

### Stability Balls / Bosu Balls
**Equipment IDs:** `stability-ball`, `bosu`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Stability ball crunches, planks, rollouts | Core | |
| Bosu squats, lunges, push-ups | Balance + legs/upper body + core | |

### Jump Ropes
**Equipment IDs:** `jump-rope`

| Movement | Muscle Groups |
|---|---|
| Double-unders, single-unders | Calves, shoulders, cardiovascular endurance, coordination |

### Ab Rollers / Ab Wheels
**Equipment IDs:** `ab-wheel`

| Movement | Muscle Groups |
|---|---|
| Ab rollouts (kneeling or standing) | Rectus abdominis, obliques, core stabilizers + lats and shoulders |

### Parallettes / Push-Up Stands
**Equipment IDs:** `dip-station`, `push-up-bars`

| Movement | Muscle Groups | Notes |
|---|---|---|
| Push-up variations | Chest, triceps, shoulders | Deeper range of motion |
| L-sits, handstand progressions | Shoulders, core | Advanced bodyweight |

### Indian Clubs / Maces / Clubbells
**Equipment IDs:** `indian-club`

| Movement | Muscle Groups |
|---|---|
| Clubbell swings, mace 360s | Shoulders, core, grip, conditioning |

### Chalk
**Equipment IDs:** `chalk-bowl`

No movements — grip aid for free weights, pull-ups, etc.

### Belts & Wraps
**Equipment IDs:** `weight-belt`, `wrist-wraps`, `lifting-straps`, `dip-belt`, `hand-gripper`

No movements — supportive equipment for heavy lifts and grip work.

---

## Summary

**Total movements catalogued:** ~150+ specific exercise variations

**Coverage:**
- 8 cardio modalities (treadmill, elliptical, bikes, rower, climbers, ski-erg, versa climber, jacob's ladder)
- 25+ selectorized machines
- 10+ plate-loaded machines
- 30+ free weight exercises (barbells, dumbbells, kettlebells, med balls)
- 15+ bodyweight/functional movements (rigs, rings, plyo boxes, strongman)
- 20+ accessory/mobility movements (bands, foam rollers, stability balls, jump rope)

This file is the single source of truth for the AI's equipment-to-exercise mapping. When the AI generates a program, it queries this file to ensure every movement it suggests is supported by the user's equipment list.
