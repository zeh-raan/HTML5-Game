const acornArgs = {
    // Canvas context will be provided by something else
    // x and y will be randomised

    width: 80,
    height: 80,
    movementVector: -2, // Moves to the length
    
    // target will be passed by something else
    event: "acornCollected",
    objToPassOnCollide: {}, 
    
    spriteSrc: "./assets/acorn.png",
};

export default acornArgs;