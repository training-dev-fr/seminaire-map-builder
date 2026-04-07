export default async function loadTile(file, countX, countY) {
    const result = await fetch('./tiles/' + file);

    let listTile = {
        image: await createImageBitmap(await result.blob()),
        listItem: []
    };

    let stepX = listTile.image.width / countX;
    let stepY = listTile.image.height / countY;
    for (let y = 0; y < countY; y++) {
        for (let x = 0; x < countX; x++) {
            listTile.listItem.push(await createImageBitmap(listTile.image, stepX * x, stepY * y, stepX, stepY));
        }
    }

    return listTile;
}