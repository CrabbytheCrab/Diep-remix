"use strict";
/*
    DiepCustom - custom tank game server that shares diep.io's WebSocket protocol
    Copyright (C) 2022 ABCxFF (github.com/ABCxFF)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddonById = exports.GuardObject = exports.Addon = void 0;
const Object_1 = require("../Object");
const AutoTurret_1 = require("./AutoTurret");
const Enums_1 = require("../../Const/Enums");
const AI_1 = require("../AI");
/**
 * Abstract class to represent an addon in game.
 *
 * Addons are entities added on to a tank during its creation. There are two types:
 * pre addons, and post addons. Pre addons are built before the barrels are built - for example
 * a dominator's base is a pre addon. A post addon is an addon built after the barrels are
 * built - for example the pronounciation of Ranger's barrel is a post addon.
 *
 * Read [addons.md on diepindepth](https://github.com/ABCxFF/diepindepth/blob/main/extras/addons.md)
 * for more details and examples.
 */
class Addon {
    constructor(owner) {
        this.owner = owner;
        this.game = owner.game;
    }
    /**
     * `createGuard` method creates a smasher-like guard shape.
     * Read (addons.md on diepindepth)[https://github.com/ABCxFF/diepindepth/blob/main/extras/addons.md]
     * for more details and examples.
     */
    createGuard(sides, sizeRatio, offsetAngle, radiansPerTick) {
        return new GuardObject(this.game, this.owner, sides, sizeRatio, offsetAngle, radiansPerTick);
    }
    /**
     * `createAutoTurrets` method builds `count` auto turrets around the current
     * tank's body.
     */
    createAutoTurrets(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        const ROT_OFFSET = 0.8;
        if (rotator.style.values.styleFlags & Enums_1.StyleFlags.visible)
            rotator.style.values.styleFlags ^= Enums_1.StyleFlags.visible;
        const PI2 = Math.PI * 2;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, AutoTurretMiniDefinition);
            const angle = base.ai.inputs.mouse.angle = PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (target) => {
                const angleToTarget = Math.atan2(target.position.values.y - this.owner.position.values.y, target.position.values.x - this.owner.position.values.x);
                const deltaAngle = Math.abs(angleToTarget - (angle + rotator.position.values.angle)) % (Math.PI * 2);
                return deltaAngle < Math.PI / 2;
            };
            base.position.values.y = this.owner.physics.values.size * Math.sin(angle) * ROT_OFFSET;
            base.position.values.x = this.owner.physics.values.size * Math.cos(angle) * ROT_OFFSET;
            if (base.style.values.styleFlags & Enums_1.StyleFlags.aboveParent)
                base.style.values.styleFlags ^= Enums_1.StyleFlags.aboveParent;
            base.physics.values.objectFlags |= Enums_1.MotionFlags.absoluteRotation;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.position.y = this.owner.physics.values.size * Math.sin(angle) * ROT_OFFSET;
                base.position.x = this.owner.physics.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === AI_1.AIState.idle)
                    base.position.angle = angle + rotator.position.values.angle;
            };
        }
    }
    createAutoStalkerTurrets(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        const ROT_OFFSET = 0.8;
        if (rotator.style.values.styleFlags & Enums_1.StyleFlags.visible)
            rotator.style.values.styleFlags ^= Enums_1.StyleFlags.visible;
        const PI2 = Math.PI * 2;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, AutoTurretStalkDefinition);
            const angle = base.ai.inputs.mouse.angle = PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (target) => {
                const angleToTarget = Math.atan2(target.position.values.y - this.owner.position.values.y, target.position.values.x - this.owner.position.values.x);
                const deltaAngle = Math.abs(angleToTarget - (angle + rotator.position.values.angle)) % (Math.PI * 2);
                return deltaAngle < Math.PI / 2;
            };
            base.position.values.y = this.owner.physics.values.size * Math.sin(angle) * ROT_OFFSET;
            base.position.values.x = this.owner.physics.values.size * Math.cos(angle) * ROT_OFFSET;
            if (base.style.values.styleFlags & Enums_1.StyleFlags.aboveParent)
                base.style.values.styleFlags ^= Enums_1.StyleFlags.aboveParent;
            base.physics.values.objectFlags |= Enums_1.MotionFlags.absoluteRotation;
            const tickBase = base.tick;
            base.tick = (tick) => {
                base.position.y = this.owner.physics.values.size * Math.sin(angle) * ROT_OFFSET;
                base.position.x = this.owner.physics.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === AI_1.AIState.idle)
                    base.position.angle = angle + rotator.position.values.angle;
            };
        }
    }
    createMegaAutoTurrets(count) {
        const rotPerTick = AI_1.AI.PASSIVE_ROTATION;
        const rotator = this.createGuard(1, .1, 0, rotPerTick);
        const ROT_OFFSET = 0.8;
        if (rotator.style.values.styleFlags & Enums_1.StyleFlags.visible)
            rotator.style.values.styleFlags ^= Enums_1.StyleFlags.visible;
        const PI2 = Math.PI * 2;
        for (let i = 0; i < count; ++i) {
            const base = new AutoTurret_1.default(rotator, AutoTurretMegaDefinition);
            const angle = base.ai.inputs.mouse.angle = PI2 * (i / count);
            base.ai.passiveRotation = rotPerTick;
            base.ai.targetFilter = (target) => {
                const angleToTarget = Math.atan2(target.position.values.y - this.owner.position.values.y, target.position.values.x - this.owner.position.values.x);
                const deltaAngle = Math.abs(angleToTarget - (angle + rotator.position.values.angle)) % (Math.PI * 2);
                return deltaAngle < Math.PI / 2;
            };
            //base.physics.values.size = 5 * 1000 * base.sizeFactor
            base.position.values.y = this.owner.physics.values.size * Math.sin(angle) * ROT_OFFSET;
            base.position.values.x = this.owner.physics.values.size * Math.cos(angle) * ROT_OFFSET;
            if (base.style.values.styleFlags & Enums_1.StyleFlags.aboveParent)
                base.style.values.styleFlags ^= Enums_1.StyleFlags.aboveParent;
            base.physics.values.objectFlags |= Enums_1.MotionFlags.absoluteRotation;
            const tickBase = base.tick;
            base.tick = (tick) => {
                //  base.physics.values.size = 5 * 1000 * base.sizeFactor
                base.position.y = this.owner.physics.values.size * Math.sin(angle) * ROT_OFFSET;
                base.position.x = this.owner.physics.values.size * Math.cos(angle) * ROT_OFFSET;
                tickBase.call(base, tick);
                if (base.ai.state === AI_1.AIState.idle)
                    base.position.angle = angle + rotator.position.values.angle;
            };
        }
    }
}
exports.Addon = Addon;
const AutoTurretStalkDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 38 * 0.7,
    delay: 0.01,
    reload: 1,
    recoil: 0,
    isTrapezoid: true,
    trapezoidDirection: 3.141592653589793,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 0.3,
        speed: 1.7,
        scatterRate: 0,
        lifeLength: 1.2,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const AutoTurretMiniDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 42 * 0.7,
    delay: 0.01,
    reload: 1,
    recoil: 0.3,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1,
        damage: 0.4,
        speed: 1.2,
        scatterRate: 0,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 1
    }
};
const AutoTurretMegaDefinition = {
    angle: 0,
    offset: 0,
    size: 55,
    width: 56 * 0.7,
    delay: 0.01,
    reload: 2.5,
    recoil: 0.3,
    isTrapezoid: false,
    trapezoidDirection: 0,
    addon: null,
    bullet: {
        type: "bullet",
        health: 1.5,
        damage: 0.8,
        speed: 1,
        scatterRate: 0,
        lifeLength: 1,
        sizeRatio: 1,
        absorbtionFactor: 0.5
    }
};
/**
 * A smasher-like guard object.
 * Read (addons.md on diepindepth)[https://github.com/ABCxFF/diepindepth/blob/main/extras/addons.md]
 * for more details and examples.
 */
class GuardObject extends Object_1.default {
    constructor(game, owner, sides, sizeRatio, offsetAngle, radiansPerTick) {
        super(game);
        this.owner = owner;
        this.inputs = owner.inputs;
        this.cameraEntity = owner.cameraEntity;
        // It's weird, but it's how it works
        sizeRatio *= Math.SQRT1_2;
        this.sizeRatio = sizeRatio;
        this.radiansPerTick = radiansPerTick;
        this.setParent(owner);
        this.relations.values.owner = owner;
        this.relations.values.team = owner.relations.values.team;
        this.style.values.color = Enums_1.Colors.Border;
        this.position.values.motion |= Enums_1.MotionFlags.absoluteRotation;
        this.position.values.angle = offsetAngle;
        this.physics.values.sides = sides;
        this.reloadTime = owner.reloadTime;
        this.physics.values.size = owner.physics.values.size * sizeRatio;
    }
    /**
     * Size factor, used for calculation of the turret and base size.
     */
    get sizeFactor() {
        return this.owner.sizeFactor;
    }
    /**
     * Called (if ever) similarly to LivingEntity.onKill
     * Spreads onKill to owner
     */
    onKill(killedEntity) {
        // TODO(ABC):
        // Make this, work differently (Maybe KillerEntity interface)
        /** @ts-ignore */
        if (typeof this.owner.onKill === 'function')
            this.owner.onKill(killedEntity);
    }
    tick(tick) {
        this.reloadTime = this.owner.reloadTime;
        this.physics.size = this.sizeRatio * this.owner.physics.values.size;
        this.position.angle += this.radiansPerTick;
        // It won't ever do any collisions, so no need to tick the object
        // super.tick(tick);
    }
}
exports.GuardObject = GuardObject;
class Mega3Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createMegaAutoTurrets(3);
    }
}
/** Spikes addon. */
class SpikeAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(3, 1.3, 0, 0.17);
        this.createGuard(3, 1.3, Math.PI / 3, 0.17);
        this.createGuard(3, 1.3, Math.PI / 6, 0.17);
        this.createGuard(3, 1.3, Math.PI / 2, 0.17);
    }
}
/** Dominator's Base addon. */
class DomBaseAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.24, 0, 0);
    }
}
/** Smasher addon. */
class SmasherAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.15, 0, .1);
    }
}
class MegaSmasherAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.3, 0, .1);
    }
}
class SawAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(4, 1.2, 0, .1);
    }
}
/** Landmine addon. */
class LandmineAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.15, 0, .1);
        this.createGuard(6, 1.15, 0, .05);
    }
}
/** The thing underneath Rocketeer and Twister addon. */
class LauncherAddon extends Addon {
    constructor(owner) {
        super(owner);
        const launcher = new Object_1.default(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 33.6 / 50;
        const size = this.owner.physics.values.size;
        launcher.setParent(this.owner);
        launcher.relations.values.owner = this.owner;
        launcher.relations.values.team = this.owner.relations.values.team;
        launcher.physics.values.size = sizeRatio * size;
        launcher.physics.values.width = widthRatio * size;
        launcher.position.values.x = launcher.physics.values.size / 2;
        launcher.style.values.color = Enums_1.Colors.Barrel;
        launcher.physics.values.objectFlags |= Enums_1.ObjectFlags.isTrapezoid;
        launcher.physics.values.sides = 2;
        launcher.tick = () => {
            const size = this.owner.physics.values.size;
            launcher.physics.size = sizeRatio * size;
            launcher.physics.width = widthRatio * size;
            launcher.position.x = launcher.physics.values.size / 2;
        };
    }
}
class LauncherAddon2 extends Addon {
    constructor(owner) {
        super(owner);
        const launcher2 = new Object_1.default(this.game);
        const sizeRatio = 65.5 * Math.SQRT2 / 50;
        const widthRatio = 1.2;
        const size = this.owner.physics.values.size;
        launcher2.setParent(this.owner);
        launcher2.relations.values.owner = this.owner;
        launcher2.relations.values.team = this.owner.relations.values.team;
        launcher2.physics.values.size = sizeRatio * size;
        launcher2.physics.values.width = widthRatio * size;
        launcher2.position.values.x = launcher2.physics.values.size / 2;
        launcher2.style.values.color = Enums_1.Colors.Barrel;
        //launcher.physics.values.objectFlags |= ObjectFlags.isTrapezoid;
        launcher2.physics.values.sides = 2;
        launcher2.tick = () => {
            const size = this.owner.physics.values.size;
            launcher2.physics.size = sizeRatio * size;
            launcher2.physics.width = widthRatio * size;
            launcher2.position.x = launcher2.physics.values.size / 2;
        };
    }
}
/** Centered Auto Turret addon. */
class AutoTurretAddon extends Addon {
    constructor(owner) {
        super(owner);
        new AutoTurret_1.default(owner);
    }
}
/** Smasher + Centered Auto Turret addon. */
class AutoSmasherAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(6, 1.15, 0, .1);
        //new AutoTurret(owner);
        const base = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 40,
            width: 26.25,
            delay: 0,
            reload: 2,
            recoil: 0.75,
            isTrapezoid: true,
            trapezoidDirection: 3.141592653589793,
            addon: null,
            bullet: {
                type: "bullet",
                health: 1,
                damage: 0.6,
                speed: 1.2,
                scatterRate: 0,
                lifeLength: 1,
                sizeRatio: 1,
                absorbtionFactor: 1
            }
        });
        new LauncherAddon(base);
    }
}
/** 5 Auto Turrets */
class Auto5Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurrets(5);
    }
}
/** 3 Auto Turrets */
class Auto3Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurrets(3);
    }
}
class Stalker3Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoStalkerTurrets(3);
    }
}
/** The thing above ranger's barrel. */
class PronouncedAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const sizeRatio = 50 / 50;
        const widthRatio = 42 / 50;
        const offsetRatio = 40 / 50;
        const size = this.owner.physics.values.size;
        pronounce.setParent(this.owner);
        pronounce.relations.values.owner = this.owner;
        pronounce.relations.values.team = this.owner.relations.values.team;
        pronounce.physics.values.size = sizeRatio * size;
        pronounce.physics.values.width = widthRatio * size;
        pronounce.position.values.x = offsetRatio * size;
        pronounce.position.values.angle = Math.PI;
        pronounce.style.values.color = Enums_1.Colors.Barrel;
        pronounce.physics.values.objectFlags |= Enums_1.ObjectFlags.isTrapezoid;
        pronounce.physics.values.sides = 2;
        pronounce.tick = () => {
            const size = this.owner.physics.values.size;
            pronounce.physics.size = sizeRatio * size;
            pronounce.physics.width = widthRatio * size;
            pronounce.position.x = offsetRatio * size;
        };
    }
}
/** The thing above Gunner + Destroyer Dominator's barrel. */
class PronouncedDomAddon extends Addon {
    constructor(owner) {
        super(owner);
        const pronounce = new Object_1.default(this.game);
        const sizeRatio = 22 / 50;
        const widthRatio = 35 / 50;
        const offsetRatio = 50 / 50;
        const size = this.owner.physics.values.size;
        pronounce.setParent(this.owner);
        pronounce.relations.values.owner = this.owner;
        pronounce.relations.values.team = this.owner.relations.values.team;
        pronounce.physics.values.size = sizeRatio * size;
        pronounce.physics.values.width = widthRatio * size;
        pronounce.position.values.x = offsetRatio * size;
        pronounce.position.values.angle = Math.PI;
        pronounce.style.values.color = Enums_1.Colors.Barrel;
        pronounce.physics.values.objectFlags |= Enums_1.ObjectFlags.isTrapezoid;
        pronounce.physics.values.sides = 2;
        pronounce.tick = () => {
            const size = this.owner.physics.values.size;
            pronounce.physics.size = sizeRatio * size;
            pronounce.physics.width = widthRatio * size;
            pronounce.position.x = offsetRatio * size;
        };
    }
}
/** Weird spike addon. Based on the arrasio Original. */
class WeirdSpikeAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(3, 1.5, 0, 0.17);
        this.createGuard(3, 1.5, 0, -0.16);
    }
}
/** 2 Auto Turrets */
class Auto2Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurrets(2);
    }
}
/** 7 Auto Turrets */
class Auto7Addon extends Addon {
    constructor(owner) {
        super(owner);
        this.createAutoTurrets(7);
    }
}
/** Centered Auto Rocket addon. */
class AutoRocketAddon extends Addon {
    constructor(owner) {
        super(owner);
        const base = new AutoTurret_1.default(owner, {
            angle: 0,
            offset: 0,
            size: 40,
            width: 26.25,
            delay: 0,
            reload: 2,
            recoil: 0.75,
            isTrapezoid: true,
            trapezoidDirection: 3.141592653589793,
            addon: null,
            bullet: {
                type: "rocket",
                sizeRatio: 1,
                health: 2.5,
                damage: 0.5,
                speed: 0.3,
                scatterRate: 1,
                lifeLength: 0.75,
                absorbtionFactor: 0.1
            }
        });
        new LauncherAddon(base);
        base.turret.style.zIndex += 2;
    }
}
/** SPIESK addon. */
class SpieskAddon extends Addon {
    constructor(owner) {
        super(owner);
        this.createGuard(4, 1.3, 0, 0.17);
        this.createGuard(4, 1.3, Math.PI / 6, 0.17);
        this.createGuard(4, 1.3, 2 * Math.PI / 6, 0.17);
    }
}
/**
 * All addons in the game by their ID.
 */
exports.AddonById = {
    spike: SpikeAddon,
    dombase: DomBaseAddon,
    launcher: LauncherAddon,
    laucher2: LauncherAddon2,
    dompronounced: PronouncedDomAddon,
    auto5: Auto5Addon,
    auto3: Auto3Addon,
    autosmasher: AutoSmasherAddon,
    pronounced: PronouncedAddon,
    smasher: SmasherAddon,
    megasmasher: MegaSmasherAddon,
    saw: SawAddon,
    landmine: LandmineAddon,
    autoturret: AutoTurretAddon,
    mega3: Mega3Addon,
    stalker3: Stalker3Addon,
    // not part of diep
    weirdspike: WeirdSpikeAddon,
    auto7: Auto7Addon,
    auto2: Auto2Addon,
    autorocket: AutoRocketAddon,
    spiesk: SpieskAddon
};
