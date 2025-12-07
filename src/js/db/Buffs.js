import { DbObjectListSerialize } from "../classes/DbObject/List/Serialize";
import { Artifacts } from "./Buffs/Artifacts";
import { CovenResonance } from "./Buffs/CovenResonance";
import { ElementalResonance } from "./Buffs/ElementalResonance";
import { MoonsignResonance } from "./Buffs/MoonsignResonance";
import { Static } from "./Buffs/Static";
import { Weapons } from "./Buffs/Weapons";

export const Buffs = new DbObjectListSerialize({
    ElementalResonance: ElementalResonance,
    MoonsignResonance: MoonsignResonance,
    CovenResonance: CovenResonance,
    Artifacts: Artifacts,
    Weapons: Weapons,
    Static: Static,
});
