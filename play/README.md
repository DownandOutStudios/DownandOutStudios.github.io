# Fuse Frenzy browser campaign playtest

Separate browser port based on the Windows build reached through the user's Fuse Frenzy - Play desktop shortcut: Shareable-2026-10-12-HiddenGates, rebuilt13October2026. This is not an Unreal executable running inside the browser.

The first campaign map reuses the archived build's generator seed20261001, exact80wooden crates,20×30logical grid, 24 hidden rewards (three of each type) and three bot spawn cells. Existing updated character/clockwork enemy meshes, gate, floor, power-up geometry, textures and looped music are converted/copied for web use. The original Unreal project and Windows build are not edited.

Serve this directory over HTTP/HTTPS. All runtime assets and Three.js are local, with no streaming service, account or server-side game session. Each visitor has an independent in-memory run on their own device. Desktop WebGL2 browsers recommended. Closing/reloading the page resets the run. Two tested browser levels with gate travel, persistent lives and upgrades; remaining UE5 campaign, hidden rooms, bosses, online multiplayer and achievement progression are not included yet.

Every available level hides three of each of the eight pickup types under distinct wooden crates. No level-skip controls are provided.

WASD/arrows: move. Space: bomb. Q/E: rotate. Escape: pause. F: remote detonation when collected. Sound starts off and can be enabled by the user. Reports download locally and are not automatically transmitted. Music and effects pause when the browser is hidden.

Third-party graphics runtime: Three.js0.180.0, MIT notice in vendor/LICENSE. Font: Nunito, OFL notice in assets/OFL.txt. Game artwork/models/audio reuse the owner's project assets; detailed private source/provenance evidence remains outside this repository. No independent legal clearance claim added.
