import React from "react";
import { CharIcon } from "../../Components/Icons";
import { Lang } from "../../Lang";

export class PartyList extends React.Component {
    constructor(props) {
        super(props);
        this.lang = new Lang();
    }

    handleCharSelect(index) {
        let currentIds = [
            this.props.settings.party_char_1,
            this.props.settings.party_char_2,
            this.props.settings.party_char_3,
        ];
        let excludeIds = [this.props.settings.char_id].concat(currentIds);

        UI.CharSelectReact.show({
            excludeIds: excludeIds,
            showEmpty: true,
            callback: (char) => {
                currentIds[index - 1] = char ? char.getId() : 0;
                this.props.onChange(currentIds);
            },
        });
    }

    getMoonsignLevel() {
        let level = 0;
        
        // Check main character
        let mainChar = DB.Chars.getById(this.props.settings.char_id);
        if (mainChar && mainChar.getOrigin() === 'nodkrai') {
            level++;
        }
        
        // Check party characters
        for (let i = 1; i <= 3; i++) {
            let char = DB.Chars.getById(this.props.settings['party_char_'+ i]);
            if (char && char.getOrigin() === 'nodkrai') {
                level++;
            }
        }
        
        return level;
    }

    getCovenLevel() {
        let level = 0;
        
        // Check main character
        let mainChar = DB.Chars.getById(this.props.settings.char_id);
        if (mainChar && mainChar.isCoven && mainChar.isCoven()) {
            level++;
        }
        
        // Check party characters
        for (let i = 1; i <= 3; i++) {
            let char = DB.Chars.getById(this.props.settings['party_char_'+ i]);
            if (char && char.isCoven && char.isCoven()) {
                level++;
            }
        }
        
        return level;
    }

    render() {
        let items = [];

        items.push(
            <CharIcon key={this.props.settings.char_id} char={DB.Chars.getById(this.props.settings.char_id)} />
        );

        for (let i = 1; i <= 3; i++) {
            let char = DB.Chars.getById(this.props.settings['party_char_'+ i]);
            items.push(
                <CharIcon
                    key={'party_char_'+ i}
                    char={char}
                    addClass="item"
                    onClick={() => this.handleCharSelect(i)}
                />
            );
        }

        let moonsignLevel = this.getMoonsignLevel();
        let moonsignDisplay = null;
        
        if (moonsignLevel > 0) {
            // Cap display at 2 (Supreme Radiance max)
            let displayLevel = Math.min(moonsignLevel, 2);
            moonsignDisplay = (
                <div className="moonsign-level">
                    <span className="moonsign-text">
                        {this.lang.get('buffs_name.moonsign_level')}:
                    </span>
                    <span className="moonsign-value">{displayLevel}</span>
                </div>
            );
        }

        let covenLevel = this.getCovenLevel();
        let covenDisplay = null;
        
        if (covenLevel > 0) {
            // Cap display at 2 (Secret Rite max)
            let displayLevel = Math.min(covenLevel, 2);
            covenDisplay = (
                <div className="moonsign-level coven-level">
                    <span className="moonsign-text">
                        {this.lang.get('buffs_name.coven_level')}:
                    </span>
                    <span className="moonsign-value">{displayLevel}</span>
                </div>
            );
        }

        return (
            <div className="buffs-char-list-wrapper">
                <div className="buffs-char-list">
                    {items}
                </div>
                {moonsignDisplay}
                {covenDisplay}
            </div>
        );
    }
}
