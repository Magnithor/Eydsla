export interface Id {
    userId: number,
    rand: [number, number, number, number, number];
}

export function IdToString(id: Id | string) {
    if (typeof id === 'string') {
        return id;
    }
    return id.userId + "[" + id.rand[0] + " " + id.rand[1] + " " + id.rand[2] + " " + id.rand[3] + " " + id.rand[4] + "]";
}

export function NewId(userId: number) : Id {
    return { 
        userId: userId, 
        rand: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()]
    };
}