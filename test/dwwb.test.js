const { group, test, command, beforeStart, afterAll, expect } = require("corde");
// You can also import const corde = require("corde"); This is a default export with all others
// functions.
const { client, loginBot } = require("../dwwb");

beforeStart(() => {
  loginBot();
});

group("vote commands", () => {
  const expectedVoteMsg = {
    title: "It's time to vote!",
    description: "🇦 vinavi\n\n🇧 toma27\n\n" + "🇨 kestoque\n\n🇩 allana\n\n" + "🇪 Migel d ths bish\n\n🇫 allana",
  };

  const expectedVoteMsgWithTitle = {
    title: "Ax goes swing! 🪓",
    description: "🇦 vinavi\n\n🇧 toma27\n\n" + "🇨 kestoque\n\n🇩 allana\n\n" + "🇪 Migel d ths bish\n\n🇫 allana",
  };

  test("!vote @cool role should send correct title, nicknames with letters, react correctly", () => {
    expect("vote <@&814437136761094144>").toHaveResult(
      expect.toEmbedMatch(expectedVoteMsg),
      expect.toAddReaction(["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "☮️"])
    );
  });

  test("!vote @cool role Ax goes swing! 🪓 should send correct title, nicknames with letters, react correctly", () => {
    expect("vote <@&814437136761094144> Ax goes swing! 🪓").toHaveResult(
      expect.toEmbedMatch(expectedVoteMsgWithTitle),
      expect.toAddReaction(["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "☮️"])
    );
  });
});

group("wheel commands", () => {
  const wheelExpectedMessage = {
    color: 12623579,
    title: "🎡🎡🎡 WHEEL WHEEL WHEEL 🎡🎡🎡",
  };

  /*test("wheel command should...", () => {
    expect("wheel <@&814437136761094144>").toEmbedMatch(wheelExpectedMessage);
  });*/
});

afterAll(() => {
  client.destroy();
});
