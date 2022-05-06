import Ship from "./shipFactory.js";

let testShip;
beforeEach(() => {
    testShip = new Ship(4);
});

it("Ship has length", () => {
    expect(testShip.size).toBe(4);
});

it("Ship can be hit", () => {
    testShip.hit(2);
    expect(testShip.hits).toContain(2);
});

it("Ship can be sunk", () => {
    testShip.hit(1);
    testShip.hit(2);
    testShip.hit(3);
    testShip.hit(4);
    expect(testShip.isSunk()).toBe(true);
});

it("Doesn't sink with half hits", () => {
    testShip.hit(1);
    testShip.hit(2);
    expect(testShip.isSunk()).toBe(false);
})