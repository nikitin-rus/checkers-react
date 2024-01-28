export function getRowsCopy(rows) {
    const copy = [];
    for (let i = 0; i < rows.length; i++) {
        copy.push([]);
        for (let j = 0; j < rows[i].length; j++) {
            copy[i].push(rows[i][j]);
        }
    }
    return copy;
}