# Fuse Frenzy browser campaign playtest

Ten campaign arenas plus Armourdrillo between Levels 5 and 6, including the Furnace King final boss, based on the Windows build reached through the owner's desktop shortcut. This is a separate browser port. The original Unreal project and Windows package are not modified.

All ten stages reuse their original layouts, source textures, backgrounds and looped theme tracks. Updated character and clockwork meshes, power-up geometry and teleport gate are browser copies of existing assets. Each level hides 24 pickups under separate wooden crates: three of each of the eight power-up types.

Defeat the enemies, then walk into the active gate. Lives and upgrades carry between arenas. Scores appear when the run ends or after completing Level 10. No level-skip control is provided. Each visitor runs an independent local game; no streaming host, account or shared game server is required.

Controls: WASD/arrows move, Space places a bomb, Q/E rotates, Escape pauses, F detonates remote bombs when collected. Sound starts off. The report button downloads a local report and does not send it automatically.

Desktop WebGL2 browser recommended. Reloading starts a fresh run. Optional UE5 hidden rooms, online multiplayer and achievement awards are not part of this browser port.

Third-party runtime: Three.js 0.180.0, MIT notice in vendor/LICENSE. Nunito font, OFL in assets/OFL.txt. Game asset provenance and private test records are stored outside this public repository. No additional asset-rights clearance claim is made here.

Menu update: original sky-city menu backgrounds and typography, single-player selection, automatically rotating current character models, pause, volume/mute, fullscreen, render resolution, follow/overview camera, remappable controls, eight-item field guide, scoring and credits. Campaign checkpoints and run records are browser-local. Loading a checkpoint restarts the saved arena with its saved lives, upgrades, score and time. Multiplayer modes, alternate solo rules, achievement awards and reward outfits are explicitly unavailable; their screens do not pretend those features are implemented. Hidden rooms remain excluded until the studio website work.

Teegwa is temporarily excluded from browser character selection, wardrobe and model loading. Old Teegwa preferences fall back to the Mechanic; old Teegwa checkpoints are not offered for loading.

After clearing Level 10 and using the final gate, the ending thanks testers and offers the report window. The studio homepage and report window show the existing studio email. Email links open the visitor's mail app; nothing is sent automatically.

Armourdrillo reuses the existing mini-boss model, native boss cover layout, dedicated original Warden background, Pirate level textures and the Level 5 looped theme used by the native game. It has four health, 1.6-second attack warnings and a two-tile blast cross. Its gate leads to Level 6 only after defeat. Mini-boss checkpoints resume the mini-boss, and upgrades/lives carry across both gates. This arena also hides three of every upgrade beneath 24 wooden crates.
