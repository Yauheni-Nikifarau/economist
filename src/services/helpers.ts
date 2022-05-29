export const findItemById = (array: Array<any>, id: number) => {
    return array.find((item) => {
        return item.id === id;
    });
}