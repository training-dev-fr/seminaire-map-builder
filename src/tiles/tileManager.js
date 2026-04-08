export async function loadTileFromBlob(blob, tileWidth, tileHeight) {
    const listTile = {
        image: await createImageBitmap(blob),
        listItem: [],
    };

    const countX = Math.floor(listTile.image.width / tileWidth);
    const countY = Math.floor(listTile.image.height / tileHeight);

    for (let y = 0; y < countY; y++) {
        for (let x = 0; x < countX; x++) {
            listTile.listItem.push(
                await createImageBitmap(listTile.image, tileWidth * x, tileHeight * y, tileWidth, tileHeight)
            );
        }
    }

    return listTile;
}

export default async function loadTile(file, countX, countY) {
    const response = await fetch(`../tiles/${file}`);
    const blob = await response.blob();
    
    // Pour la rétrocompatibilité avec votre ancien code (tiles3.png avec 5 colonnes et 5 lignes)
    // On calcule la taille de la tuile en px pour l'image par défaut.
    const image = await createImageBitmap(blob);
    const tileWidth = image.width / countX;
    const tileHeight = image.height / countY;
    
    return loadTileFromBlob(blob, tileWidth, tileHeight);
}