const bulletArgs = {
    // Canvas context will be provided by something else
    // x and y will be randomised

    width: 50,
    height: 50,
    movementVector: -5, // Moves to the length
    
    // target will be passed by something else
    event: "playerHit",
    objToPassOnCollide: { damage: 1 }, 
    
    spriteSrc: "./assets/bullet.png",
};

export default bulletArgs;