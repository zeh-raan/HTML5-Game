const savattePickupArgs = {
    // Canvas context will be provided by something else
    // x and y will be randomised

    width: 80,
    height: 80,
    movementVector: -3, // Moves to the length
    
    // target will be passed by something else
    event: "savatteCollected",
    objToPassOnCollide: {}, 
    
    spriteSrc: "./assets/savatte_dodo.png",
};

export default savattePickupArgs;