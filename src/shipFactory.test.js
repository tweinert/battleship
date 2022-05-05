import Ship from "./shipFactory.js";

let testShip;
beforeEach(() => {
    testShip = new Ship(4);
});

it("Ship has length", () => {
    expect(testShip.size).toBe(4);
});