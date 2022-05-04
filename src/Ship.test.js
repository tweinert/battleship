import Ship from "./Ship";


it("Ship has length", () => {
  const ship = Ship(4);
  expect(ship.length).toBe(4);
});