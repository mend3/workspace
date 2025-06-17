# News

---

## Latest

**06-02-2025:**

_Added:_

- Better Interface
- New Cosmetics (3 new hairs)
- Pc Cafe Event System (fulltime)
- Item Upgrade System
  - Upgradable Hero Weapons
  - Upgradable armor sets
  - Unique Event Sets
- New locations
  - Astatine Fortress
  - Hellbound Island
  - Crystal Island
  - Lounge Bar
  - Fafurion's Lair
- New Raid Bosses
  - Enhanced PvE to make it more chalenge and rewardful
  - New and more feral Raid Bosses
  - Awakened Demonic Weapons
    - Zariche and Akamanah found their receptacles into our world and now walks free with their brothers -Keyachi and LaneCoo- bringing devastation wherever they pass by.
- Reinvented Class System: _\* for each class_
  - \*Unique Transformations
  - \*Unique Mounts
  - \*New Unique Skills
- Companion System
  - Kill booses and tame your own companion
    - Baium
    - Fafurion
    - Lindvior
    - Valakas
    - Antharas

_Fixed:_

- Siege Golem animations
- ID's for items
- Shrinked Patch (client files)
- Minor patches to performance and code compliance

_TODO:_

- Multisell lists
- Quests rewards and item id's
- Raid Data
- Spawns and Minions
- Fix Siege Golems (Server Side)

---

**I. Impact on Player Segments:**

These changes directly affect the gameplay experience and opportunities available to specific groups of players.

- **VIPs:** The server has introduced a multi-tiered VIP System with four levels. This system provides escalating benefits based on VIP level, including increased offline shop duration, additional buff slots, expanded inventory and warehouse slots, more private store slots, increased item sale price to NPCs, bonus SP gain, increased Cursed Weapon drop rates, rent-able Strider pets, auto-loot functionality, and a dedicated VIP chat channel (though noted with a '-'). Several fixes related to VIPs have also been implemented, addressing issues with offline trade checks, sell list price view, auto-loot handlers, and pet rentals. A handler for defining VIP characters has also been added, likely for GM use. Strategically, this system aims to monetize or reward dedicated players, offering tangible in-game advantages that could encourage spending or engagement to reach higher tiers.

- **PvPers (including Olympiads, Sieges, Clan War Zones, PK):** A significant number of changes target the PvP experience.

  - **Olympiads:** Fixes were implemented for resurrection mechanics and HP display within the Olympiad system, improving the stability and clarity of competitive duels.
  - **Sieges:** Numerous fixes and features relate to Castle and Fortress Sieges. This includes corrections for lag caused by guards, door and wall life, building Headquarters, registering siege messages, removing the lord's crown upon castle loss, and fixes for pet rental during manor ownership changes. New mechanics include allowing magic hits on castle walls, war and siege declarations for privileged clan members, Residential Skills tied to castle/fortress ownership (with a fix for their removal in Olympiads), and the Fortress system is now stated to be fully functional. Siegeable Halls were also added. These changes aim to make sieges more functional, strategic, and rewarding for participating clans and players.
  - **General PvP & PK:** Fixes for various PvP Skills were added. The PvP Color system and PvP Chat were implemented, providing visual and communicative distinctions for players engaged in PvP. Applying the PvP flag from one's own summon was fixed, correcting an interaction mechanic. PK drop penalties were fixed, ensuring consistency in consequences for player killing. A Rank PvP System with a `/pvpinfo` handler was added, promoting competition and recognition among PvPers. A Clan War Zone was introduced which operates without the standard PvP flag, allowing focused clan combat.
  - **Cursed Weapons (Zariche & Akamanah):** These unique PvP items received attention. Their addition as NPCs and the CW Morph mechanic (transforming the owner into a demonic mode upon picking up the weapon) were added. The VIP system includes a bonus to CW drop rate at level 3, linking VIP benefits to high-stakes PvP content. Fixes related to the Clan Leader Wynvern Exploit might be indirectly related to CWs if they involve this weapon.

- **Raiders:** Raid Bosses received significant updates. Their drops and defenses were updated. Information display (`RaidBossInfo`) for new custom Raid Bosses was added. Several new Raid Boss NPCs are listed, including Baylor, Erigon, Dark Dragon, Kaion, Headless, Rahuu, Zariche, and Akamanah. The Raid Engine itself was added. Enhanced Boss Jewels were added as new items, likely dropping from these bosses. These changes introduce new high-level challenges and rewards specifically for raiding groups.

- **New Players:** Changes intended to improve the initial player experience or introduce accessible features were made. New characters can have custom titles and issues with duplicating names were fixed. Quests 101-114, including new ones (111-114), were fixed/added, providing content and progression paths. Support for new `QuestState` methods like `playTutorialVoice` and `rewardItems` suggests potential for more interactive or guided questing. The Vitality buff likely assists with faster leveling initially. Features like Remote Class Master, Buff Shop, and Schema Buffer offer convenience and support that can benefit new players. The Saturday Double XP event encourages weekend play and faster progression for all, especially newer characters.

- **Clan Players:** Beyond siege mechanics, clan systems were enhanced. NoticeBBS for Clans and Clan Notice features improve communication. Clan skills can now be added to new members without a server restart. The clan level cap was extended up to 10. A user handler to copy the ally leader's clan crest was added (`/copycrest`). These changes strengthen clan functionality, organization, and progression.

- **Summoner Class Players:** Specific fixes were made for summon HP/MP, soul crystal leveling with summons, and the interaction between summons and applying the PvP flag. The owner's name is now displayed above the summon's name, improving clarity. These address mechanics specific to summoner classes.

- **All Players / Gameplay Convenience:** Numerous features benefit all players. Offline Trade allows players to sell items while logged off. Npc To Pc enables new gameplay interactions. The Buff Shop and Schema Buffer provide convenient access to buffs. Various commands like `tradeon`, `tradeoff`, `lootoff`, `looton`, `engage`, `divorce`, `gotolove` add user-controlled functionalities. Events like Saturday Double XP and Trivia Event offer periodic engagement and rewards. Custom class icons and NPC crests add visual customization. New consumable items like Buff Juices and Bless Crystals expand item utility. Elixirs were updated. Support for SP Scrolls was added. New zones like Kamaloka (an 8-player instance), Castle of Etis, Astatine fortress, Fantasy island, Coliseum, Pagan temple, R4 arena, Steel cidatel, and Tribute arena add substantial new areas for exploration, combat, and potentially farming or events. New items and item sets (Vesper, Ertheia, Enhanced Boss Jewels, Dynasty with Shoulders, Goddess Infinity Weapons, numerous armor sets from mods) provide new gear progression goals for all player types.

**II. Technical Aspects:**

These changes focus on the underlying functionality, stability, performance, and infrastructure of the server.

- **Stability & Bug Fixes:** This is the largest category, addressing a wide range of issues.

  - **General Fixes:** Many core mechanics received fixes, including Warehouse, argument handling, trade bugs and protection, minimum trade distance, GM Stores, Guards & Chests random walk, Player Weight, Potions, Shortcut register updates, Recipe list limit, and NPC Growing Up. Issues with NPE (Null Pointer Exception) were fixed in item/set creation and respawnall. Critical Errors (PHX) related to chat length were fixed.
  - **Skill, Effect, Target Fixes:** A large number of specific skills and effects were fixed, ensuring they function correctly. This includes toggle skills on weapon change, Salvation & PhoenixBless, Shield of Revenge, Protection Blessing, Invocation, ClanGate, Divine Inspiration, Mana Recharge, Festive Sweeper, Mystic Immunity, Summon Arrow, Fake Death, Chameleon Rest, FistFury, Relax, Silent Move, Touch of Death, Cancel, Symbols & Signets, Master Blessing, Mirage. Effects like Fusion, Chameleon, and Abort Cast were fixed. Targeting issues, including Undead, Aura, FRONT AREA, BEHIND AREA, and target bugs on some mobs, were corrected. Combat mechanics fixes include Blow Skills with soulshots, RemoveTarget stopping actions, Backstab mechanics, Blow skills canceling cast, ActionShift and Recall Targets, and fixing the Top Class buff.
  - **Item & Enchanting Fixes:** Fixes for crystalizing Shadow Items, Primeval Crystals, equipping arrows with bows, and Augment shield bugs. Enchanting protections were added, and Over+ enchanting had specific fixes. Item usage restrictions while stunned, confused, enchanting, paralyzed, or rooted were fixed.
  - **Exploit Prevention:** Critical exploits were fixed, including CP exploit, Multisell exploit, Trade exploits, Boat Exploit, Drop & Sell items + PHX exploit, and Clan Leader Wynvern Exploit. Protection systems were implemented against L2Walker, logging in with over+ enchanted items, GmEnchanting, Unknow Packets, HlApEx, PHX Attack items, and PHX Teleport. Blocking item use while paralyzed serves as exploit prevention.
  - **System Fixes:** Fixes for SubClass Delay, removing effects before deleting subclass, and death penalty. Fixing issues with characters being jailed in Seven Signs addresses event stability. Fixes for `inFront` calculation, force buffs, signets, and AI exceptions improve combat reliability.

- **Protection Systems:** Several explicit protection systems were added to combat cheating and exploits. These include L2Walker protection, protections against over+ enchanted items (login, enchanting), blocking item use while paralyzed, Unknown Packet Protection, HlApEx protection, PHX item attack/teleport/exploit protection, and an IPv4 Filter update. The DeadlockDetector also enhances system robustness. These are strategically significant for maintaining a fair and stable game environment.

- **Performance & Infrastructure:** Core technical components were updated. The server engine was updated to Java8. The database connection pool was changed from c3p0 to HikariCP, which typically provides better performance. The database structure itself underwent a rework. Datapack files were converted from CSV/XML to SQL, which can improve data loading performance and management. Configurations were reworked. The addition of a DeadlockDetector helps identify and potentially prevent server hangs. These updates are critical for server scalability, responsiveness, and long-term stability.

- **New Content & Systems:** Beyond the player-facing features, new underlying systems and content were integrated. This includes the full Raid Engine, the VIP System engine, handlers for TradeBlock, Remote Class Master, Offline Trade, Npc To Pc, Buff Shop, Schema Buffer, and the Rank PvP System. New zones, NPCs, and items were added as detailed in the player impact section. Commands for GMs (`AdminBuffs`, `AdminMassRecall`, `//create_set`, `//dropmonster`, Skill time modify handler) were added, improving server management and event capabilities. Server shutdown functionality was updated with abort support and a countdown. New statistics (`cAtkAdd`, Elements Stats, `FallVuln`) and effects (`EffectImmobileUntilAttacked`, `EffectInterrupt`, `Debuff`, `Physical Attack Mute`) were added, expanding combat mechanics. The Multisell system was reworked. Support for `staticReuse`, `staticHitTime`, and `random mHits` was added, providing more granular control over skill and combat pacing. Support for Chance Skills was also added. A new class `ExShowScreenMessage` was introduced, likely for server-wide or targeted messaging. A 'Custom env' setting was added.

- **Balancing Changes:** Specific adjustments were made to balance aspects of gameplay, such as updating Raid Boss drops and defenses, removing Battle/Spell force from Dino mobs, updating Elixirs, Orc mages recovering mana on normal attacks, adding random damage for physical attacks, and the shield usage rework. Modifying skill times via GM handler also falls under balancing capabilities.

- **Removed/Deprecated Content:** Some systems and content were removed or marked as deprecated, including Custom Tables (like Frintezza Manager), IRC, JMX, FOS, Voiced Handlers, Faction System, Castle Door Upgrade, and the Disron Area + Village zone due to conflicts. This indicates cleanup or shifts in focus for server features.

**General Fixes:**

Numerous corrections were implemented across various aspects of the server. These included:

- **Core Mechanics::**
  - Fixes for Doors & Walls life.
  - Corrections for new characters duplicating names.
  - Fixes for the CP Exploit.
  - Correction for crystallizing Shadow Items.
  - Fixes for lag in sieges related to Guards (specifically rev 18 mentioned).
  - Corrections for the Multisell exploit.
  - Fixes for the black icon issue in Multisell (5 characters).
  - Corrections for trade argumentation and trade bugs.
  - Fixes for the minimum trade distance and trade protection.
  - Correction for Warehouse functionality.
  - Fixes for using items while under various status effects: isStunned, isConfused, isEnchanting, isParalyzed, isRooted.
  - Correction for Summon HP/MP.
  - Fixes for the Boat Exploit.
  - Correction for Critical Error (PHX) related to chat messages over 100 characters.
  - Fixes for Drop & Sell items exploits, including a PHX exploit fix.
  - Correction for the Clan Leader Wynvern Exploit.
  - Fixes for Primeval Crystal.
  - Corrections for Blow Skills used with soulshots.
  - Fixes for GM Stores.
  - Corrections for Guards & Chests having random walk.
  - Fixes for soul crystal leveling with summon.
  - Correction for jailing characters while in Seven Signs.
  - Fixes for applying PvP flag from own summon.
  - Correction for removing effects before deleting subclass.
  - Fixes for death penalty and PK drop.
  - Backstab skills no longer ignore TP, and blow skills can now cancel cast.
  - Shield usage underwent a rework.
  - Fixes for NPE & autospawn/autochat in respawnall.
  - Correction for boss drops.
  - Fixes for Npc Growing Up.
  - Correction for Player Weight.
  - Fixes for GM Audit.
  - Correction for Build Headquarter functionality.
  - Fixes for inFront calculation, force buffs, signets, and IA exceptions.
  - Correction for Potions.
  - Fixes for NPE when creating items/sets, adding ArmorSetsTable reload to item reload.
  - Fixes for equipping arrows when equipping a bow.
  - Correction for a bug when equipping a shield with Augment.
  - Removal of the lord's crown on castle loss.
  - Updates to Elixirs.
  - Fixes for an Augment shield bug.
  - Updates to Shortcut registration.
  - Corrections for the recipe list limit.
  - Fixes for registering siege messages.
  - Correction for target bugs of some skills on mobs.
  - Fixes for Quests 101-114 (including new quests 111-114 based on L2JDP latest revision).
  - Corrections in ActionShift and Recall Targets.
- **Olympiads::**
  - Fixes related to Olympiads.
  - Correction for resurrection in Olympiads.
  - Fixes in the HP display during Olympiads.
- **Skills::**
  - Added fix for toggle skills remaining active after weapon changes.
  - Specific skill fixes mentioned include Salvation & PhoenixBless, Shield of Revenge, Protection Blessing, Invocation, ClanGate, Divine Inspiration, Mana Recharge, Festive Sweeper, Mystic Immunity, Summon Arrow, Fake Death, Chameleon Rest, FistFury, Relax, Silent Move, Touch of Death, Cancel, Symbols & Signets, Divine Inspiration, Master Blessing, Mirage.
  - Effect fixes include Fusion, Chameleon, Abort Cast, EffectImmobileUntilAttacked, EffectInterrupt, Debuff, Physical Attack Mute.
  - Targeting fixes include Target Undead, Target Aura, Target FRONT AREA, Target BEHIND AREA.
  - Fixes to PvP Skills.
  - Corrections for COREDONE, Mage Bane & Warrior Bane skills.
  - Fixes for Residential Skills.
- **VIP System::**
  - Fixes applied when checking VIPs for Offline Trade.
  - Fixes for Sell List price view for VIPs.
  - Correction for renting pets for VIPs and for manor when the castle loses possession.

**VIP System:**

A detailed VIP system with four levels was introduced:

| Level | Offline Shop Duration | Buff Slots | Inventory/Warehouse Slots | Private Store Slots | Other Benefits                                 |
| :---- | :-------------------- | :--------- | :------------------------ | :------------------ | :--------------------------------------------- |
| 1     | 3h                    | +1         | -                         | -                   | VIP Buff                                       |
| 2     | 5h                    | +1         | +5 inv & wh               | +1                  | VIP1 + +10% item price selling to NPC          |
| 3     | 8h                    | +1         | +10 inv & wh              | +2                  | VIP2 + +30% SP, +10% CW Drop, Strider Pet Rent |
| 4     | 12h                   | +1         | +20 inv & wh              | +3                  | VIP3 + Auto-loot, VIP Chat (-)                 |

**Zones:**

Specific zones and their coordinates are listed. One zone, Disron Area + Village, is marked as DEPRECATED due to a conflict with Kamaloka. Tower of Naia is noted to have 'bug doors'.

Here is a table detailing the zones and their coordinates:

| Zone Name             | Description                        | Coordinates (X, Y, Z)            |
| :-------------------- | :--------------------------------- | :------------------------------- |
| Castle of Etis        | -                                  | -81948, 28276, 3055              |
| Disron Area + Village | DEPRECATED, conflict with Kamaloka | -8616, -217704, -3144 (Area)     |
|                       |                                    | -15960, -192648, -3688 (Village) |
| Astatine fortress     | -                                  | -48792, 16632, -3200             |
|                       |                                    | -56904, 12376, -3368             |
|                       |                                    | -51656, 22600, -8576             |
| Fantasy island        | -                                  | -67244, -58200, -2685            |
|                       |                                    | -70360, -69768, -1489            |
| Coliseum              | -                                  | -80591, -49404, -10417           |
| Kamaloka              | 8 players                          | -20296, -185528, -9992           |
| Pagan temple          | -                                  | -16353, -37255, -10751           |
| R4 arena              | -                                  | -114664, -121320, -1984          |
| Steel citadel         | -                                  | -114829, -11612, -9647           |
|                       |                                    | -117488, -13664, -7496           |
|                       |                                    | -115568, -17008, -9648           |
|                       |                                    | -116470, -11733, -7493.692383    |
|                       |                                    | -113994, -13174, -9648           |
|                       |                                    | -117472, -15488, -7496           |
|                       |                                    | -112464, -11024, -7496           |
|                       |                                    | -112256, -16016, -7496           |
|                       |                                    | -115010, -12077, -7498           |
| Tribute arena         | -                                  | -112856, -144072, -4504          |
| Tower of Naia (Bugs)  | Bug doors                          | 12472, 215272, -9480             |
|                       |                                    | 12472, 214472, -9384             |
|                       |                                    | 16344, 213064, -9384             |
|                       |                                    | 16328, 210232, -9384             |
