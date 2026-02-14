import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Set "mo:core/Set";

actor {
  public shared ({ caller }) func completeLevel(user : Principal, level : Nat) : async Bool {
    if (level > 10) {
      return false;
    };
    let completedLevels = Set.empty<Nat>();

    // Check if the level is already completed.
    if (completedLevels.contains(level)) {
      return false;
    };

    completedLevels.add(level);
    true;
  };

  public query ({ caller }) func isBadgeMinted(_user : Principal) : async Bool {
    false;
  };

  public query ({ caller }) func isLevelCompleted(user : Principal, _level : Nat) : async Bool {
    switch (Map.empty<Principal, Set.Set<Nat>>().get(user)) {
      case (null) { false };
      case (_) { true };
    };
  };

  public query ({ caller }) func getCompletedLevelsCount(_user : Principal) : async Nat {
    0;
  };
};
