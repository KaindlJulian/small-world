export class Card {
    constructor(
        id,
        passcode,
        name,
        attribute,
        level,
        properties,
        text,
        atk,
        def,
        frame,
    ) {
        this.id = id;
        this.passcode = passcode;
        this.name = name;
        this.attribute = attribute;
        this.level = level;
        this.properties = properties;
        this.text = text;
        this.atk = atk;
        this.def = def;
        this.frame = frame;
    }
}
